import { createConfig, http, injected } from "wagmi";
import { hardhat, localhost, sepolia } from "wagmi/chains";

const chains = [sepolia, hardhat, localhost];

export const wagmiConfig = createConfig({
  chains,
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
    [hardhat.id]: http(),
    [localhost.id]: http(),
  },
});

export { chains };
