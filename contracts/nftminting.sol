// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title DonationNFT
 * @dev NFT contract for donation campaign rewards with proportional scaling
 */
contract DonationNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    // Enums
    enum TierType { FIRST_CHAMPION, STEALTH_NINJA, DIAMOND, PLATINUM, GOLD, SILVER }
    
    // Structs
    struct NFTMetadata {
        uint256 projectId;
        string projectName;
        string image;
        TierType tier;
        uint256 rankNumber;
        uint256 donationAmount;
        uint256 totalDonors;
        uint256 mintTimestamp;
    }
    
    struct TierCounts {
        uint256 diamond;
        uint256 platinum;
        uint256 gold;
        uint256 silver;
    }
    
    // State variables
    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => NFTMetadata) public nftMetadata;
    mapping(uint256 => bool) public hasFirstChampion; // projectId => has minted
    mapping(uint256 => bool) public hasStealthNinja; // projectId => has minted
    mapping(uint256 => uint256) public firstChampionAmount; // projectId => first donation amount
    
    // NEW: Authorized minter mapping
    mapping(address => bool) public authorizedMinters;
    
    // Events
    event NFTMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        uint256 indexed projectId,
        TierType tier,
        uint256 rankNumber
    );
    
    event CampaignEnded(
        uint256 indexed projectId,
        uint256 totalDonors,
        TierCounts tierCounts
    );
    
    event MinterAuthorized(address indexed minter, bool authorized);
    
    // Constructor
    constructor(address initialOwner) ERC721("DonationChampion", "DONFT") Ownable(initialOwner) {}
    
    // NEW: Modifier to restrict minting to authorized addresses
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint NFTs");
        _;
    }
    
    /**
     * @notice Authorize/deauthorize an address to mint NFTs
     * @param minter Address to authorize/deauthorize
     * @param authorized Whether the address should be authorized
     */
    function setAuthorizedMinter(address minter, bool authorized) external onlyOwner {
        require(minter != address(0), "Invalid minter address");
        authorizedMinters[minter] = authorized;
        emit MinterAuthorized(minter, authorized);
    }
    
    /**
     * @notice Check if an address is authorized to mint
     * @param minter Address to check
     * @return Whether the address is authorized
     */
    function isAuthorizedMinter(address minter) external view returns (bool) {
        return authorizedMinters[minter] || minter == owner();
    }
    
    /**
     * @notice Mint "First Champion" NFT for the first depositor
     * @param recipient Address to receive the NFT
     * @param projectId Project ID
     * @param projectName Name of the project
     * @param image Image URL of the project
     * @param donationAmount Amount donated
     */
    function mintFirstChampion(
        address recipient,
        uint256 projectId,
        string memory projectName,
        string memory image,
        uint256 donationAmount
    ) external onlyMinter nonReentrant returns (uint256 tokenId) {
        require(!hasFirstChampion[projectId], "First Champion already minted for this project");
        require(recipient != address(0), "Invalid recipient address");
        
        tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Mint NFT
        _safeMint(recipient, tokenId);
        
        // Store metadata
        nftMetadata[tokenId] = NFTMetadata({
            projectId: projectId,
            projectName: projectName,
            image: image,
            tier: TierType.FIRST_CHAMPION,
            rankNumber: 1,
            donationAmount: donationAmount,
            totalDonors: 1,
            mintTimestamp: block.timestamp
        });
        
        hasFirstChampion[projectId] = true;
        firstChampionAmount[projectId] = donationAmount;
        
        // Set token URI
        _setTokenURI(tokenId, _generateTokenURI(tokenId));
        
        emit NFTMinted(recipient, tokenId, projectId, TierType.FIRST_CHAMPION, 1);
    }
    
    /**
     * @notice Mint "Stealth Ninja" NFT for first donation larger than the first champion
     * @param recipient Address to receive the NFT
     * @param projectId Project ID
     * @param projectName Name of the project
     * @param image Image URL of the project
     * @param donationAmount Amount donated
     */
    function mintStealthNinja(
        address recipient,
        uint256 projectId,
        string memory projectName,
        string memory image,
        uint256 donationAmount
    ) external onlyMinter nonReentrant returns (uint256 tokenId) {
        require(recipient != address(0), "Invalid recipient address");
        require(hasFirstChampion[projectId], "First Champion must exist");
        require(!hasStealthNinja[projectId], "Stealth Ninja already minted for this project");
        require(donationAmount > firstChampionAmount[projectId], "Amount must be larger than first champion");
        
        tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Mint NFT
        _safeMint(recipient, tokenId);
        
        // Store metadata
        nftMetadata[tokenId] = NFTMetadata({
            projectId: projectId,
            projectName: projectName,
            image: image,
            tier: TierType.STEALTH_NINJA,
            rankNumber: 1,
            donationAmount: donationAmount,
            totalDonors: 0, // Will be updated at campaign end
            mintTimestamp: block.timestamp
        });
        
        hasStealthNinja[projectId] = true;
        
        // Set token URI
        _setTokenURI(tokenId, _generateTokenURI(tokenId));
        
        emit NFTMinted(recipient, tokenId, projectId, TierType.STEALTH_NINJA, 1);
    }
    
    /**
     * @notice End campaign and mint tier-based NFTs using proportional scaling
     * @param projectId Project ID
     * @param projectName Name of the project
     * @param image Image URL of the project
     * @param sortedDonors Array of donor addresses sorted by donation amount (highest first)
     * @param sortedAmounts Array of donation amounts sorted (highest first)
     */
    function endCampaignAndMintTiers(
        uint256 projectId,
        string memory projectName,
        string memory image,
        address[] calldata sortedDonors,
        uint256[] calldata sortedAmounts
    ) external onlyMinter nonReentrant {
        require(sortedDonors.length == sortedAmounts.length, "Arrays length mismatch");
        require(sortedDonors.length > 0, "No donors provided");
        
        uint256 totalDonors = sortedDonors.length;
        TierCounts memory tierCounts = calculateTierCounts(totalDonors);
        
        uint256 currentIndex = 0;
        
        // Mint Diamond Tier NFTs
        for (uint256 i = 0; i < tierCounts.diamond && currentIndex < totalDonors; i++) {
            _mintTierNFT(
                sortedDonors[currentIndex],
                projectId,
                projectName,
                image,
                TierType.DIAMOND,
                currentIndex + 1,
                sortedAmounts[currentIndex],
                totalDonors
            );
            currentIndex++;
        }
        
        // Mint Platinum Tier NFTs
        for (uint256 i = 0; i < tierCounts.platinum && currentIndex < totalDonors; i++) {
            _mintTierNFT(
                sortedDonors[currentIndex],
                projectId,
                projectName,
                image,
                TierType.PLATINUM,
                currentIndex + 1,
                sortedAmounts[currentIndex],
                totalDonors
            );
            currentIndex++;
        }
        
        // Mint Gold Tier NFTs
        for (uint256 i = 0; i < tierCounts.gold && currentIndex < totalDonors; i++) {
            _mintTierNFT(
                sortedDonors[currentIndex],
                projectId,
                projectName,
                image,
                TierType.GOLD,
                currentIndex + 1,
                sortedAmounts[currentIndex],
                totalDonors
            );
            currentIndex++;
        }
        
        // Mint Silver Tier NFTs
        for (uint256 i = 0; i < tierCounts.silver && currentIndex < totalDonors; i++) {
            _mintTierNFT(
                sortedDonors[currentIndex],
                projectId,
                projectName,
                image,
                TierType.SILVER,
                currentIndex + 1,
                sortedAmounts[currentIndex],
                totalDonors
            );
            currentIndex++;
        }
        
        emit CampaignEnded(projectId, totalDonors, tierCounts);
    }
    
    /**
     * @notice Calculate tier counts using proportional scaling system
     * @param totalDonors Total number of donors
     * @return TierCounts struct with calculated counts
     */
    function calculateTierCounts(uint256 totalDonors) public pure returns (TierCounts memory) {
        TierCounts memory counts;
        
        // Proportional scaling formula
        counts.diamond = totalDonors >= 100 ? totalDonors / 100 : 1;
        counts.platinum = totalDonors >= 50 ? totalDonors / 50 : 1;
        counts.gold = totalDonors >= 25 ? totalDonors / 25 : 2;
        counts.silver = totalDonors >= 15 ? totalDonors / 15 : 3;
        
        // Ensure hierarchy: Diamond ≤ Platinum ≤ Gold ≤ Silver
        if (counts.platinum < counts.diamond) counts.platinum = counts.diamond;
        if (counts.gold < counts.platinum) counts.gold = counts.platinum;
        if (counts.silver < counts.gold) counts.silver = counts.gold;
        
        return counts;
    }
    
    /**
     * @notice Internal function to mint tier-based NFTs
     */
    function _mintTierNFT(
        address recipient,
        uint256 projectId,
        string memory projectName,
        string memory image,
        TierType tier,
        uint256 rankNumber,
        uint256 donationAmount,
        uint256 totalDonors
    ) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Mint NFT
        _safeMint(recipient, tokenId);
        
        // Store metadata
        nftMetadata[tokenId] = NFTMetadata({
            projectId: projectId,
            projectName: projectName,
            image: image,
            tier: tier,
            rankNumber: rankNumber,
            donationAmount: donationAmount,
            totalDonors: totalDonors,
            mintTimestamp: block.timestamp
        });
        
        // Set token URI
        _setTokenURI(tokenId, _generateTokenURI(tokenId));
        
        emit NFTMinted(recipient, tokenId, projectId, tier, rankNumber);
    }
    
    /**
     * @notice Generate token URI with metadata
     * @param tokenId Token ID
     * @return Token URI string
     */
    function _generateTokenURI(uint256 tokenId) internal view returns (string memory) {
        NFTMetadata memory metadata = nftMetadata[tokenId];
        
        string memory tierName = _getTierName(metadata.tier);
        string memory description = string(abi.encodePacked(
            "Donation Champion NFT for project '",
            metadata.projectName,
            "' - ",
            tierName,
            " (Rank #",
            metadata.rankNumber.toString(),
            " of ",
            metadata.totalDonors.toString(),
            " donors)"
        ));
        
        string memory json = string(abi.encodePacked(
            '{"name":"', metadata.projectName, " - ", tierName, '",',
            '"description":"', description, '",',
            '"image":"', metadata.image, '",',
            '"attributes":[',
                '{"trait_type":"Project","value":"', metadata.projectName, '"},',
                '{"trait_type":"Tier","value":"', tierName, '"},',
                '{"trait_type":"Rank","value":', metadata.rankNumber.toString(), '},',
                '{"trait_type":"Total Donors","value":', metadata.totalDonors.toString(), '},',
                '{"trait_type":"Donation Amount","value":', metadata.donationAmount.toString(), '}',
            ']}'
        ));
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }
    
    /**
     * @notice Get tier name string
     * @param tier TierType enum
     * @return Tier name as string
     */
    function _getTierName(TierType tier) internal pure returns (string memory) {
        if (tier == TierType.FIRST_CHAMPION) return "First Champion";
        if (tier == TierType.STEALTH_NINJA) return "Stealth Ninja";
        if (tier == TierType.DIAMOND) return "Diamond Tier";
        if (tier == TierType.PLATINUM) return "Platinum Tier";
        if (tier == TierType.GOLD) return "Gold Tier";
        if (tier == TierType.SILVER) return "Silver Tier";
        return "Unknown";
    }
    
    function _exists(uint256 tokenId) internal view returns (bool) {
        return nftMetadata[tokenId].projectId != 0;
    }
    
    /**
     * @notice Get NFT metadata for a token
     * @param tokenId Token ID
     * @return NFTMetadata struct
     */
    function getNFTMetadata(uint256 tokenId) external view returns (NFTMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return nftMetadata[tokenId];
    }
    
    /**
     * @notice Get preview of tier counts for a given number of donors
     * @param totalDonors Number of donors
     * @return TierCounts struct
     */
    function previewTierCounts(uint256 totalDonors) external pure returns (TierCounts memory) {
        return calculateTierCounts(totalDonors);
    }
    
    /**
     * @notice Check if a project has specific NFT types
     * @param projectId Project ID
     * @return hasFC Whether First Champion exists
     * @return hasSN Whether Stealth Ninja exists
     */
    function getProjectNFTStatus(uint256 projectId) external view returns (bool hasFC, bool hasSN) {
        return (hasFirstChampion[projectId], hasStealthNinja[projectId]);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
