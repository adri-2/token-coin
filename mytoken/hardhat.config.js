require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const mainnetPrivateKey =
  process.env.MAINNET_PRIVATE_KEY || process.env.PRIVATE_KEY;

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
      url:
        process.env.RPC_URL ||
        process.env.SEPOLIA_RPC_URL ||
        "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    // Mainnet Ethereum (production)
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "https://eth.llamarpc.com",
      // Fallback sur PRIVATE_KEY pour éviter un runner sans signer.
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
