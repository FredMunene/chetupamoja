import { useState } from 'react';

export const useNFT = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [mintComplete, setMintComplete] = useState(false);
  const [nftData, setNftData] = useState(null);

  const mintNFT = async (donationAmount, currency) => {
    setIsMinting(true);
    
    try {
      // Simulate NFT minting process
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const metadata = {
        name: `Tech Champions Donation #${Date.now()}`,
        description: `Thank you for your ${donationAmount} ${currency} donation to support tech education for underserved communities!`,
        image: `https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop`,
        donationAmount,
        currency,
        timestamp: new Date().toISOString()
      };
      
      setNftData(metadata);
      setMintComplete(true);
      
      return true;
    } catch (error) {
      console.error('NFT minting failed:', error);
      return false;
    } finally {
      setIsMinting(false);
    }
  };

  const resetNFT = () => {
    setMintComplete(false);
    setNftData(null);
    setIsMinting(false);
  };

  return {
    isMinting,
    mintComplete,
    nftData,
    mintNFT,
    resetNFT
  };
};