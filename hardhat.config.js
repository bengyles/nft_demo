require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "goerli",
  networks: {
    hardhat: {
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/V2RXpb-pHizhncGQ3-s1oq0a4rEYnULW",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: "0.8.4",
};
