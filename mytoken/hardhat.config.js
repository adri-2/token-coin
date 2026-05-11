require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Réseau local de développement (Hardhat node)
    hardhat: {
      chainId: 1337,
    },
    // Réseau local personnalisé (si vous lancez `npx hardhat node`)
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // Testnet Sepolia (Ethereum)
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
