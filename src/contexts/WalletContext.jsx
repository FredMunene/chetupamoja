import { createContext, useContext, useState } from 'react';
import { createAppKit, useAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet } from '@reown/appkit/networks';
import { WagmiProvider, createConfig, http, useAccount, useDisconnect } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create QueryClient for React Query
const queryClient = new QueryClient();

// Create Wagmi config
const wagmiConfig = createConfig({
  chains: [mainnet, lisk],
  transports: {
    [mainnet.id]: http(),
  },
});

// Create WalletContext
const WalletContext = createContext();

// Create AppKit instance
const projectId = '2f514f29fd73024dcc1dfa4cddf45ee9'; // Replace with your actual project ID from WalletConnect Cloud

const metadata = {
  name: 'My App',
  description: 'My App Description',
  url: 'http://localhost:10000/',
  icons: ['https://myapp.com/icon.png']
};

// Create the adapter
const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  networks: [mainnet],
  projectId,
});

// Create AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet],
  metadata,
  projectId,
  features: {
    analytics: true,           // Enable/disable analytics
    socials: false,           // Disable social logins
    email: false,             // Disable email login
    emailShowWallets: false,  // Hide wallets in email flow
    onramp: false,           // Disable on-ramp (buy crypto)
    swaps: false,            // Disable token swaps
    history: true,           // Enable transaction history
    allWallets: true,
  },
});

// Internal component that uses Wagmi hooks
function WalletContextProvider({ children }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      // Use the AppKit hook to open the modal
      await open();
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setIsLoading(true);
      await disconnect();
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WalletContext.Provider 
      value={{ 
        walletAddress: address,
        isConnected,
        isLoading,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function WalletProvider({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}