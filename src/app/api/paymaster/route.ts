import { paymasterClient } from "../config";
import { willSponsor } from "../utils";

export async function POST(r: Request) {
  const req = await r.json();
  const method = req.method;

  if (!req.params || !Array.isArray(req.params)) {
    return Response.json({ error: "Parameters are missing or invalid" });
  }

  const [userOp, entrypoint, chainId] = req.params;

  if (!willSponsor({ chainId: parseInt(chainId), entrypoint, userOp })) {
    console.log("not a sponsorable operation");
    return Response.json({ error: "Not a sponsorable operation" });
  }

  console.log("is a sponsorable operation");

  if (method === "pm_getPaymasterStubData") {
    const result = await paymasterClient.getPaymasterStubData({
      userOperation: userOp,
    });
    return Response.json({ result });
  } else if (method === "pm_getPaymasterData") {
    const result = await paymasterClient.getPaymasterData({
      userOperation: userOp,
    });
    return Response.json({ result });
  }
  return Response.json({ error: "Method not found" });
}
