import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;


const secretKey = import.meta.env.VITE_TEMPLATE_SECRET_KEY;


export const client = new ThirdwebSDK({
  chain: 1135,
  rpcUrl: "https://rpc.api.lisk.com",
  clientId: clientId,
});