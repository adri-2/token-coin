import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useReconnect } from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { reconnect } = useReconnect();
  const hasWalletConnect = connectors.some(
    (connector) => connector.id === "walletConnect",
  );

  useEffect(() => {
    reconnect();
  }, [reconnect]);

  useEffect(() => {
    const handleAppReturn = () => {
      if (document.visibilityState === "visible" && !isConnected) {
        reconnect();
      }
    };

    window.addEventListener("focus", handleAppReturn);
    document.addEventListener("visibilitychange", handleAppReturn);

    return () => {
      window.removeEventListener("focus", handleAppReturn);
      document.removeEventListener("visibilitychange", handleAppReturn);
    };
  }, [isConnected, reconnect]);

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-linear-to-t from-violet-500 to-purple-700 p-4 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
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
              className="cursor-pointer rounded-lg bg-violet-800 px-4 py-2 font-bold transition-all hover:scale-105 hover:bg-violet-900 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => connect({ connector })}
              disabled={isPending}
            >
              {isPending && pendingConnector?.id === connector.id
                ? "Connexion..."
                : `Connecter ${connector.name}`}
            </button>
          ))}
          {!hasWalletConnect && (
            <p className="text-xs text-violet-100">
              WalletConnect indisponible: ajoute VITE_WALLETCONNECT_PROJECT_ID
              dans .env.local
            </p>
          )}
        </div>
      )}
    </div>
  );
}
