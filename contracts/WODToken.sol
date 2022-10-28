// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WODToken is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint MAX_SUPPLY = 1000;
    uint INITIAL_PRICE = 1000000000000000;
    uint FEE_PERCENTAGE = 5;

    struct Meta{
        bool forSale;
        uint lastPrice;
        uint askPrice;
    }

    mapping(uint=>Meta) public properties;

    constructor() ERC721("Waves Of Decay Insiders Club", "WOD") {}

    function safeMint(address to) private {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        properties[tokenId] = Meta(false, INITIAL_PRICE, INITIAL_PRICE);
    }

    function buy() public payable{
        _buy(msg.sender);
    }

    function buy(address receiver) public payable{
        _buy(receiver);
    }

    // buy the NFT from the owner
    function _buy(address receiver) private{
        require(msg.value >= INITIAL_PRICE, "price too low");
        require(totalSupply() < MAX_SUPPLY, "All passes have been created already");

        // send ETH to the owner
        (bool sent,) = payable(owner()).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        safeMint(receiver);
    }

    function setForSale(uint tokenId, bool forSale) public onlyTokenOwner(tokenId){
        properties[tokenId].forSale = forSale;
    }

    function setPrice(uint tokenId, uint newPrice) public onlyTokenOwner(tokenId){
        require(newPrice <= properties[tokenId].lastPrice * 110 / 100, "the price is too high! We only allow a 10% increase on the last buy price");
        properties[tokenId].askPrice = newPrice;
    }

    function trade(uint tokenId) public payable{
        require(msg.value >= properties[tokenId].askPrice, "price too low");
        require(properties[tokenId].forSale, "pass is not for sale");

        address previousOwner = ownerOf(tokenId);

        uint fee = msg.value * FEE_PERCENTAGE / 100;
        // send fee to the contract owner
        (bool feeSent,) = payable(owner()).call{value: fee}("");
        require(feeSent, "Failed to send fee to the band");

        // send ETH to the token owner
        (bool paymentSent,) = payable(previousOwner).call{value: msg.value - fee}("");
        require(paymentSent, "Failed to send payment to the new owner");

        // update token price
        properties[tokenId].lastPrice = properties[tokenId].askPrice;

        _transfer(previousOwner, msg.sender, tokenId);
    }

    // modifiers

    modifier onlyTokenOwner(uint tokenId){
        require(ownerOf(tokenId) == msg.sender, "sender is not the owner");
        _;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
