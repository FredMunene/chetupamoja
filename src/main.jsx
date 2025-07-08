import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { WalletProvider } from './contexts/WalletContext';
// import "./polyfills";

import { WagmiConfig, chain, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

const client = createClient(
  getDefaultClient({
    appName: "ConnectKit Vite Demo",
    alchemyId: import.meta.env.VITE_ALCHEMY_ID, // or process.env if not using Vite
    // infuraId: import.meta.env.VITE_INFURA_ID,
    chains: [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  })
);

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="auto">
        <WalletProvider>
          <App />
        </WalletProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  </StrictMode>
);
