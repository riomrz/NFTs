// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./MyToken.sol";

contract MyTokenFactory {
    address[] public deployedTokens;
    mapping(address => bool) public isTokenDeployed;
    uint256 public tokenCounter;

    constructor() {}

    function addTokenToDeployedToken(address token) internal {
        deployedTokens.push(token);
        isTokenDeployed[token] = true;
        tokenCounter += 1;
    }

    function deployNewToken(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _supply
    ) external {
        MyToken token = new MyToken(_tokenName, _tokenSymbol, _supply);
        addTokenToDeployedToken(address(token));
    }

    function getTokenDeployed(address token) external view returns (bool) {
        return isTokenDeployed[token];
    }
}
