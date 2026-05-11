// scripts/mint.js
const { ethers } = require("hardhat");
async function main() {
  // const [owner] = await ethers.getSigners();
  // const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  // const MonToken = await ethers.getContractFactory("TokenCoin");
  // const token = MonToken.attach(tokenAddress);

  // const montantEnTokens = 1000;
  // const montantAvecDecimales = ethers.parseEther(montantEnTokens.toString()); // car 18 décimales
  // await token.mint(owner.address, montantAvecDecimales);
  // console.log(`${montantEnTokens} tokens mintés vers ${owner.address}`);
  const MonToken = await ethers.getContractFactory("TokenCoin");
  const token = await MonToken.deploy(
    "MonCoin",
    "MC",
    ethers.parseEther("0.001"),
    ethers.parseEther("0.0009"),
  );

  await token.connect(utilisateur).acheter({ value: ethers.parseEther("0.1") });
  await token.transfer(useTransition, "");
}
main().catch(console.error);
