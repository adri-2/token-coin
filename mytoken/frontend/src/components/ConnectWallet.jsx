import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const walletConnector = connectors[0];

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-gradient-to-t from-violet-500 to-purple-700 p-4 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl sm:text-3xl">Wallet TKC</h1>
      {isConnected ? (
        <div className="flex flex-col">
          <p>
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-violet-800 px-4 py-2 font-bold transition-all hover:scale-105 hover:bg-violet-900"
            onClick={() => disconnect()}
          >
            Déconnecter
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-violet-800 px-4 py-2 font-bold transition-all hover:scale-105 hover:bg-violet-900"
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
