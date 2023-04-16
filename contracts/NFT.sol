// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 maxSupply = 100;
    uint256 cost = 0.0001 ether; //0.001 BNB
    string baseURI = "ipfs://QmS9KWozgMie7SZMgPbyins2Un3ihMzbaB1egdj8vdgfQD/"; 
    //"https://raw.githubusercontent.com/durdomtut0/airdropStarter/main/NFT-data/metadata/";//"https://raw.githubusercontent.com/durdomtut0/NFT-metadata/main/metadata/";

    //NFT storage
    //on chain => svg => base64
    //central server (cloudinary, file storage, firestore, github)
    //IPFS (decentralized file storage), arweave.

    constructor() ERC721("SnakeNFT", "NFT") {}

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
                : "";
    }

    function changeBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function safeMint(address _to) public payable {
        uint256 _currentSupply = totalSupply();
        require(_currentSupply < maxSupply, "You reached max supply");
        require(msg.value >= cost, "Please add valid amount of ETH");
        _safeMint(_to, _currentSupply);
    }

    function withdraw() public onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }
}