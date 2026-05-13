import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const hasWalletConnect = connectors.some((connector) =>
    connector.name.toLowerCase().includes("walletconnect"),
  );

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
        <div className="flex flex-col gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              type="button"
              className="cursor-pointer rounded-lg bg-violet-800 px-4 py-2 font-bold transition-all hover:scale-105 hover:bg-violet-900 disabled:cursor-not-allowed disabled:opacity-70"
              onClick={() => connect({ connector })}
              disabled={isPending}
            >
              {isPending ? "Connexion..." : `Connecter ${connector.name}`}
            </button>
          ))}
          {!hasWalletConnect && (
            <p className="text-sm text-violet-100">
              Ajoutez <code>VITE_WALLETCONNECT_PROJECT_ID</code> pour activer
              la connexion mobile.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
