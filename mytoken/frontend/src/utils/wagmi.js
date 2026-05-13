import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { hardhat, localhost, sepolia } from "wagmi/chains";

const chains = [sepolia, hardhat, localhost];
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const connectors = [injected()];

if (walletConnectProjectId) {
  connectors.push(
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
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
