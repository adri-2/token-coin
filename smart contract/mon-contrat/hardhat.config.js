require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
module.exports = {
  solidity: "0.8.26",
  networks: {
    hardhat: {}, // réseau local automatique pour les tests
    localhost: {
      url: "http://127.0.0.1:8545",
    },

    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // on le remplira plus tard
  },
};
