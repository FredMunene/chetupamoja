import { useState } from 'react';

export const useDonation = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationComplete, setDonationComplete] = useState(false);
  const [txHash, setTxHash] = useState('');

  const calculateImpact = (amount, currency) => {
    // Convert to USD equivalent (simplified conversion rates)
    const usdAmount = currency === 'USDT' ? amount : amount * 2500; // ETH ~$2500 for demo
    
    return {
      amount,
      currency,
      impact: {
        snackBags: Math.floor(usdAmount * 10), // $0.10 per snack bag
        laptops: Math.floor(usdAmount / 200), // $200 per refurbished laptop
        codingClasses: Math.floor(usdAmount / 50), // $50 per coding class
        internetAccess: Math.floor(usdAmount / 25), // $25 per month internet access
      }
    };
  };

  const processDonation = async (amount, currency) => {
    setIsProcessing(true);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock transaction hash
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      setTxHash(mockTxHash);
      setDonationComplete(true);
      
      return true;
    } catch (error) {
      console.error('Donation failed:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDonation = () => {
    setDonationComplete(false);
    setTxHash('');
    setIsProcessing(false);
  };

  return {
    isProcessing,
    donationComplete,
    txHash,
    calculateImpact,
    processDonation,
    resetDonation
  };
};