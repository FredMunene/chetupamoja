import { useState, useEffect } from 'react';

export const useWallet = () => {
  const [wallet, setWallet] = useState({
    address: '',
    isConnected: false,
    balance: { eth: '0', usdt: '0' }
  });
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is required to use this donation platform');
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        
        // Get ETH balance
        const ethBalance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        
        const ethBalanceInEth = (parseInt(ethBalance, 16) / Math.pow(10, 18)).toFixed(4);

        setWallet({
          address,
          isConnected: true,
          balance: { eth: ethBalanceInEth, usdt: '100.50' } // Mock USDT balance
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: '',
      isConnected: false,
      balance: { eth: '0', usdt: '0' }
    });
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        }
      });
    }
  }, []);

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    isLoading
  };
};