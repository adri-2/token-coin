import { createConfig, http, injected } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { hardhat, localhost, sepolia } from "wagmi/chains";

const chains = [sepolia, hardhat, localhost];
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const connectors = [injected()];

if (projectId) {
  connectors.push(
    walletConnect({
      projectId,
      showQrModal: true,
      metadata: {
        name: "TokenCoin DApp",
        description: "Connecte ton wallet pour gerer tes TKC",
        url: window.location.origin,
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
      },
    }),
  );
}

export const wagmiConfig = createConfig({
  chains,
  connectors,
  transports: {
    [sepolia.id]: http(),
    [hardhat.id]: http(),
    [localhost.id]: http(),
  },
});

export { chains };
