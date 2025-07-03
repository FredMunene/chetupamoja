import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = import.meta.env.VITE_TEMPLATE_CLIENT_ID;

console.log('Thirdweb clientId:', clientId); // Debug: print the clientId

const secretKey = import.meta.env.VITE_TEMPLATE_SECRET_KEY;

export const client = createThirdwebClient({
    clientId: "D3kphw_r2J7IXeoIp6j8TH0sDm7IaoUUMu0xF4i_Tjeb4j9v193BivWqBQMsPcVeLgg6IZfEFW3LEhWLdOBiYw",
    secretKey: secretKey,
  });