// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Waves Of Decay Insiders Club
/// @author Ben Gyles
/// @notice ERC721 NFT project example for special member access

contract WODToken is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint public MAX_SUPPLY;
    uint public INITIAL_PRICE;
    uint public FEE_PERCENTAGE;

    // token metadata
    struct Meta {
        bool forSale;
        uint lastPrice;
        uint askPrice;
    }

    mapping(uint => Meta) public properties;

    /// @notice deploys the contract with some configuration variables
    /// @param max_supply The maximum amount of tokens that can be minted
    /// @param initial_price The default price for every minted token
    /// @param fee_percentage The fee percentage that gets allocated to the contract owner on each trade
    constructor(uint max_supply, uint initial_price, uint fee_percentage) ERC721("Waves Of Decay Insiders Club", "WOD") {
        MAX_SUPPLY = max_supply;
        INITIAL_PRICE = initial_price;
        FEE_PERCENTAGE = fee_percentage;
    }

    // mint the NFT
    function safeMint(address to) private {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        properties[tokenId] = Meta(false, INITIAL_PRICE, INITIAL_PRICE);
    }

    /// @notice Buy an NFT directly from the contract owner
    function buy() public payable {
        _buy(msg.sender);
    }

    /// @notice Buy an NFT directly from the contract owner for another user
    /// @param receiver The address that will receive the newly minted token
    function buy(address receiver) public payable {
        _buy(receiver);
    }

    // buy the NFT from the owner
    function _buy(address receiver) private {
        require(msg.value >= INITIAL_PRICE, "Price too low");
        require(totalSupply() < MAX_SUPPLY, "All passes have been created already");

        // send ETH to the owner
        (bool sent,) = payable(owner()).call{value : msg.value}("");
        require(sent, "Failed to send Ether");
        safeMint(receiver);
    }

    /// @notice Put the token up for sale or cancel the sale
    /// @param tokenId The ID of the token
    /// @param forSale boolean to indicate whether the token should be for sale (true) or not (false)
    function setForSale(uint tokenId, bool forSale) public onlyTokenOwner(tokenId) {
        properties[tokenId].forSale = forSale;
    }

    /// @notice change the price of the token and put it up for sale
    /// @param tokenId The ID of the token
    /// @param newPrice amount of ETH you want to sell the token for, cannot be higher than 110% of the last buy price
    function sell(uint tokenId, uint newPrice) public onlyTokenOwner(tokenId) {
        require(newPrice <= properties[tokenId].lastPrice * 110 / 100, "The price is too high! We only allow a 10% increase on the last buy price");
        properties[tokenId].askPrice = newPrice;
        properties[tokenId].forSale = true;
    }

    /// @notice Buy the token from another user, a fee will be sent to the contract owner
    /// @param tokenId The ID of the token
    function trade(uint tokenId) public payable {
        require(msg.value >= properties[tokenId].askPrice, "Price too low");
        require(properties[tokenId].forSale, "Pass is not for sale");

        address previousOwner = ownerOf(tokenId);

        uint fee = msg.value * FEE_PERCENTAGE / 100;
        // send fee to the contract owner
        (bool feeSent,) = payable(owner()).call{value : fee}("");
        require(feeSent, "Failed to send fee to the band");

        // send remaining balance to the token owner
        (bool paymentSent,) = payable(previousOwner).call{value : msg.value - fee}("");
        require(paymentSent, "Failed to send payment to the previous owner");

        // update token price and disable forSale
        properties[tokenId].lastPrice = properties[tokenId].askPrice;
        properties[tokenId].forSale = false;

        _transfer(previousOwner, msg.sender, tokenId);
    }

    // modifiers

    modifier onlyTokenOwner(uint tokenId){
        require(ownerOf(tokenId) == msg.sender, "Sender is not the owner");
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
