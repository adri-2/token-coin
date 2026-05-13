import { useContractEvents, usePublicClient } from "wagmi";
import { tokenAbi } from "../utils/abi";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

export default function TransactionHistory({ contractAddress }) {
  const [fromBlock, setFromBlock] = useState(undefined);
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
    enabled: !!fromBlock,
  });

  if (error) return <p>Erreur : {error.message}</p>;
  if (isLoading) return <p>Chargement historique...</p>;
  if (!events || events.length === 0) return <p>Aucune transaction trouvée.</p>;

  const recentEvents = [...events].slice(-20).reverse();

  return (
    <div className="rounded-2xl border border-violet-200/10 bg-violet-500 p-5 text-white">
      <h3 className="mb-4 text-xl font-semibold">Historique des transferts</h3>

      <div className="space-y-2">
        {recentEvents.map((event, idx) => {
          const from =
            event.args.from === "0x0000000000000000000000000000000000000000"
              ? "Mint"
              : formatAddress(event.args.from);
          const to =
            event.args.to === "0x0000000000000000000000000000000000000000"
              ? "Burn"
              : formatAddress(event.args.to);

          return (
            <div
              key={idx}
              className="flex flex-col gap-1 rounded-xl border border-violet-200/10 bg-violet-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="text-sm text-white">
                {from} <span className="text-violet-300">→</span> {to}
              </div>

              <div className="text-sm text-emerald-300 sm:text-right">
                {formatEther(event.args.value)} MTK
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
