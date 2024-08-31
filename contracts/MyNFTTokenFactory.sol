// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// import "./MyNFTToken.sol";
import "./MyNFTTokenUpgradeable.sol";

contract MyNFTTokenFactory is OwnableUpgradeable {
    // contract MyNFTTokenFactory is Ownable {
    address[] public nftTokenContracts;
    uint256 public nftTokenCounter;
    mapping(address => bool) public isNftTokenDeployed;

    /**
     * @notice comment constructor if upgradeable
     */
    // constructor() {}

    /**
     * @notice comment initialize if NOT upgradeable
     */
    function initialize() external initializer {}

    /**
     * @dev deploy a new ERC721 token contract
     * @param collName collection name
     * @param collSym collection symbol
     * @return newNFTToken deployed NFT token address
     */
    function deployNewNFTToken(
        string memory collName,
        string memory collSym,
        address creator
    ) external onlyOwner returns (address) {
        // Uncomment in case of token NOT upgradeable:
        // MyNFTToken newNFTToken = new MyNFTToken(collName, collSym);

        // Uncomment in case of token upgradeable:
        MyNFTTokenUpgradeable newNFTTokenUpgradeable = new MyNFTTokenUpgradeable();
        newNFTTokenUpgradeable.initialize(collName, collSym);

        // From this point onwards is the same, change only the name of the token (newNFTToken or newNFTTokenUpgradeable)
        newNFTTokenUpgradeable.transferOwnership(creator);
        nftTokenContracts.push(address(newNFTTokenUpgradeable));
        nftTokenCounter += 1;
        isNftTokenDeployed[address(newNFTTokenUpgradeable)] = true;
        return address(newNFTTokenUpgradeable);
    }

    /**
     * @dev get NFT token address in an array, based on array index
     * @param _idx token array index
     * @return nftTokenContracts[_idx] token address
     */
    function getNftTokenAddress(uint256 _idx) external view returns (address) {
        require(_idx < nftTokenCounter, "Array index out of bound");
        return nftTokenContracts[_idx];
    }

    /**
     * @dev get deployed NFT token counter
     * @return nftTokenCounter deployed token contract counter
     */
    function getNftTokenCounter() external view returns (uint256) {
        return nftTokenCounter;
    }

    /**
     * @dev check if an address is a deployed NFT token
     * @return isNftTokenDeployed[token] true or false
     */
    function getNftTokenDeployed(address token) public view returns (bool) {
        return isNftTokenDeployed[token];
    }

    function pauseNFTContract(address _nftToBePaused) external onlyOwner {
        require(
            getNftTokenDeployed(_nftToBePaused),
            "NFT token not deployed by this factory"
        );
        IMyNFTToken(_nftToBePaused).pause();
    }

    function unpauseNFTContract(address _nftToBePaused) external onlyOwner {
        require(
            getNftTokenDeployed(_nftToBePaused),
            "NFT token not deployed by this factory"
        );
        IMyNFTToken(_nftToBePaused).unpause();
    }
}
