import { ENTRYPOINT_ADDRESS_V06, UserOperation } from "permissionless";
import {
  Address,
  BlockTag,
  Hex,
  decodeAbiParameters,
  decodeFunctionData,
  erc20Abi,
} from "viem";
import { base } from "viem/chains";
import { client } from "./config";
import {
  coinbaseSmartWalletABI,
  coinbaseSmartWalletProxyBytecode,
  coinbaseSmartWalletV1Implementation,
  erc1967ProxyImplementationSlot,
  magicSpendAddress,
} from "./constants";
import { walletAbi, walletAddress } from "@/ABIs/wallet";

function isWalletAddress(address: Address) {
  return address.toLowerCase() === walletAddress.toLowerCase();
}

export async function willSponsor({
  chainId,
  entrypoint,
  userOp,
}: {
  chainId: number;
  entrypoint: string;
  userOp: UserOperation<"v0.6">;
}) {
  console.log("utils");
  console.log("chainId", chainId);
  console.log("entrypoint", entrypoint);
  console.log("userOp", userOp);
  // check chain id
  if (chainId !== base.id) return false;
  // check entrypoint
  // not strictly needed given below check on implementation address, but leaving as example
  if (entrypoint.toLowerCase() !== ENTRYPOINT_ADDRESS_V06.toLowerCase())
    return false;

  try {
    // check the userOp.sender is a proxy with the expected bytecode
    const code = await client.getBytecode({ address: userOp.sender });
    if (code != coinbaseSmartWalletProxyBytecode) return false;

    // check that userOp.sender proxies to expected implementation
    const implementation = await client.request<{
      Parameters: [Address, Hex, BlockTag];
      ReturnType: Hex;
    }>({
      method: "eth_getStorageAt",
      params: [userOp.sender, erc1967ProxyImplementationSlot, "latest"],
    });
    const implementationAddress = decodeAbiParameters(
      [{ type: "address" }],
      implementation
    )[0];
    if (implementationAddress != coinbaseSmartWalletV1Implementation)
      return false;

    // check that userOp.callData is making a call we want to sponsor
    const calldata = decodeFunctionData({
      abi: coinbaseSmartWalletABI,
      data: userOp.callData,
    });

    // keys.coinbase.com always uses executeBatch
    if (calldata.functionName !== "executeBatch") return false;
    if (!calldata.args || calldata.args.length == 0) return false;

    const calls = calldata.args[0] as {
      target: Address;
      value: bigint;
      data: Hex;
    }[];
    // modify if want to allow batch calls to your contract
    if (calls.length > 4) return false;

    let callToCheckIndex = 0;
    console.log("all callsx", calls);
    if (calls.length > 1) {
      // if there is more than one call, check if the first is a magic spend call
      if (calls[0].target.toLowerCase() !== magicSpendAddress.toLowerCase()) {
        console.log("first call is not a magic spend");
        return false;
      }
      console.log("first call is a magic spend");
      callToCheckIndex = 1;
    }

    console.log("address", calls[callToCheckIndex].target);

    // if (
    //   calls[callToCheckIndex].target.toLowerCase() !==
    //   myNFTAddress.toLowerCase()
    // )
    //   return false;

    // const innerCalldata = decodeFunctionData({
    //   abi: myNFTABI,
    //   data: calls[callToCheckIndex].data,
    // });
    // if (innerCalldata.functionName !== "safeMint") return false;
    console.log("checking calls");
    await calls.forEach((call) => {
      const address = call.target;
      if (isWalletAddress(address)) {
        const calldata = decodeFunctionData({
          abi: walletAbi,
          data: call.data,
        });
        console.log("call data wallet", calldata);
      } else {
        const calldata = decodeFunctionData({
          abi: erc20Abi,
          data: call.data,
        });
        console.log("call data erc20", calldata);
        // check if function is approve
        if (calldata.functionName !== "approve") return false;
        // check if the spender is the wallet
        if (calldata.args[0] !== walletAddress) return false;
      }
    });

    return true;
  } catch (e) {
    console.error(`willSponsor check failed: ${e}`);
    return false;
  }
}
