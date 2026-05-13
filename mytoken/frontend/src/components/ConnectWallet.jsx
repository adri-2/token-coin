import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const walletConnector = connectors[0];

  return (
    <div className="flex  items-center justify-between gap-4 bg-gradient-to-t from-violet-500 to-purple-700 text-white p-4 rounded-xl  shadow-lg w-full">
      <h1 className="text-3xl">Wallet TKC</h1>
      {isConnected ? (
        <div className="flex flex-col">
          <p>
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          <button
            type="button"
            className="py-2 px-4 rounded-lg bg-violet-800 hover:bg-violet-900  font-bold   hover:scale-105 transition-all cursor-pointer"
            onClick={() => disconnect()}
          >
            Déconnecter
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="py-2 px-4 rounded-lg bg-violet-800 hover:bg-violet-900  font-bold   hover:scale-105 transition-all cursor-pointer"
          onClick={() =>
            walletConnector && connect({ connector: walletConnector })
          }
          disabled={!walletConnector || isPending}
        >
          {isPending ? "Connexion..." : "Connecter le wallet"}
        </button>
      )}
    </div>
  );
}
