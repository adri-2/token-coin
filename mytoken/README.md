# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js --network sepolia
```

To verify a Sepolia deployment, pass the deployed contract address first, then the constructor arguments in the same order as `TokenCoin` expects them:

```shell
npx hardhat verify --network sepolia 0xb4A80CCd9EA66c2FDCE48Fd589ab88De47d69744 "TokenCoin" "TKC" 1000000000000000 900000000000000
```

If you put `scripts/deploy.js` where the address should be, Hardhat will report it as an invalid address.
