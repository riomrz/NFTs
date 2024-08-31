// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract My1155Token is ERC1155Supply, Ownable {

    uint256 public constant JokerWater = 1;
    uint256 public constant JokerPalace = 2;
    uint256 public constant JokerColumns = 3;
    uint256 public constant JokerColosseum = 4;

    mapping (uint256 => string) private _uris;

    constructor() ERC1155("ipfs://QmZGcCPHZg2rN3AVFVASHof6jZ6SPs1CmHMXjBKuTBdFa8/{id}.json") {
        _mint(msg.sender, JokerWater, 10, "");
        _mint(msg.sender, JokerPalace, 20, "");
        _mint(msg.sender, JokerWater, 30, "");
        _mint(msg.sender, JokerWater, 5, "");
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function uri(uint256 tokenId) override public view returns (string memory) {
        return(_uris[tokenId]);
    }

    function setTokenUri(uint256 tokenId, string memory tokenUri) public onlyOwner {
        require(bytes(_uris[tokenId]).length == 0, "Cannot set uri twice");
        _uris[tokenId] = tokenUri;
    }
}
