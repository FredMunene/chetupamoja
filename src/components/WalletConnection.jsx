import React from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

const WalletConnection = () => {
  const { wallet, connectWallet, disconnectWallet, isLoading } = useWallet();

  if (wallet.isConnected) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Wallet Connected</p>
              <p className="text-white/70 text-sm">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </p>
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Disconnect
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">ETH Balance:</span>
            <span className="text-white font-medium">{wallet.balance.eth} ETH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">USDT Balance:</span>
            <span className="text-white font-medium">{wallet.balance.usdt} USDT</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
      <div className="text-center">
        <Wallet className="w-12 h-12 text-white/70 mx-auto mb-4" />
        <h3 className="text-white font-semibold text-lg mb-2">Connect Your Wallet</h3>
        <p className="text-white/70 mb-6">
          Connect your MetaMask wallet to start making donations
        </p>
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default WalletConnection;