import Web3 from "web3";

const web3 = new Web3(
	"https://ethereum-mainnet.core.chainstack.com/920a81bff1d6897821e61048d2437b4a"
);

// Only ETH / USD pair
const pairs = {
	"ETH / USD": "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
};

const aggregatorV3InterfaceABI = [
	{
		inputs: [],
		name: "decimals",
		outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "description",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
		name: "getRoundData",
		outputs: [
			{ internalType: "uint80", name: "roundId", type: "uint80" },
			{ internalType: "int256", name: "answer", type: "int256" },
			{ internalType: "uint256", name: "startedAt", type: "uint256" },
			{ internalType: "uint256", name: "updatedAt", type: "uint256" },
			{ internalType: "uint80", name: "answeredInRound", type: "uint80" },
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "latestRoundData",
		outputs: [
			{ internalType: "uint80", name: "roundId", type: "uint80" },
			{ internalType: "int256", name: "answer", type: "int256" },
			{ internalType: "uint256", name: "startedAt", type: "uint256" },
			{ internalType: "uint256", name: "updatedAt", type: "uint256" },
			{ internalType: "uint80", name: "answeredInRound", type: "uint80" },
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "version",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
];

export async function getEthPrice() {
	try {
		const priceFeed = new web3.eth.Contract(
			aggregatorV3InterfaceABI,
			pairs["ETH / USD"]
		);
		const roundData = await priceFeed.methods.latestRoundData().call();
		const price = Number(roundData.answer) / 1e8;
		return price;
	} catch (error) {
		console.error("Error fetching ETH price:", error);
		return null;
	}
} 