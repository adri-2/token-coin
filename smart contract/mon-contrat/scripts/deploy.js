const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("=== Déploiement du contrat Vault ===");
  console.log("Compte           :", deployer.address);
  // console.log(
  //   "Balance          :",
  //   ethers.utils.formatEther(await deployer.getBalance()),
  //   "ETH",
  // );

  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy();
  // await vault.deployed();

  console.log("✅ Vault déployé à :", await vault.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
