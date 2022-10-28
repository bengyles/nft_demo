const {expect} = require('chai');
const {ethers} = require('hardhat');

describe('WODToken', function() {
  let initialOwner, owner, fan1, fan2; // accounts
  let WODToken, wodToken; // contracts
  let provider;

  before(async function() {
    provider = await ethers.provider;
    [initialOwner, owner, fan1, fan2] = await ethers.getSigners();
    WODToken = await ethers.getContractFactory('WODToken');
    wodToken = await WODToken.connect(initialOwner).deploy();
    await wodToken.deployed();
  });

  describe('Deployment', async function() {
    it('Should have the deployer as the initial owner', async function() {
      expect(await wodToken.owner()).to.equal(initialOwner.address);
    });
  });

  describe('Configuration', async function() {
    it('should fail when someone other than the owner tries to transfer ownership of the contract', async function() {
      expect(wodToken.connect(fan1).transferOwnership(fan1.address)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should return the new owner after transfering ownership', async function() {
      const setNewOwner = await wodToken.connect(initialOwner).transferOwnership(owner.address);

      // wait until the transaction is mined
      await setNewOwner.wait();
      expect(await wodToken.owner()).to.equal(owner.address);
    });
  });

  describe('Minting', async function() {
    it('should fail when ETH value is too low', async function() {
      expect(wodToken.connect(fan1)['buy()']).to.be.revertedWith('price too low');
    });

    it('should mint 1 token', async function() {
      const tokenPrice = ethers.utils.parseEther('0.001');
      const ownerBalanceBefore = await provider.getBalance(owner.address);
      const tx = await wodToken.connect(fan1)['buy()']({value: tokenPrice});

      // wait until the transaction is mined
      await tx.wait();
      expect(await wodToken.balanceOf(fan1.address)).to.equal(1);
      const ownerBalanceAfter = await provider.getBalance(owner.address);
      expect(ownerBalanceAfter.sub(ownerBalanceBefore)).to.equal(tokenPrice);
    });

    it('should mint 1 token for another address', async function() {
      const tx = await wodToken.connect(fan1)['buy(address)'](fan2.address, {value: ethers.utils.parseEther('0.001')});

      // wait until the transaction is mined
      await tx.wait();
      expect(await wodToken.balanceOf(fan2.address)).to.equal(1);
    });

    //ToDo: test max supply

  });

  describe('Selling', async function() {
    it('should revert when someone other than the owner tries to change the price', async function() {
      const tokenData = await wodToken.properties(0);
      let newPrice = tokenData.lastPrice.mul(105).div(100);
      expect(wodToken.connect(fan2).setPrice(0, newPrice)).to.be.revertedWith('sender is not the owner');
    });

    it('should revert when increasing the price more than 110%', async function() {
      const tokenData = await wodToken.properties(0);
      let newPrice = tokenData.lastPrice.mul(120).div(100);
      expect(wodToken.connect(fan1).setPrice(0, newPrice)).to.be.revertedWith('The price is too high! We only allow a 10% increase on the last buy price');
    });

    it('should set the new token price', async function() {
      let tokenData = await wodToken.properties(0);
      let newPrice = tokenData.lastPrice.mul(105).div(100);
      const tx = await wodToken.connect(fan1).setPrice(0, newPrice);

      await tx.wait();
      tokenData = await wodToken.properties(0);
      expect(tokenData.askPrice).to.equal(newPrice);
    });

    it('should revert when someone other than the owner tries to put the token up for sale', async function() {
      const tokenData = await wodToken.properties(0);

      expect(wodToken.connect(fan2).setForSale(0, true)).to.be.revertedWith('sender is not the owner');
    });

    it('should put the token up for sale', async function() {
      const tokenDataBefore = await wodToken.properties(0);
      expect(tokenDataBefore.forSale).to.equal(false);

      const tx = await wodToken.connect(fan1).setForSale(0, true);

      await tx.wait();
      const tokenDataAfter = await wodToken.properties(0);
      expect(tokenDataAfter.forSale).to.equal(true);
    });

    it('should sell the token and give 5% fee to the contract owner', async function() {
      const tokenData = await wodToken.properties(0);

      // calculate 5% fee like in the contract
      const fee = tokenData.askPrice * 0.05;
      const fan1BalanceBefore = await wodToken.balanceOf(fan1.address);
      const fan2BalanceBefore = await wodToken.balanceOf(fan2.address);
      const ownerBalanceBefore = await provider.getBalance(owner.address);

      const tx = await wodToken.connect(fan2).trade(0, {value: tokenData.askPrice});

      await tx.wait();

      const fan1BalanceAfter = await wodToken.balanceOf(fan1.address);
      const fan2BalanceAfter = await wodToken.balanceOf(fan2.address);
      const ownerBalanceAfter = await provider.getBalance(owner.address);

      expect(fan1BalanceBefore - fan1BalanceAfter).to.equal(1);
      expect(fan2BalanceAfter - fan2BalanceBefore).to.equal(1);
      expect(ownerBalanceAfter.sub(ownerBalanceBefore)).to.equal(fee);
    });
  });
});
