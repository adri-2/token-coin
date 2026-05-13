const { ethers } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners();
  if (!signers.length) {
    throw new Error(
      "Aucun signer configure pour ce reseau. Definissez MAINNET_PRIVATE_KEY (ou PRIVATE_KEY) dans .env.",
    );
  }

  const owner = signers[0];

  const provider = ethers.provider;
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice ?? feeData.maxFeePerGas;
  const balance = await provider.getBalance(owner.address);

  if (gasPrice && gasPrice > 0n) {
    // Un ERC20 + OpenZeppelin + fonctionnalités custom dépasse souvent 1M gas au déploiement.
    const conservativeDeployGas = 1_800_000n;
    const affordableGasUnits = balance / gasPrice;

    if (affordableGasUnits < conservativeDeployGas) {
      const neededEth = ethers.formatEther(conservativeDeployGas * gasPrice);
      const currentEth = ethers.formatEther(balance);
      throw new Error(
        `Solde insuffisant pour deployer sur ce reseau. Solde: ${currentEth} ETH, besoin estime: ~${neededEth} ETH (gas seulement). Ajoutez des ETH mainnet sur ${owner.address}.`,
      );
    }
  }

  // Paramètres du token
  const nom = "TokenCoin";
  const symbole = "TKC";
  // Prix d'achat : 0.001 ETH par token (soit 10^15 wei)
  const prixAchat = ethers.parseEther("0.001");
  // Prix de vente : 0.0009 ETH par token (soit 9 * 10^14 wei)
  const prixVente = ethers.parseEther("0.0009");

  console.log("Déploiement du contrat MonToken...");

  // Récupérer le contrat (compilé via Hardhat)
  const MonToken = await ethers.getContractFactory("TokenCoin", owner);

  // Déployer avec les arguments du constructeur
  const token = await MonToken.deploy(nom, symbole, prixAchat, prixVente);

  // Attendre que le déploiement soit confirmé
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("Contrat déployé à l'adresse :", address);
  console.log("Nom :", nom);
  console.log("Symbole :", symbole);
  console.log("Prix d'achat :", ethers.formatEther(prixAchat), "ETH/token");
  console.log("Prix de vente :", ethers.formatEther(prixVente), "ETH/token");
  console.log("Propriétaire du contrat :", await token.owner());
  console.log("Total supply initiale :", await token.totalSupply(), "TKC");

  // Optionnel : afficher le solde initial du propriétaire (1000 tokens mintés automatiquement)
  const tokenBalance = await token.balanceOf(owner.address);
  console.log(
    `Solde initial du propriétaire (${owner.address}) : ${ethers.formatEther(
      tokenBalance,
    )} TKC`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
