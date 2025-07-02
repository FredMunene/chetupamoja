"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ProjectDonationContractWithNFT_metadata from "./abi/ProjectDonationContractWithNFT_metadata.json";

const CAMPAIGN = {
  title: "Support STEM Showcases in Kisumu & Nakuru",
  description:
    "Support STEM Showcases in Kisumu (5–6 July) and Nakuru (12–13 July), where 6,000 students and advisers will present innovative projects. For just $0.50 per person, you can provide a snack bag and keep them energized.",
  details: [
    "500 KES feeds 25 students",
    "100 KES feeds 5 students",
  ],
  tagline: "Donate once, help many — quick, direct, and impactful.",
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
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [inputEth, setInputEth] = useState("");
  const [inputUsd, setInputUsd] = useState("");

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

  // Set default input values when ethPrice loads
  useEffect(() => {
    if (ethPrice && inputEth === "" && inputUsd === "") {
      const ethAmount = (0.5 / ethPrice).toFixed(6);
      setInputEth(ethAmount);
      setInputUsd((0.5).toFixed(2));
    }
  }, [ethPrice]);

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
        { value: ethers.parseEther(inputEth) }
      );
      await tx.wait();
      setStatus("Donation successful! Thank you.");
      setInputEth("");
      setInputUsd("");
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
    <div style={{ minHeight: '100vh', background: '#fff', padding: '40px 0' }}>
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
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24, color: '#111' }}>{CAMPAIGN.title}</h1>
          {/* Campaign Image Card */}
          <div style={{
            background: '#fff',
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
            cursor: 'pointer',
          }}
            onClick={() => setImageModalOpen(true)}
          >
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
              background: 'rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              padding: 24,
              color: '#111',
              fontWeight: 700,
              fontSize: 20,
              textShadow: '0 2px 8px #fff6',
              pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 15, fontWeight: 400, marginTop: 8, background: '#fff', color: '#111', borderRadius: 8, padding: '2px 10px', display: 'inline-block', opacity: 0.9 }}>
                <span role="img" aria-label="tax">🧾</span> Tax deductible
              </div>
            </div>
          </div>
          {imageModalOpen && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.85)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
              onClick={() => setImageModalOpen(false)}
            >
              <img
                src="/techchallenge.jpg"
                alt="Campaign Full"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  borderRadius: 16,
                  boxShadow: '0 4px 32px #0008',
                  background: '#fff',
                }}
              />
              <button
                onClick={e => { e.stopPropagation(); setImageModalOpen(false); }}
                style={{
                  position: 'fixed',
                  top: 24,
                  right: 32,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  fontSize: 24,
                  cursor: 'pointer',
                  zIndex: 10001,
                }}
                aria-label="Close image preview"
              >×</button>
            </div>
          )}
          {/* Description */}
          <div style={{ fontSize: 17, color: '#111', marginBottom: 16 }}>{CAMPAIGN.description}</div>
          <ul style={{ fontSize: 16, color: '#111', marginBottom: 16, paddingLeft: 20 }}>
            {CAMPAIGN.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
          <div style={{ fontWeight: 700, marginBottom: 16, color: '#ff9800', fontSize: 18 }}>{CAMPAIGN.tagline}</div>

          {/* Interactive Meals/Days/Students Sentence */}
          {(() => {
            const MEAL_COST = 0.5;
            const [mealsPerDay, setMealsPerDay] = useState(1);
            const [days, setDays] = useState(1);
            const [dropdownOpen, setDropdownOpen] = useState(null); // 'meals' | 'days' | null
            const students = inputUsd ? Math.floor(parseFloat(inputUsd) / (MEAL_COST * mealsPerDay * days)) : 0;

            // Dropdown component
            const Dropdown = ({ value, onChange, options, onClose }) => (
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  style={{
                    background: '#fff',
                    border: '1px solid #ff9800',
                    borderRadius: 8,
                    padding: '2px 18px 2px 10px',
                    fontWeight: 600,
                    fontSize: 18,
                    color: '#111',
                    cursor: 'pointer',
                    minWidth: 60,
                  }}
                  onClick={e => { e.stopPropagation(); onClose && onClose(); }}
                >
                  {value} <span style={{ fontSize: 16, marginLeft: 2 }}>▼</span>
                </button>
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: '#fff',
                  border: '1px solid #e6eaf3',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #0001',
                  zIndex: 10,
                  minWidth: 60,
                }}>
                  {options.map(opt => (
                    <div
                      key={opt}
                      style={{ padding: '6px 12px', cursor: 'pointer', fontWeight: 500, color: '#111', background: value === opt ? '#f0f4ff' : '#fff' }}
                      onClick={() => { onChange(opt); setDropdownOpen(null); }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </span>
            );

            // Inline style for the changeable values
            const inlineBold = {
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
            };
            const sentenceStyle = { fontSize: 22, fontWeight: 700, color: '#111', margin: '24px 0 16px 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap' };

            return (
              <div style={sentenceStyle}>
                With the total donated, you can provide
                <span
                  style={inlineBold}
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
                  style={inlineBold}
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
                <span style={{ fontWeight: 700, color: '#ff9800', margin: '0 4px' }}>{students}</span>
                students.
              </div>
            );
          })()}

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
          <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, color: '#111' }}>
            {totalDonated === null || ethPrice === null
              ? 'Loading...'
              : `$${Number(totalDonated * ethPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`}
            <span style={{ fontSize: 15, color: '#ff9800', fontWeight: 700 }}> raised</span>
          </div>
          <div style={{ color: '#111', fontSize: 15, marginBottom: 12 }}>
            $3,000 goal · {numDeposits === null ? 'Loading...' : `${numDeposits} donation${numDeposits === 1 ? '' : 's'}`}
          </div>
          {/* Progress Bar */}
          <div style={{ height: 16, background: '#eee', borderRadius: 8, marginBottom: 16, position: 'relative' }}>
            {(() => {
              let percent = 0;
              if (totalDonated !== null && ethPrice !== null) {
                const donatedUSD = Number(totalDonated) * ethPrice;
                percent = Math.min(100, (donatedUSD / DONATION_GOAL) * 100);
              }
              return (
                <>
                  <div style={{ width: `${percent}%`, height: '100%', background: '#ff9800', borderRadius: 8, transition: 'width 0.5s' }}></div>
                  <div style={{ position: 'absolute', right: 8, top: 0, height: '100%', display: 'flex', alignItems: 'center', color: '#111', fontWeight: 700, fontSize: 13 }}>
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
              <div style={{ color: '#ff9800', fontWeight: 700, marginBottom: 8 }}>{userContribution} ETH</div>
            ) : (
              <div style={{ color: '#888', marginBottom: 8 }}>Connect wallet to see</div>
            )}
            {!account ? (
              <button onClick={connectWallet} style={{ width: '100%', background: '#ff9800', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 0', marginBottom: 12, cursor: 'pointer' }}>Connect Wallet</button>
            ) : null}
            <div style={{ margin: '16px 0', display: 'flex', gap: 12 }}>
              <label style={{ flex: 1, color: '#111', fontWeight: 600, fontSize: 15 }}>
                Amount (ETH):
                <input
                  name="ethInput"
                  type="number"
                  min="0.0001"
                  step="0.0001"
                  value={inputEth}
                  onChange={e => setInputEth(e.target.value)}
                  style={{ marginLeft: 8, padding: 4, borderRadius: 6, border: '1px solid #ff9800', width: '100%', color: '#111', background: '#fff', fontSize: 15 }}
                  disabled={loading}
                />
              </label>
              <label style={{ flex: 1, color: '#111', fontWeight: 600, fontSize: 15 }}>
                Amount (USD):
                <input
                  name="usdInput"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={inputUsd}
                  onChange={e => setInputUsd(e.target.value)}
                  style={{ marginLeft: 8, padding: 4, borderRadius: 6, border: '1px solid #ff9800', width: '100%', color: '#111', background: '#fff', fontSize: 15 }}
                  disabled={loading}
                />
              </label>
            </div>
            <button onClick={donate} disabled={!account || !inputEth || !projectId || loading} style={{ width: '100%', background: '#ff9800', color: '#fff', fontWeight: 800, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 0', marginBottom: 8, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? "Processing..." : "Donate"}
            </button>
            <button style={{ width: '100%', background: '#fff', color: '#ff9800', fontWeight: 700, fontSize: 18, border: '2px solid #ff9800', borderRadius: 8, padding: '12px 0', marginBottom: 12, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}>Share</button>
            {status && <div style={{ marginTop: 16, color: status.startsWith("Error") ? "#a23" : "#ff9800", fontWeight: 500 }}>{status}</div>}
            <div style={{ marginTop: 16, fontSize: 13, color: '#111', lineHeight: 1.6 }}>
              <b>Note:</b> Please use the <span style={{ color: '#ff9800', fontWeight: 700 }}>Base</span> network and send <span style={{ color: '#ff9800', fontWeight: 700 }}>ETH</span> for your donation.<br />
              Make sure your wallet is connected to Base.
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