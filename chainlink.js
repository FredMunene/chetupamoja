const { ethers } = require('ethers');

// Minimal setup - just get the ETH/USD price
async function getETHPrice() {
    // Use any public RPC or your own provider
    const provider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com');
    
    // Chainlink ETH/USD contract address on mainnet
    const contractAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    
    // Only need the latestRoundData function
    const abi = [
        "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
        "function decimals() external view returns (uint8)"
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    try {
        // Get the latest price
        const [roundId, answer, startedAt, updatedAt, answeredInRound] = await contract.latestRoundData();
        const decimals = await contract.decimals();
        
        // Convert to readable format
        const price = parseFloat(ethers.utils.formatUnits(answer, decimals));
        const lastUpdated = new Date(parseInt(updatedAt) * 1000);
        
        console.log(`ETH/USD Price: $${price}`);
        console.log(`Last Updated: ${lastUpdated}`);
        
        return {
            price: price,
            lastUpdated: lastUpdated,
            roundId: roundId.toString()
        };
        
    } catch (error) {
        console.error('Error fetching price:', error);
        throw error;
    }
}

// For browser with MetaMask or other wallet
async function getETHPriceBrowser() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contractAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
        
        const abi = [
            "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
            "function decimals() external view returns (uint8)"
        ];
        
        const contract = new ethers.Contract(contractAddress, abi, provider);
        
        const [, answer] = await contract.latestRoundData();
        const decimals = await contract.decimals();
        
        return parseFloat(ethers.utils.formatUnits(answer, decimals));
    }
}

// Using web3.js instead of ethers
async function getETHPriceWithWeb3() {
    const Web3 = require('web3');
    const web3 = new Web3('https://eth.llamarpc.com');
    
    const contractAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    const abi = [
        {
            "inputs": [],
            "name": "latestRoundData",
            "outputs": [
                {"internalType": "uint80", "name": "roundId", "type": "uint80"},
                {"internalType": "int256", "name": "answer", "type": "int256"},
                {"internalType": "uint256", "name": "startedAt", "type": "uint256"},
                {"internalType": "uint256", "name": "updatedAt", "type": "uint256"},
                {"internalType": "uint80", "name": "answeredInRound", "type": "uint80"}
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    
    const contract = new web3.eth.Contract(abi, contractAddress);
    
    const [roundData, decimals] = await Promise.all([
        contract.methods.latestRoundData().call(),
        contract.methods.decimals().call()
    ]);
    
    const price = parseInt(roundData.answer) / Math.pow(10, decimals);
    return price;
}

// Usage
getETHPrice().then(data => {
    console.log('Price data:', data);
}).catch(console.error);