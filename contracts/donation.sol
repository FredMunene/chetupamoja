// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

// Interface for the NFT contract
interface IDonationNFT {
    struct TierCounts {
        uint256 diamond;
        uint256 platinum;
        uint256 gold;
        uint256 silver;
    }
    
    function mintFirstChampion(
        address recipient,
        uint256 projectId,
        string memory projectName,
        string memory image,
        uint256 donationAmount
    ) external returns (uint256 tokenId);
    
    function mintStealthNinja(
        address recipient,
        uint256 projectId,
        string memory projectName,
        string memory image,
        uint256 donationAmount
    ) external returns (uint256 tokenId);
    
    function endCampaignAndMintTiers(
        uint256 projectId,
        string memory projectName,
        string memory image,
        address[] calldata sortedDonors,
        uint256[] calldata sortedAmounts
    ) external;
    
    function calculateTierCounts(uint256 totalDonors) external pure returns (TierCounts memory);
    
    function getProjectNFTStatus(uint256 projectId) external view returns (bool hasFC, bool hasSN);
}

/**
 * @title ProjectDonationContractWithNFT
 * @dev Smart contract for handling donations with NFT reward system
 */
contract ProjectDonationContractWithNFT is ReentrancyGuard, Ownable, Pausable {
    
    // Enums
    enum TokenType { ETH, ERC20 }
    
    // Structs
    struct Deposit {
        address depositor;
        uint256 amount;
        address tokenAddress; // address(0) for ETH
        TokenType tokenType;
        uint256 projectId;
        uint256 timestamp;
        bool withdrawn;
    }
    
    struct Project {
        string name;
        uint256 totalDeposited;
        uint256 totalWithdrawn;
        bool active;
        uint256 createdAt;
        uint256 endTime; // Campaign end time
        string imageUrl;
        bool campaignEnded;
        address[] donors; // Array of unique donors
        mapping(address => uint256) donorTotalAmount; // Total donated by each donor
        uint256 firstChampionAmount; // Amount of first donation
    }
    
    struct DonorRanking {
        address donor;
        uint256 totalAmount;
    }
    
    // State variables
    mapping(uint256 => Deposit) public deposits;
    mapping(uint256 => Project) public projects;
    mapping(uint256 => uint256[]) public projectDeposits; // projectId => depositIds[]
    mapping(address => uint256[]) public userDeposits; // user => depositIds[]
    mapping(address => bool) public allowedTokens;
    mapping(uint256 => mapping(address => bool)) public hasDeposited; // projectId => donor => hasDeposited
    
    uint256 public nextDepositId = 1;
    uint256 public nextProjectId = 1;
    uint256 public defaultCampaignDuration = 30 days;
    
    // NFT contract reference
    IDonationNFT public donationNFT;
    
    // Events
    event DepositMade(
        address indexed depositor,
        uint256 indexed depositId,
        uint256 indexed projectId,
        uint256 amount,
        TokenType tokenType,
        address tokenAddress
    );
    
    event WithdrawalMade(
        address indexed recipient,
        uint256 indexed depositId,
        uint256 amount,
        TokenType tokenType,
        address tokenAddress
    );
    
    event ProjectCreated(
        uint256 indexed projectId,
        string name,
        uint256 endTime
    );
    
    event CampaignEnded(
        uint256 indexed projectId,
        uint256 totalDonors,
        uint256 totalAmount
    );
    
    event FirstChampionAwarded(
        uint256 indexed projectId,
        address indexed champion,
        uint256 amount
    );
    
    event StealthNinjaAwarded(
        uint256 indexed projectId,
        address indexed ninja,
        uint256 amount
    );
    
    // Constructor
    constructor(address _donationNFT) Ownable(msg.sender) {
        require(_donationNFT != address(0), "Invalid NFT contract address");
        donationNFT = IDonationNFT(_donationNFT);
    }

    // Modifiers
    modifier validProject(uint256 projectId) {
        require(projectId > 0 && projectId < nextProjectId, "Invalid project ID");
        require(projects[projectId].active, "Project not active");
        require(!projects[projectId].campaignEnded, "Campaign has ended");
        require(block.timestamp < projects[projectId].endTime, "Campaign time expired");
        _;
    }
    
    // Project Management Functions
    
    /**
     * @notice Create a new project/donation campaign
     * @param name Project name
     * @param durationDays Campaign duration in days (0 for default)
     */
    function createProject(
        string memory name,
        string memory imageUrl,
        uint256 durationDays
    ) external onlyOwner returns (uint256 projectId) {
        require(bytes(name).length > 0, "Project name required");
        
        projectId = nextProjectId++;
        uint256 duration = durationDays > 0 ? durationDays * 1 days : defaultCampaignDuration;
        uint256 endTime = block.timestamp + duration;
        
        Project storage newProject = projects[projectId];
        newProject.name = name;
        newProject.totalDeposited = 0;
        newProject.totalWithdrawn = 0;
        newProject.active = true;
        newProject.createdAt = block.timestamp;
        newProject.imageUrl = imageUrl;
        newProject.endTime = endTime;
        newProject.campaignEnded = false;
        newProject.firstChampionAmount = 0;
        
        emit ProjectCreated(projectId, name, endTime);
    }
    
    /**
     * @notice Set allowed token addresses
     * @param tokenAddress Address of the ERC20 token
     * @param allowed Whether the token is allowed for deposits
     */
    function setAllowedToken(address tokenAddress, bool allowed) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        allowedTokens[tokenAddress] = allowed;
    }
    
    /**
     * @notice Set NFT contract address
     * @param _donationNFT New NFT contract address
     */
    function setNFTContract(address _donationNFT) external onlyOwner {
        require(_donationNFT != address(0), "Invalid NFT contract address");
        donationNFT = IDonationNFT(_donationNFT);
    }
    
    /**
     * @notice Set default campaign duration
     * @param _duration Duration in seconds
     */
    function setDefaultCampaignDuration(uint256 _duration) external onlyOwner {
        require(_duration > 0, "Duration must be greater than 0");
        defaultCampaignDuration = _duration;
    }
    
    // Deposit Functions
    
    /**
     * @notice Deposit ETH to a specific project
     * @param projectId Project ID to deposit to
     */
    function depositETH(uint256 projectId) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
        validProject(projectId) 
        returns (uint256 depositId) 
    {
        require(msg.value > 0, "Amount must be greater than 0");
        
        depositId = _createDeposit(msg.sender, address(0), msg.value, TokenType.ETH, projectId);
        _handleNFTRewards(msg.sender, projectId, msg.value);
        
        emit DepositMade(msg.sender, depositId, projectId, msg.value, TokenType.ETH, address(0));
    }
    
    /**
     * @notice Deposit ERC20 tokens with permit (gasless approval)
     * @param tokenAddress Address of the ERC20 token
     * @param amount Amount to deposit
     * @param projectId Project ID to deposit to
     * @param deadline Permit deadline
     * @param v Permit signature v
     * @param r Permit signature r
     * @param s Permit signature s
     */
    function depositERC20WithPermit(
        address tokenAddress,
        uint256 amount,
        uint256 projectId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant whenNotPaused validProject(projectId) returns (uint256 depositId) {
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        require(allowedTokens[tokenAddress], "Token not allowed");
        
        // Execute permit
        IERC20Permit(tokenAddress).permit(
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );
        
        // Transfer tokens from user to contract
        require(
            IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        
        depositId = _createDeposit(msg.sender, tokenAddress, amount, TokenType.ERC20, projectId);
        _handleNFTRewards(msg.sender, projectId, amount);
        
        emit DepositMade(msg.sender, depositId, projectId, amount, TokenType.ERC20, tokenAddress);
    }
    
    /**
     * @notice Regular ERC20 deposit (requires prior approval)
     * @param tokenAddress Address of the ERC20 token
     * @param amount Amount to deposit
     * @param projectId Project ID to deposit to
     */
    function depositERC20(
        address tokenAddress,
        uint256 amount,
        uint256 projectId
    ) external nonReentrant whenNotPaused validProject(projectId) returns (uint256 depositId) {
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        require(allowedTokens[tokenAddress], "Token not allowed");
        
        // Transfer tokens from user to contract
        require(
            IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        
        depositId = _createDeposit(msg.sender, tokenAddress, amount, TokenType.ERC20, projectId);
        _handleNFTRewards(msg.sender, projectId, amount);
        
        emit DepositMade(msg.sender, depositId, projectId, amount, TokenType.ERC20, tokenAddress);
    }
    
    /**
     * @notice Create a deposit record
     * @param depositor Address of the depositor
     * @param tokenAddress Token address (address(0) for ETH)
     * @param amount Deposit amount
     * @param tokenType Type of token
     * @param projectId Project ID
     * @return depositId The created deposit ID
     */
    function _createDeposit(
        address depositor,
        address tokenAddress,
        uint256 amount,
        TokenType tokenType,
        uint256 projectId
    ) internal returns (uint256 depositId) {
        depositId = nextDepositId++;
        
        deposits[depositId] = Deposit({
            depositor: depositor,
            amount: amount,
            tokenAddress: tokenAddress,
            tokenType: tokenType,
            projectId: projectId,
            timestamp: block.timestamp,
            withdrawn: false
        });
        
        projectDeposits[projectId].push(depositId);
        userDeposits[depositor].push(depositId);
        projects[projectId].totalDeposited += amount;
    }
    
    /**
     * @notice Handle NFT rewards for deposits
     * @param depositor Address of the depositor
     * @param projectId Project ID
     * @param amount Deposit amount
     */
    function _handleNFTRewards(address depositor, uint256 projectId, uint256 amount) internal {
        Project storage project = projects[projectId];
        
        // Add depositor to project if first time
        if (!hasDeposited[projectId][depositor]) {
            project.donors.push(depositor);
            hasDeposited[projectId][depositor] = true;
        }
        
        // Update donor's total amount
        project.donorTotalAmount[depositor] += amount;
        uint256 newTotalAmount = project.donorTotalAmount[depositor];
        
        // Get NFT status for this project
        (bool hasFirstChampion, bool hasStealthNinja) = donationNFT.getProjectNFTStatus(projectId);
        
        // Check for First Champion (first depositor)
        if (!hasFirstChampion && project.donors.length == 1) {
            donationNFT.mintFirstChampion(depositor, projectId, project.name, project.imageUrl, newTotalAmount);
            project.firstChampionAmount = newTotalAmount;
            
            emit FirstChampionAwarded(projectId, depositor, newTotalAmount);
        }
        // Check for Stealth Ninja (first donation larger than first champion)
        else if (hasFirstChampion && !hasStealthNinja && newTotalAmount > project.firstChampionAmount) {
            donationNFT.mintStealthNinja(depositor, projectId, project.name, project.imageUrl, newTotalAmount);
            
            emit StealthNinjaAwarded(projectId, depositor, newTotalAmount);
        }
    }
    
    // Campaign Management Functions
    
    /**
     * @notice End campaign manually and distribute tier NFTs
     * @param projectId Project ID to end
     */
    function endCampaign(uint256 projectId) external onlyOwner nonReentrant {
        require(projectId > 0 && projectId < nextProjectId, "Invalid project ID");
        require(!projects[projectId].campaignEnded, "Campaign already ended");
        
        Project storage project = projects[projectId];
        project.campaignEnded = true;
        project.active = false;
        
        _distributeTierNFTs(projectId);
        
        emit CampaignEnded(projectId, project.donors.length, project.totalDeposited);
    }
    
    /**
     * @notice End expired campaigns and distribute tier NFTs
     * @param projectId Project ID to check and end if expired
     */
    function endExpiredCampaign(uint256 projectId) external nonReentrant {
        require(projectId > 0 && projectId < nextProjectId, "Invalid project ID");
        require(!projects[projectId].campaignEnded, "Campaign already ended");
        require(block.timestamp >= projects[projectId].endTime, "Campaign not yet expired");
        
        Project storage project = projects[projectId];
        project.campaignEnded = true;
        project.active = false;
        
        _distributeTierNFTs(projectId);
        
        emit CampaignEnded(projectId, project.donors.length, project.totalDeposited);
    }
    
    /**
     * @notice Internal function to distribute tier-based NFTs using optimized sorting
     * @param projectId Project ID
     */
    function _distributeTierNFTs(uint256 projectId) internal {
        Project storage project = projects[projectId];
        
        if (project.donors.length == 0) return;
        
        // Create array of donor rankings
        DonorRanking[] memory rankings = new DonorRanking[](project.donors.length);
        
        for (uint256 i = 0; i < project.donors.length; i++) {
            rankings[i] = DonorRanking({
                donor: project.donors[i],
                totalAmount: project.donorTotalAmount[project.donors[i]]
            });
        }
        
        // Sort rankings by amount (highest first) - using bubble sort for simplicity
        // For production, consider using a more efficient sorting algorithm
        for (uint256 i = 0; i < rankings.length - 1; i++) {
            for (uint256 j = 0; j < rankings.length - i - 1; j++) {
                if (rankings[j].totalAmount < rankings[j + 1].totalAmount) {
                    DonorRanking memory temp = rankings[j];
                    rankings[j] = rankings[j + 1];
                    rankings[j + 1] = temp;
                }
            }
        }
        
        // Prepare sorted arrays for NFT contract
        address[] memory sortedDonors = new address[](rankings.length);
        uint256[] memory sortedAmounts = new uint256[](rankings.length);
        
        for (uint256 i = 0; i < rankings.length; i++) {
            sortedDonors[i] = rankings[i].donor;
            sortedAmounts[i] = rankings[i].totalAmount;
        }
        
        // Call NFT contract to mint tier NFTs
        donationNFT.endCampaignAndMintTiers(
            projectId,
            project.name,
            project.imageUrl,
            sortedDonors,
            sortedAmounts
        );
    }
    
    // Withdrawal Functions
    
    /**
     * @notice Withdraw funds from a specific deposit (only owner)
     * @param depositId Deposit ID to withdraw from
     * @param recipient Address to receive the funds
     */
    function withdrawDeposit(uint256 depositId, address payable recipient) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(depositId > 0 && depositId < nextDepositId, "Invalid deposit ID");
        require(recipient != address(0), "Invalid recipient address");
        
        Deposit storage deposit = deposits[depositId];
        require(!deposit.withdrawn, "Deposit already withdrawn");
        require(projects[deposit.projectId].campaignEnded, "Campaign not ended");
        
        deposit.withdrawn = true;
        projects[deposit.projectId].totalWithdrawn += deposit.amount;
        
        if (deposit.tokenType == TokenType.ETH) {
            recipient.transfer(deposit.amount);
        } else {
            require(
                IERC20(deposit.tokenAddress).transfer(recipient, deposit.amount),
                "Token transfer failed"
            );
        }
        
        emit WithdrawalMade(
            recipient,
            depositId,
            deposit.amount,
            deposit.tokenType,
            deposit.tokenAddress
        );
    }
    
    /**
     * @notice Withdraw all funds from a project (only owner)
     * @param projectId Project ID to withdraw from
     * @param recipient Address to receive the funds
     */
    function withdrawProjectFunds(uint256 projectId, address payable recipient) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(projectId > 0 && projectId < nextProjectId, "Invalid project ID");
        require(recipient != address(0), "Invalid recipient address");
        require(projects[projectId].campaignEnded, "Campaign not ended");
        
        uint256[] memory deposits_list = projectDeposits[projectId];
        uint256 totalETH = 0;
        
        
        for (uint256 i = 0; i < deposits_list.length; i++) {
            Deposit storage deposit = deposits[deposits_list[i]];
            if (!deposit.withdrawn) {
                deposit.withdrawn = true;
                
                if (deposit.tokenType == TokenType.ETH) {
                    totalETH += deposit.amount;
                } else {
                    // For ERC20 tokens, we'll handle them separately
                    // This is a simplified approach - in production you might want more sophisticated token handling
                }
                
                emit WithdrawalMade(
                    recipient,
                    deposits_list[i],
                    deposit.amount,
                    deposit.tokenType,
                    deposit.tokenAddress
                );
            }
        }
        
        projects[projectId].totalWithdrawn = projects[projectId].totalDeposited;
        
        // Transfer ETH
        if (totalETH > 0) {
            recipient.transfer(totalETH);
        }
        
        // Note: For ERC20 tokens, you would need to implement separate withdrawal logic
        // due to Solidity limitations with dynamic mappings in memory
    }
    
    /**
     * @notice Emergency withdrawal function for specific tokens (only owner)
     * @param tokenAddress Token address (address(0) for ETH)
     * @param amount Amount to withdraw
     * @param recipient Recipient address
     */
    function emergencyWithdraw(
        address tokenAddress,
        uint256 amount,
        address payable recipient
    ) external onlyOwner nonReentrant {
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        
        if (tokenAddress == address(0)) {
            // ETH withdrawal
            require(address(this).balance >= amount, "Insufficient ETH balance");
            recipient.transfer(amount);
        } else {
            // ERC20 withdrawal
            require(
                IERC20(tokenAddress).transfer(recipient, amount),
                "Token transfer failed"
            );
        }
    }
    
    // View Functions
    
    /**
     * @notice Get project information
     * @param projectId Project ID
     * @return name Project name
     * @return totalDeposited Total amount deposited
     * @return totalWithdrawn Total amount withdrawn
     * @return active Whether project is active
     * @return createdAt Creation timestamp
     * @return endTime Campaign end time
     * @return campaignEnded Whether campaign has ended
     * @return donorCount Number of unique donors
     */
    function getProjectInfo(uint256 projectId) 
        external 
        view 
        returns (
            string memory name,
            uint256 totalDeposited,
            uint256 totalWithdrawn,
            bool active,
            uint256 createdAt,
            uint256 endTime,
            bool campaignEnded,
            uint256 donorCount
        ) 
    {
        require(projectId > 0 && projectId < nextProjectId, "Invalid project ID");
        Project storage project = projects[projectId];
        
        return (
            project.name,
            project.totalDeposited,
            project.totalWithdrawn,
            project.active,
            project.createdAt,
            project.endTime,
            project.campaignEnded,
            project.donors.length
        );
    }
    
    /**
     * @notice Get project donors
     * @param projectId Project ID
     * @return donors Array of donor addresses
     */
    function getProjectDonors(uint256 projectId) external view returns (address[] memory donors) {
        require(projectId > 0 && projectId < nextProjectId, "Invalid project ID");
        return projects[projectId].donors;
    }
    
    /**
     * @notice Get donor's total amount for a project
     * @param projectId Project ID
     * @param donor Donor address
     * @return amount Total amount donated by the donor
     */
    function getDonorAmount(uint256 projectId, address donor) external view returns (uint256 amount) {
        require(projectId > 0 && projectId < nextProjectId, "Invalid project ID");
        return projects[projectId].donorTotalAmount[donor];
    }
    
    /**
     * @notice Get deposit information
     * @param depositId Deposit ID
     * @return deposit Deposit struct
     */
    function getDepositInfo(uint256 depositId) external view returns (Deposit memory deposit) {
        require(depositId > 0 && depositId < nextDepositId, "Invalid deposit ID");
        return deposits[depositId];
    }
    
    /**
     * @notice Get user's deposits
     * @param user User address
     * @return depositIds Array of deposit IDs
     */
    function getUserDeposits(address user) external view returns (uint256[] memory depositIds) {
        return userDeposits[user];
    }
    
    /**
     * @notice Get project's deposits
     * @param projectId Project ID
     * @return depositIds Array of deposit IDs
     */
    function getProjectDeposits(uint256 projectId) external view returns (uint256[] memory depositIds) {
        require(projectId > 0 && projectId < nextProjectId, "Invalid project ID");
        return projectDeposits[projectId];
    }
    
    /**
     * @notice Check if campaign is active
     * @param projectId Project ID
     * @return isActive Whether the campaign is active and accepting donations
     */
    function isCampaignActive(uint256 projectId) external view returns (bool isActive) {
        if (projectId == 0 || projectId >= nextProjectId) return false;
        
        Project storage project = projects[projectId];
        return project.active && 
               !project.campaignEnded && 
               block.timestamp < project.endTime;
    }
    
    // Admin Functions
    
    /**
     * @notice Pause the contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @notice Unpause the contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @notice Get contract balance for a specific token
     * @param tokenAddress Token address (address(0) for ETH)
     * @return balance Contract balance
     */
    function getContractBalance(address tokenAddress) external view returns (uint256 balance) {
        if (tokenAddress == address(0)) {
            return address(this).balance;
        } else {
            return IERC20(tokenAddress).balanceOf(address(this));
        }
    }
    
    // Receive function to accept ETH
    receive() external payable {
        // Allow contract to receive ETH
    }
}