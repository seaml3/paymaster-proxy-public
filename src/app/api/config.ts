import { createClient, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { ENTRYPOINT_ADDRESS_V06 } from "permissionless";
import { paymasterActionsEip7677 } from "permissionless/experimental";

export const client = createPublicClient({
  chain: base,
  transport: http(),
});
const paymasterService =
  "https://api.pimlico.io/v2/8453/rpc?apikey=6765af47-2644-4ad3-85a9-fc90b3c7bd89";
// const paymasterService = process.env.PAYMASTER_SERVICE_URL!;

export const paymasterClient = createClient({
  chain: base,
  transport: http(paymasterService),
}).extend(paymasterActionsEip7677({ entryPoint: ENTRYPOINT_ADDRESS_V06 }));
