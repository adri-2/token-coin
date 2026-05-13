# Configuration de la Connexion des Wallets

Ton dApp supporte maintenant plusieurs wallets sur **desktop et mobile** !

## Wallets Supportés

1. **MetaMask** - Extension navigateur (Desktop) + App Mobile
2. **WalletConnect** - Code QR pour connecter n'importe quel wallet (Mobile & Desktop)
3. **Coinbase Wallet** - App Coinbase (Mobile & Desktop)
4. **Injected Wallets** - Autres extensions de navigateur

---

## Configuration Required

### 1. Obtenir un Project ID WalletConnect (Gratuit)

WalletConnect permet à n'importe qui de scanner un QR code pour connecter leur wallet sur mobile.

**Étapes:**

1. Va sur <https://cloud.walletconnect.com>
2. Crée un compte gratuit
3. Crée un nouveau projet
4. Copie ton **Project ID**
5. Dans le dossier `frontend/`, crée un fichier `.env.local` :

```bash
VITE_WALLETCONNECT_PROJECT_ID=ton_project_id_ici
```

1. Redémarre le serveur dev

```bash
npm run dev
```

---

## Utilisation

### Desktop (PC/Mac)

1. Utilisateur clique sur **"Connecter le wallet"**
2. Choisit entre:
   - **MetaMask** - Utilise l'extension MetaMask
   - **WalletConnect** - Ouvre un QR code
   - **Coinbase Wallet** - Utilise Coinbase Wallet
   - **Injected** - Autre extension

### Mobile (Téléphone)

**Option 1: WalletConnect (QR Code)**

1. Utilisateur clique sur **"Connecter le wallet"**
2. Choisit **"WalletConnect"**
3. Scanne le QR code avec son app wallet (MetaMask, Trust Wallet, Rainbow, etc.)
4. Approuve la connexion

**Option 2: Wallets Intégrés**

- MetaMask Mobile App
- Coinbase Wallet App
- Autres wallets compatibles

---

## Production (Hébergement)

Quand tu héberges ta dApp:

1. Ajoute ta variable d'environnement sur ta plateforme d'hébergement:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site Settings → Build & Deploy → Environment
   - **GitHub Pages**: N/A (voir Alternative ci-dessous)

2. Variable à ajouter:

   ```
   VITE_WALLETCONNECT_PROJECT_ID=ton_project_id
   ```

3. Redéploie

---

## Partager ta dApp

Une fois hébergée, tu peux partager:

- **URL**: <https://tondomaine.com>
- **Mobile**: Partage le lien, il ouvrira dans le navigateur mobile
- **QR Code**: Génère un QR code pointant vers ta dApp

Les utilisateurs peuvent maintenant:

- Se connecter avec leur wallet depuis desktop
- Se connecter avec WalletConnect depuis mobile
- Acheter, envoyer, et gérer des tokens

---

## Résolution des Problèmes

**"WalletConnect n'affiche pas de QR code"**

- Vérifie que `VITE_WALLETCONNECT_PROJECT_ID` est configuré
- Assure-toi que le fichier `.env.local` existe et est lisible

**"MetaMask Mobile ne se connecte pas"**

- Utilise WalletConnect à la place (plus fiable)
- Ou ouvre ta dApp dans le navigateur in-app de MetaMask

**"Erreur de réseau"**

- Vérifie que tu es sur le bon réseau blockchain (Sepolia par défaut)
- Pour localhost: assure-toi que ton nœud local tourne

---

## Support Futur

Tu peux ajouter d'autres wallets:

- Magic Link (email login)
- Argent
- Braavos
- Et bien d'autres via WalletConnect!
