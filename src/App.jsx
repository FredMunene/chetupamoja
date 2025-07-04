import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, Wallet, CheckCircle, ArrowLeft, Mail, Building, User, MessageSquare, Phone, Globe } from 'lucide-react';
import { ethers } from 'ethers';


const CAMPAIGN = {
  title: "Support STEM Showcases in Kisumu & Nakuru",
  description:
    "Support STEM Showcases in Kisumu (5–6 July) and Nakuru (12–13 July), where 6,000 students and advisers will present innovative projects. For just $0.50 per person, you can provide a snack bag and keep them energized.",
  details: [
    "($5.00) 500 KES feeds 25 students",
    "($1.00) 100 KES feeds 5 students",
  ],
  tagline: "Donate once, help many — quick, direct, and impactful.",
};

const CONTRACT_ADDRESS =  "0x9dF718fd49ae6641217d15eeff97eb61088611Cf";
const LISK_CHAIN_ID = "0x46f"; // 1135 decimal
const DONATION_GOAL = 3000; // USD


// Font size constants
const FONT_LARGE = 28;
const FONT_MEDIUM = 18;
const FONT_SMALL = 15;

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'donate', or 'organization'
  
  // Donation page state
  const [address, setAddress] = useState("");
  const [projectId, setProjectId] = useState("1");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalDonated, setTotalDonated] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [userContribution, setUserContribution] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [numDeposits, setNumDeposits] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [inputEth, setInputEth] = useState("");
  const [inputUsd, setInputUsd] = useState("");
  
  // Interactive impact calculator state - moved to top level
  const [mealsPerDay, setMealsPerDay] = useState(1);
  const [days, setDays] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Organization form state
  const [orgForm, setOrgForm] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    organizationType: '',
    message: '',
    country: '',
    estimatedDonationVolume: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Minimal ABI for ethers.js
  const abi = [
    "function depositETH(uint256 projectId) external payable",
    "function getProjectInfo(uint256 projectId) external view returns (string memory, uint256, address)",
    "function getDonorAmount(uint256 projectId, address donor) external view returns (uint256)",
    "function getProjectDonors(uint256 projectId) external view returns (address[])",
    "function getProjectDeposits(uint256 projectId) external view returns (uint256[])"
  ];

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask is required.");
      return;
    }
    try {
      // Switch to Lisk
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: LISK_CHAIN_ID }],
      });
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
      }
    } catch (err) {
      setStatus("Could not connect wallet or switch network.");
    }
  }

  async function fetchTotalDonated() {
    try {
      if (!projectId) {
        setTotalDonated(null);
        return;
      }
      const providerEthers = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, providerEthers);
      // getProjectInfo returns (name, totalDeposited, ...)
      const info = await contract.getProjectInfo(projectId);
      // info[1] is totalDeposited
      setTotalDonated(ethers.formatEther(info[1]));
    } catch (err) {
      setTotalDonated(null);
    }
  }

  async function fetchEthPrice() {
    try {
      const cached = localStorage.getItem('ethPriceCache');
      if (cached) {
        const { price, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 60000) { // 1 minute
          setEthPrice(price);
          return;
        }
      }
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
      const data = await res.json();
      setEthPrice(data.ethereum.usd);
      localStorage.setItem('ethPriceCache', JSON.stringify({ price: data.ethereum.usd, timestamp: Date.now() }));
    } catch {
      setEthPrice(2500); // Fallback price
    }
  }

  useEffect(() => {
    fetchTotalDonated();
    fetchEthPrice();
    // Set default amount to $0.5 in ETH after fetching price
    async function setDefaultAmount() {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        const data = await res.json();
        const ethPrice = data.ethereum.usd || 2500;
        if (ethPrice) {
          const ethAmount = (0.5 / ethPrice).toFixed(6);
          setInputEth(ethAmount);
          setInputUsd("0.50");
        }
      } catch {
        const ethAmount = (0.5 / 2500).toFixed(6);
        setInputEth(ethAmount);
        setInputUsd("0.50");
      }
    }
    setDefaultAmount();
    setNumDeposits(15); // Mock data

    // Refresh ETH price every 20 seconds
    const interval = setInterval(() => {
      fetchEthPrice();
    }, 20000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    async function fetchUserContribution() {
      if (!address || !projectId) {
        setUserContribution(null);
        return;
      }
      try {
        // Mock user contribution
        setUserContribution("0.1234");
      } catch (err) {
        setUserContribution(null);
      }
    }
    fetchUserContribution();
  }, [address, projectId]);

  // Sync ETH and USD input fields
  useEffect(() => {
    if (!ethPrice) return;
    // If ETH input changes, update USD
    if (inputEth !== "" && document.activeElement && document.activeElement.name === "ethInput") {
      setInputUsd((parseFloat(inputEth) * ethPrice).toFixed(2));
    }
    // If USD input changes, update ETH
    if (inputUsd !== "" && document.activeElement && document.activeElement.name === "usdInput") {
      setInputEth((parseFloat(inputUsd) / ethPrice).toFixed(6));
    }
  }, [inputEth, inputUsd, ethPrice]);

  useEffect(() => {
    async function fetchNumDeposits() {
      if (!projectId) {
        setNumDeposits(null);
        return;
      }
      try {
        // Use the user's wallet if available, otherwise fallback to a public provider
        const provider = window.ethereum
          ? new ethers.BrowserProvider(window.ethereum)
          : ethers.getDefaultProvider(); // fallback for read-only
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const depositIds = await contract.getProjectDeposits(projectId);
        setNumDeposits(depositIds.length);
      } catch (err) {
        setNumDeposits(null);
      }
    }
    fetchNumDeposits();
  }, [projectId, totalDonated]);

  async function donate() {
    setStatus("");
    setLoading(true);
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      if (!projectId) throw new Error("Project ID is required");
      // In real implementation, this would call the smart contract
      // const provider = new ethers.BrowserProvider(window.ethereum);
      // const signer = await provider.getSigner();
      // const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      // const tx = await contract.depositETH(projectId, { value: ethers.parseEther(inputEth) });
      // await tx.wait();
      // Simulate donation process for demo
      await new Promise(resolve => setTimeout(resolve, 3000));
      setStatus("Donation successful! Thank you.");
      setInputEth("");
      setInputUsd("");
      fetchTotalDonated(); // Refresh total after donation
    } catch (err) {
      setStatus("Error: " + (err.reason || err.message || "Transaction failed"));
    }
    setLoading(false);
  }

  const handleOrgFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFormSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOrgFormChange = (field, value) => {
    setOrgForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetOrgForm = () => {
    setOrgForm({
      organizationName: '',
      contactName: '',
      email: '',
      phone: '',
      website: '',
      organizationType: '',
      message: '',
      country: '',
      estimatedDonationVolume: ''
    });
    setFormSubmitted(false);
  };

  function handleShare() {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: "Support STEM Showcases",
        text: "Join me in supporting STEM Showcases! Donate now.",
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  }

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      <div className="container mx-auto px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold">ChetuPamoja</h1>
          <div className="w-20"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <h1 className="text-3xl md:text-4xl font-bold">{CAMPAIGN.title}</h1>
              
              {/* Campaign Image */}
              <div 
                className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-video cursor-pointer group"
                onClick={() => setImageModalOpen(true)}
              >
                <img
                  src="/images/techchallenge.jpg"
                  alt="STEM Showcase"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white/90 text-black px-3 py-1 rounded-lg text-sm font-medium">
                    🧾 Tax deductible
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">{CAMPAIGN.description}</p>
                
                <ul className="space-y-2">
                  {CAMPAIGN.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
                
                <p className="text-orange-600 font-bold text-lg">{CAMPAIGN.tagline}</p>
              </div>

              {/* Combined Impact Calculator */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="text-lg mb-2">
                  With <span className="font-bold text-orange-600">$0.50</span>, you can provide snacks for <span className="font-bold text-orange-600">1</span> student.
                </div>
                <div style={{ fontSize: FONT_MEDIUM, fontWeight: 700, color: '#111', margin: '24px 0 0 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  With the total donated, you can provide
                  <span
                    style={{
                      fontWeight: 700,
                      color: '#ff9800',
                      cursor: 'pointer',
                      background: '#fff',
                      border: '1px solid #ff9800',
                      borderRadius: 8,
                      padding: '2px 10px',
                      margin: '0 4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'background 0.2s',
                    }}
                    onClick={() => setDropdownOpen(dropdownOpen === 'meals' ? null : 'meals')}
                  >
                    {dropdownOpen === 'meals' ? (
                      <Dropdown
                        value={mealsPerDay}
                        onChange={setMealsPerDay}
                        options={[1, 2]}
                        onClose={() => setDropdownOpen(null)}
                      />
                    ) : (
                      <>
                        {mealsPerDay} meal{mealsPerDay > 1 ? 's' : ''} <span style={{ fontSize: 16, marginLeft: 2 }}>▼</span>
                      </>
                    )}
                  </span>
                  per day for
                  <span
                    style={{
                      fontWeight: 700,
                      color: '#ff9800',
                      cursor: 'pointer',
                      background: '#fff',
                      border: '1px solid #ff9800',
                      borderRadius: 8,
                      padding: '2px 10px',
                      margin: '0 4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'background 0.2s',
                    }}
                    onClick={() => setDropdownOpen(dropdownOpen === 'days' ? null : 'days')}
                  >
                    {dropdownOpen === 'days' ? (
                      <Dropdown
                        value={days}
                        onChange={setDays}
                        options={[1, 2]}
                        onClose={() => setDropdownOpen(null)}
                      />
                    ) : (
                      <>
                        {days} day{days > 1 ? 's' : ''} <span style={{ fontSize: 16, marginLeft: 2 }}>▼</span>
                      </>
                    )}
                  </span>
                  to
                  <span style={{ fontWeight: 700, color: '#ff9800', margin: '0 4px' }}>{inputUsd ? Math.floor(parseFloat(inputUsd) / (0.5 * mealsPerDay * days)) : 0}</span>
                  students.
                </div>
              </div>
            </div>

            {/* Donation Sidebar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 h-fit sticky top-8">
              {/* Progress */}
              <div className="space-y-4 mb-8">
                <div className="text-3xl font-bold">
                  {totalDonated === null || inputEth === null
                    ? 'Loading...'
                    : `$${Number(totalDonated * inputEth).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  <span className="text-lg text-orange-600 font-normal"> raised</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  $3,000 goal · {numDeposits === null ? 'Loading...' : `${numDeposits} donation${numDeposits === 1 ? '' : 's'}`}
                </div>

                {/* Progress Bar */}
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden relative">
                  {(() => {
                    let percent = 0;
                    if (totalDonated !== null && inputEth !== null) {
                      const donatedUSD = Number(totalDonated) * inputEth;
                      percent = Math.min(100, (donatedUSD / DONATION_GOAL) * 100);
                    }
                    return (
                      <>
                        <div 
                          className="h-full bg-orange-500 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                        <div className="absolute right-2 top-0 h-full flex items-center text-xs font-bold text-gray-700">
                          {percent.toFixed(0)}%
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* User Contribution */}
              <div className="border-t border-gray-200 pt-6 space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Your Contribution</h4>
                  {address && userContribution !== null ? (
                    <div className="text-orange-600 font-bold">{userContribution} ETH</div>
                  ) : (
                    <div className="text-gray-500 text-sm">Connect wallet to see</div>
                  )}
                </div>

                {/* Wallet Connection */}
                {!address ? (
                  <button
                    onClick={connectWallet}
                    className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <div className="text-sm text-green-600 font-medium">
                    ✓ Wallet Connected: {address.slice(0, 6)}...{address.slice(-4)}
                  </div>
                )}

                {/* Amount Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">ETH Amount</label>
                    <input
                      name="ethInput"
                      type="number"
                      min="0.0001"
                      step="0.0001"
                      value={inputEth}
                      onChange={e => setInputEth(e.target.value)}
                      className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">USD Amount</label>
                    <input
                      name="usdInput"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={inputUsd}
                      onChange={e => setInputUsd(e.target.value)}
                      className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Donate Button */}
                <button 
                  onClick={donate} 
                  disabled={!address || !inputEth || !projectId || loading}
                  className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      Donate
                    </>
                  )}
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  style={{
                    width: '100%',
                    background: '#fff',
                    color: '#ff9800',
                    fontWeight: 700,
                    fontSize: FONT_MEDIUM,
                    border: '2px solid #ff9800',
                    borderRadius: 8,
                    padding: '18px 0',
                    marginBottom: 16,
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px #0001'
                  }}
                >
                  Share
                </button>

                {/* Status Message */}
                {status && (
                  <div className={`text-sm font-medium ${status.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
                    {status}
                  </div>
                )}

                {/* Network Note */}
                <div className="text-xs text-gray-600 leading-relaxed">
                  <strong>Note:</strong> Please use the <span className="text-orange-600 font-bold">Lisk</span> network and send <span className="text-orange-600 font-bold">ETH</span> for your donation. Make sure your wallet is connected to Lisk.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {imageModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src="public/images/techchallenge.jpg"
              alt="STEM Showcase Full"
              className="max-w-full max-h-full rounded-lg"
            />
            <button
              onClick={e => { e.stopPropagation(); setImageModalOpen(false); }}
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;