import { useAccount, useContractEvents, usePublicClient } from "wagmi";
import { tokenAbi } from "../utils/abi";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

export default function TransactionHistory({ contractAddress }) {
  const [fromBlock, setFromBlock] = useState(undefined);
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const formatAddress = (address) => {
    if (address === "0x0000000000000000000000000000000000000000") {
      return "0x0000...0000";
    }

    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    async function setBlockRange() {
      const currentBlock = await publicClient.getBlockNumber();
      // Prendre les 5000 derniers blocs (suffisant pour un test local)
      setFromBlock(currentBlock - 5000n);
    }
    setBlockRange();
  }, [publicClient]);

  const {
    data: events,
    isLoading,
    error,
  } = useContractEvents({
    address: contractAddress,
    abi: tokenAbi,
    eventName: "Transfer",
    fromBlock,
    enabled: !!fromBlock && isConnected && !!address,
  });

  if (error) return <p>Erreur : {error.message}</p>;
  if (isLoading) return <p>Chargement historique...</p>;
  if (!isConnected || !address) return null;

  const relevantEvents = (events ?? []).filter(
    (event) =>
      event.args.from?.toLowerCase() === address.toLowerCase() ||
      event.args.to?.toLowerCase() === address.toLowerCase(),
  );

  if (relevantEvents.length === 0) return <p>Aucune transaction trouvée.</p>;

  const recentEvents = [...relevantEvents].slice(-20).reverse();

  return (
    <div className="rounded-2xl border border-violet-200/10 bg-violet-500 p-5 text-white">
      <h3 className="mb-4 text-xl font-semibold">Historique des transferts</h3>

      <div className="space-y-2">
        {recentEvents.map((event, idx) => {
          const from = formatAddress(event.args.from);
          const to = formatAddress(event.args.to);
          const direction =
            event.args.to?.toLowerCase() === address.toLowerCase() ? "+" : "-";
          const amount = formatEther(event.args.value);

          return (
            <div
              key={idx}
              className="flex flex-col gap-1 rounded-xl border border-violet-200/10 bg-violet-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="text-sm text-white">
                {from} <span className="text-violet-300">→</span> {to}
              </div>

              <div
                className={`text-sm sm:text-right ${
                  direction === "+" ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {direction}
                {amount} MTK
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
