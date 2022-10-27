const hre = require("hardhat");

async function main() {
  const WODToken = await hre.ethers.getContractFactory("WODToken");
  const wodToken = await WODToken.deploy();

  await wodToken.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
