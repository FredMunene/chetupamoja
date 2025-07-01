"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ProjectDonationContractWithNFT_metadata from "./abi/ProjectDonationContractWithNFT_metadata.json";

const CAMPAIGN = {
  title: "Tech Challenge Kenya 2025",
  description:
    "Showcases in Kisumu (5th/6th July) and Nakuru (12th/13th July), where 6000 students and advisers from Kisumu and Nakuru counties will gather to showcase their innovative STEM projects. For just $0.50 per person, you can help us provide a snack bag for: 5000 students and 1000 advisers (Total: 6000 people).",
  details: [
    "500/- feeds 25 students",
    "100/- feeds 5 students",
  ],
};

const CONTRACT_ADDRESS = "0x6d5fdc15dc47254f266a90772bd8a12f849faf12";
const BASE_SEPOLIA_CHAIN_ID = "0x14A34"; // 927,076 decimal
const DONATION_GOAL = 3000; // USD

export default function DonatePage() {
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [projectId, setProjectId] = useState("1");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalDonated, setTotalDonated] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [userContribution, setUserContribution] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [numDeposits, setNumDeposits] = useState(null);

  const abi = ProjectDonationContractWithNFT_metadata.output.abi;

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask is required.");
      return;
    }
    try {
      // Switch to Base Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
      });
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
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
      // Use CoinGecko API for ETH/USDT price
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
      const data = await res.json();
      setEthPrice(data.ethereum.usd);
    } catch {
      setEthPrice(null);
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
        const ethPrice = data.ethereum.usd;
        if (ethPrice) {
          const ethAmount = (0.5 / ethPrice).toFixed(6);
          setAmount(ethAmount);
        }
      } catch {}
    }
    setDefaultAmount();
    // eslint-disable-next-line
  }, [projectId]);

  useEffect(() => {
    async function fetchUserContribution() {
      if (!account || !projectId) {
        setUserContribution(null);
        return;
      }
      try {
        const providerEthers = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, providerEthers);
        const amount = await contract.getDonorAmount(projectId, account);
        setUserContribution(ethers.formatEther(amount));
      } catch (err) {
        setUserContribution(null);
      }
    }
    fetchUserContribution();
  }, [account, projectId]);

  useEffect(() => {
    async function fetchRecentDonations() {
      if (!projectId || !ethPrice) {
        setRecentDonations([]);
        return;
      }
      try {
        const providerEthers = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, providerEthers);
        const donorAddresses = await contract.getProjectDonors(projectId);
        const donorInfo = [];
        // Get up to last 3 donors (from end)
        for (let i = Math.max(0, donorAddresses.length - 3); i < donorAddresses.length; i++) {
          const donor = donorAddresses[i];
          const amount = await contract.getDonorAmount(projectId, donor);
          donorInfo.unshift({ donor, amount: amount.toString() }); // unshift for most recent first
        }
        setRecentDonations(donorInfo);
      } catch {
        setRecentDonations([]);
      }
    }
    fetchRecentDonations();
  }, [projectId, totalDonated, ethPrice]);

  useEffect(() => {
    async function fetchNumDeposits() {
      if (!projectId) {
        setNumDeposits(null);
        return;
      }
      try {
        const providerEthers = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, providerEthers);
        const depositIds = await contract.getProjectDeposits(projectId);
        setNumDeposits(depositIds.length);
      } catch {
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
      const provider = window.ethereum;
      const [from] = await provider.request({ method: "eth_requestAccounts" });
      const providerEthers = new ethers.BrowserProvider(provider);
      const signer = await providerEthers.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const tx = await contract.depositETH(
        projectId,
        { value: ethers.parseEther(amount) }
      );
      await tx.wait();
      setStatus("Donation successful! Thank you.");
      setAmount("");
      setProjectId("");
      fetchTotalDonated(); // Refresh total after donation
      fetchEthPrice(); // Refresh price in case
    } catch (err) {
      setStatus("Error: " + (err.reason || err.message || "Transaction failed"));
    }
    setLoading(false);
  }

  const totalDonatedUSD = totalDonated && ethPrice ? (parseFloat(totalDonated) * ethPrice).toFixed(2) : null;
  const amountUSD = amount && ethPrice ? (parseFloat(amount) * ethPrice).toFixed(2) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#fafbfc', padding: '40px 0' }}>
      <div
        className="donate-flex-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 32,
          maxWidth: 1100,
          margin: '0 auto',
        }}>
        {/* Main Content */}
        <div className="donate-main" style={{ flex: 2, minWidth: 350 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 24 }}>{CAMPAIGN.title}</h1>
          {/* Campaign Image Card */}
          <div style={{
            background: '#bfc8e6',
            borderRadius: 18,
            overflow: 'hidden',
            marginBottom: 24,
            position: 'relative',
            boxShadow: '0 2px 12px #0001',
            aspectRatio: '16/9',
            width: '100%',
            height: 'auto',
            maxHeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src="/techchallenge.jpg"
              alt="Campaign"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(100,120,200,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              padding: 24,
              color: '#fff',
              fontWeight: 700,
              fontSize: 24,
              textShadow: '0 2px 8px #0006',
            }}>
              gofundme.org
              <div style={{ fontSize: 16, fontWeight: 400, marginTop: 8, background: '#fff8', color: '#333', borderRadius: 8, padding: '2px 10px', display: 'inline-block' }}>
                <span role="img" aria-label="tax">🧾</span> Tax deductible
              </div>
            </div>
          </div>
          {/* Description */}
          <div style={{ fontSize: 18, color: '#222', marginBottom: 16 }}>{CAMPAIGN.description}</div>
          <ul style={{ fontSize: 16, color: '#444', marginBottom: 16, paddingLeft: 20 }}>
            {CAMPAIGN.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Donate once, help many</div>
          <div style={{ color: '#555', marginBottom: 8 }}>Provide support for multiple people in need of a little extra help with a single donation.</div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Quick and direct</div>
          <div style={{ color: '#555', marginBottom: 16 }}>Deliver funds directly to people who are asking for help.</div>
          <a href="#" style={{ color: '#2a5bd7', fontWeight: 500, textDecoration: 'underline', fontSize: 15 }}>Read more</a>
          {/* Emoji Row */}
          <div style={{ fontSize: 24, marginTop: 24, display: 'flex', gap: 8 }}>
            <span>💚</span><span>🙏</span><span>❤️</span><span>🍎</span><span>🌟</span><span>👏</span><span>✨</span><span>75</span>
          </div>
        </div>
        {/* Sidebar */}
        <div className="donate-sidebar" style={{
          flex: 1,
          minWidth: 320,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 16px #0001',
          padding: 28,
          position: 'sticky',
          top: 40,
        }}>
          {/* Progress and Stats */}
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            {totalDonated === null || ethPrice === null
              ? 'Loading...'
              : `$${Number(totalDonated * ethPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`}
            <span style={{ fontSize: 16, color: '#888', fontWeight: 400 }}> raised</span>
          </div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 12 }}>
            $3,000 goal · {numDeposits === null ? 'Loading...' : `${numDeposits} donation${numDeposits === 1 ? '' : 's'}`}
          </div>
          {/* Progress Bar */}
          <div style={{ height: 16, background: '#e6eaf3', borderRadius: 8, marginBottom: 16, position: 'relative' }}>
            {(() => {
              let percent = 0;
              if (totalDonated !== null && ethPrice !== null) {
                const donatedUSD = Number(totalDonated) * ethPrice;
                percent = Math.min(100, (donatedUSD / DONATION_GOAL) * 100);
              }
              return (
                <>
                  <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #00c16e, #2a5bd7)', borderRadius: 8, transition: 'width 0.5s' }}></div>
                  <div style={{ position: 'absolute', right: 8, top: 0, height: '100%', display: 'flex', alignItems: 'center', color: '#222', fontWeight: 600, fontSize: 13 }}>
                    {percent.toFixed(0)}%
                  </div>
                </>
              );
            })()}
          </div>
          {/* User Contribution and ETH Donation Form */}
          <div style={{ margin: '32px 0 0 0', borderTop: '1px solid #eee', paddingTop: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Your Contribution</div>
            {account && userContribution !== null ? (
              <div style={{ color: '#007bff', fontWeight: 500, marginBottom: 8 }}>{userContribution} ETH</div>
            ) : (
              <div style={{ color: '#888', marginBottom: 8 }}>Connect wallet to see</div>
            )}
            {!account ? (
              <button onClick={connectWallet} style={{ width: '100%', background: '#2a5bd7', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 0', marginBottom: 12, cursor: 'pointer' }}>Connect Wallet</button>
            ) : null}
            <div style={{ margin: '16px 0' }}>
              <label>
                Amount (ETH):
                <input
                  type="number"
                  min="0.0001"
                  step="0.0001"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{ marginLeft: 8, padding: 4, borderRadius: 6, border: '1px solid #e6eaf3', width: 120 }}
                  disabled={loading}
                />
                {amountUSD && (
                  <span style={{ marginLeft: 12, color: '#888' }}>
                    (~${amountUSD} USD)
                  </span>
                )}
              </label>
            </div>
            <button onClick={donate} disabled={!account || !amount || !projectId || loading} style={{ width: '100%', background: '#00c16e', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 0', marginBottom: 8, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? "Processing..." : "Donate"}
            </button>
            <button style={{ width: '100%', background: '#f7b731', color: '#222', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, padding: '12px 0', marginBottom: 12, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}>Share</button>
            {status && <div style={{ marginTop: 16, color: status.startsWith("Error") ? "#a23" : "#00c16e", fontWeight: 500 }}>{status}</div>}
            <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
              You must use MetaMask and be on Base Sepolia.<br />
              <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#2a5bd7' }}>Get test ETH</a>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @media (max-width: 900px) {
          .donate-flex-container {
            flex-direction: column;
            gap: 0;
          }
          .donate-main,
          .donate-sidebar {
            min-width: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .donate-sidebar {
            margin-top: 32px;
            position: static !important;
          }
        }
        @media (max-width: 600px) {
          .donate-main {
            padding: 0 8px;
          }
          .donate-sidebar {
            padding: 16px !important;
          }
          .donate-main h1 {
            font-size: 24px !important;
          }
        }
      `}</style>
    </div>
  );
} 