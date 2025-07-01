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

export default function DonatePage() {
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [projectId, setProjectId] = useState("1");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalDonated, setTotalDonated] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);

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
      const providerEthers = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, providerEthers);
      const total = await contract.getTotalToken();
      setTotalDonated(ethers.formatEther(total));
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
    // eslint-disable-next-line
  }, []);

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
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8, fontFamily: 'sans-serif' }}>
      <h1>{CAMPAIGN.title}</h1>
      <p>{CAMPAIGN.description}</p>
      <ul>
        {CAMPAIGN.details.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
      <hr />
      <div style={{ margin: "16px 0", fontWeight: "bold" }}>
        Total Donated: {totalDonated === null ? "Loading..." : `${totalDonated} ETH`}
        {totalDonatedUSD && (
          <span> (~${totalDonatedUSD} USD)</span>
        )}
      </div>
      {!account ? (
        <button onClick={connectWallet} style={{ padding: 8, margin: "16px 0" }}>Connect Wallet</button>
      ) : (
        <div style={{ margin: "16px 0" }}>Connected: {account}</div>
      )}

      <div style={{ margin: "16px 0" }}>
        <label>
          Amount (ETH):
          <input
            type="number"
            min="0.0001"
            step="0.0001"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ marginLeft: 8, padding: 4 }}
            disabled={loading}
          />
          {amountUSD && (
            <span style={{ marginLeft: 12, color: '#888' }}>
              (~${amountUSD} USD)
            </span>
          )}
        </label>
      </div>
      <button onClick={donate} disabled={!account || !amount || !projectId || loading} style={{ padding: 8 }}>
        {loading ? "Processing..." : "Donate"}
      </button>
      {status && <div style={{ marginTop: 16, color: status.startsWith("Error") ? "red" : "green" }}>{status}</div>}
      <div style={{ marginTop: 32, fontSize: 12, color: '#888' }}>
        You must use MetaMask and be on Base Sepolia.<br />
        <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer">Get test ETH</a>
      </div>
    </div>
  );
} 