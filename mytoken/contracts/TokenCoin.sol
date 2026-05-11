// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract TokenCoin is ERC20, Ownable, Pausable {
    // --- Configuration du prix d'achat/vente ---
    uint256 public prixAchat; // Nombre de wei pour 1 token (ex: 0.001 ETH = 10^15 wei)
    uint256 public prixVente; // Nombre de wei récupéré pour 1 token vendu

    // --- Événements pour faciliter le suivi ---
    event TokensAchetes(
        address indexed acheteur,
        uint256 montantETH,
        uint256 tokensRecus
    );
    event TokensVendus(
        address indexed vendeur,
        uint256 tokensVendus,
        uint256 ethRecu
    );
    event PrixModifies(uint256 nouveauPrixAchat, uint256 nouveauPrixVente);
    event FondsRetires(address admin, uint256 montant);

    constructor(
        string memory nom,
        string memory symbole,
        uint256 _prixAchat,
        uint256 _prixVente
    ) ERC20(nom, symbole) Ownable(msg.sender) {
        prixAchat = _prixAchat;
        prixVente = _prixVente;
        // Mint initial optionnel (ex: 1000 tokens au déployeur)
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    // --- 1. Transférer des tokens (déjà inclus dans ERC20) ---
    // La fonction `transfer(address to, uint256 amount)` est déjà fournie par ERC20.
    // On peut l'utiliser directement. Pas besoin de la réécrire.

    // --- 2. Consulter le solde (déjà inclus) ---
    // `balanceOf(address account)` est standard.

    // --- 3. Créer des tokens (Mint) ---
    // Seul le propriétaire (administrateur) peut minter de nouveaux tokens.
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // --- 4. Détruire des tokens (Burn) ---
    // N'importe quel détenteur peut brûler ses propres tokens.
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // --- 5. Autoriser un autre compte à utiliser les tokens (approve) ---
    // Déjà fourni par ERC20 : `approve(address spender, uint256 amount)`.
    // Le propriétaire autorise un autre compte à dépenser une certaine quantité.

    // --- 6. Vérifier l'autorisation (allowance) ---
    // Déjà fourni par ERC20 : `allowance(address owner, address spender)`.

    // --- 7. Transfert automatique autorisé (transferFrom) ---
    // Déjà fourni par ERC20 : `transferFrom(address from, address to, uint256 amount)`.
    // Permet à un compte autorisé (via approve) de transférer des tokens depuis un autre compte.

    // --- 8. Acheter des tokens avec ETH ---
    function acheter() external payable whenNotPaused {
        require(msg.value > 0, "Envoi ETH requis");
        uint256 tokensRecus = (msg.value * 10 ** decimals()) / prixAchat;
        require(
            tokensRecus > 0,
            "Montant ETH insuffisant pour acheter au moins 1 token"
        );
        _mint(msg.sender, tokensRecus);
        emit TokensAchetes(msg.sender, msg.value, tokensRecus);
    }

    // --- 9. Vendre des tokens contre ETH ---
    function vendre(uint256 tokenAmount) external whenNotPaused {
        require(tokenAmount > 0, "Montant de tokens a vendre doit etre > 0");
        uint256 ethARendre = (tokenAmount * prixVente) / 10 ** decimals();
        require(
            ethARendre > 0,
            "Le nombre de tokens ne permet pas de recuperer de l'ETH"
        );
        require(
            address(this).balance >= ethARendre,
            "Contrat insolvable, pas assez d'ETH"
        );

        _burn(msg.sender, tokenAmount);
        payable(msg.sender).transfer(ethARendre);
        emit TokensVendus(msg.sender, tokenAmount, ethARendre);
    }

    // --- 10. Modifier le prix du token (achat/vente) ---
    function modifierPrix(
        uint256 _nouveauPrixAchat,
        uint256 _nouveauPrixVente
    ) external onlyOwner {
        require(
            _nouveauPrixAchat > 0 && _nouveauPrixVente > 0,
            "Prix doivent etre > 0"
        );
        prixAchat = _nouveauPrixAchat;
        prixVente = _nouveauPrixVente;
        emit PrixModifies(_nouveauPrixAchat, _nouveauPrixVente);
    }

    // --- 11. Retirer les fonds (ETH) accumulés dans le contrat ---
    function retirerFonds() external onlyOwner {
        uint256 solde = address(this).balance;
        require(solde > 0, "Aucun fonds a retirer");
        payable(owner()).transfer(solde);
        emit FondsRetires(owner(), solde);
    }

    // --- 12. Pause du contrat ---
    // OpenZeppelin Pausable fournit `pause()` et `unpause()`.
    // On restreint ces fonctions au propriétaire.
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Surcharge nécessaire pour que le transfert, mint, burn respectent l'état "paused"
    // Les fonctions ERC20 et les nôtres utilisent `whenNotPaused` ou `whenPaused`.
    // Pour les fonctions héritées (transfer, transferFrom), on override avec le modificateur.
    function transfer(
        address to,
        uint256 amount
    ) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }
}
