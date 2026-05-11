const { ethers } = require("hardhat");

async function main() {
  // Paramètres du token
  const nom = "TokenCoin";
  const symbole = "TKC";
  // Prix d'achat : 0.001 ETH par token (soit 10^15 wei)
  const prixAchat = ethers.parseEther("0.001");
  // Prix de vente : 0.0009 ETH par token (soit 9 * 10^14 wei)
  const prixVente = ethers.parseEther("0.0009");

  console.log("Déploiement du contrat MonToken...");

  // Récupérer le contrat (compilé via Hardhat)
  const MonToken = await ethers.getContractFactory("TokenCoin");

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
  const [owner] = await ethers.getSigners();
  const balance = await token.balanceOf(owner.address);
  console.log(
    `Solde initial du propriétaire (${owner.address}) : ${ethers.formatEther(
      balance,
    )} TKC`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
