const hre = require("hardhat");
const {ethers} = require('hardhat');

async function main() {
  const WODToken = await hre.ethers.getContractFactory("WODToken");
  const wodToken = await WODToken.deploy(1000, ethers.utils.parseEther('0.001'), 5);

  await wodToken.deployed();
  console.log(`contract deployed at ${wodToken.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
