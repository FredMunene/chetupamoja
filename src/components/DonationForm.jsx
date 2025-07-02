import React, { useState } from 'react';
import { Heart, Loader2, CheckCircle, Gift } from 'lucide-react';
import { useDonation } from '../hooks/useDonation';
import { useNFT } from '../hooks/useNFT';

const DonationForm = ({ wallet }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ETH');
  const { isProcessing, donationComplete, txHash, calculateImpact, processDonation, resetDonation } = useDonation();
  const { isMinting, mintComplete, nftData, mintNFT, resetNFT } = useNFT();

  const impact = amount ? calculateImpact(parseFloat(amount), currency) : null;

  const handleDonate = async () => {
    if (!amount) return;
    
    const success = await processDonation(parseFloat(amount), currency);
    if (success) {
      // Automatically start NFT minting after successful donation
      setTimeout(() => {
        mintNFT(amount, currency);
      }, 1000);
    }
  };

  const handleReset = () => {
    setAmount('');
    resetDonation();
    resetNFT();
  };

  if (donationComplete && mintComplete) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
          <p className="text-white/80">Your donation has been processed successfully</p>
        </div>

        <div className="bg-white/5 rounded-xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Your Impact NFT</h3>
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg p-6 mb-4">
            <img 
              src={nftData.image} 
              alt="NFT" 
              className="w-32 h-32 rounded-lg mx-auto mb-4 object-cover"
            />
            <h4 className="text-white font-medium mb-2">{nftData.name}</h4>
            <p className="text-white/80 text-sm">{nftData.description}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white/70 text-sm">Transaction Hash:</p>
            <p className="text-white font-mono text-xs break-all">{txHash}</p>
          </div>
          
          {impact && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-500/20 rounded-lg p-3">
                <div className="text-orange-300 font-bold text-lg">{impact.impact.snackBags}</div>
                <div className="text-orange-200 text-sm">Snack Bags</div>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-3">
                <div className="text-blue-300 font-bold text-lg">{impact.impact.codingClasses}</div>
                <div className="text-blue-200 text-sm">Coding Classes</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="text-green-300 font-bold text-lg">{impact.impact.laptops}</div>
                <div className="text-green-200 text-sm">Laptops</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-3">
                <div className="text-purple-300 font-bold text-lg">{impact.impact.internetAccess}</div>
                <div className="text-purple-200 text-sm">Internet Access</div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium py-3 px-6 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200"
        >
          Make Another Donation
        </button>
      </div>
    );
  }

  if (donationComplete && !mintComplete) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Donation Successful!</h2>
          <p className="text-white/80">Now minting your impact NFT...</p>
        </div>

        <div className="flex items-center justify-center space-x-3 mb-6">
          <Gift className="w-6 h-6 text-purple-400 animate-pulse" />
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          <span className="text-white">Minting NFT...</span>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white/70 text-sm">Transaction Hash:</p>
          <p className="text-white font-mono text-xs break-all">{txHash}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Heart className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Make a Donation</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-white/80 font-medium mb-2">Choose Currency</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCurrency('ETH')}
              className={`p-3 rounded-xl font-medium transition-all ${
                currency === 'ETH'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              ETH
            </button>
            <button
              onClick={() => setCurrency('USDT')}
              className={`p-3 rounded-xl font-medium transition-all ${
                currency === 'USDT'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              USDT
            </button>
          </div>
        </div>

        <div>
          <label className="block text-white/80 font-medium mb-2">Donation Amount</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              step="0.01"
              min="0"
            />
            <span className="absolute right-4 top-3 text-white/70">{currency}</span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Available: {currency === 'ETH' ? wallet.balance.eth : wallet.balance.usdt} {currency}
          </p>
        </div>

        {impact && (
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3">Your Impact</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-orange-300 font-bold text-xl">{impact.impact.snackBags}</div>
                <div className="text-orange-200 text-sm">Snack Bags for Kids</div>
              </div>
              <div className="text-center">
                <div className="text-blue-300 font-bold text-xl">{impact.impact.codingClasses}</div>
                <div className="text-blue-200 text-sm">Coding Classes</div>
              </div>
              <div className="text-center">
                <div className="text-green-300 font-bold text-xl">{impact.impact.laptops}</div>
                <div className="text-green-200 text-sm">Refurbished Laptops</div>
              </div>
              <div className="text-center">
                <div className="text-purple-300 font-bold text-xl">{impact.impact.internetAccess}</div>
                <div className="text-purple-200 text-sm">Months Internet</div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleDonate}
          disabled={!amount || isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Donation...</span>
            </>
          ) : (
            <>
              <Heart className="w-4 h-4" />
              <span>Donate {amount} {currency}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DonationForm;