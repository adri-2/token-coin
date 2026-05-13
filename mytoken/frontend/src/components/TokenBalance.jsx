import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { tokenAbi } from "../utils/abi";
import { useEffect } from "react";

export default function TokenBalance({ contractAddress }) {
  const { address, isConnected } = useAccount();
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [address],
    query: { enabled: isConnected },
  });
  const { data: totalSupply } = useReadContract({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "totalSupply",
  });
  useEffect(() => {
    if (!isConnected) {
      refetchBalance();
    }
  }, [isConnected, address, refetchBalance]);
  if (!isConnected) return <p>Connectez votre wallet</p>;
  return (
    <div className="card">
      <div className="">
        <p className="text-6xl font-bold">
          {balance ? formatEther(balance) : "0"} TKC
        </p>
      </div>
      <div className="mt-4 shadow-lg p-4 rounded-lg bg-gradient-to-t from-violet-500 to-purple-700 text-white">
        <p className="text-2xl">
          Offre totale : {totalSupply ? formatEther(totalSupply) : "0"} TKC
        </p>
      </div>

      {/* <button onClick={() => refetchBalance()}>Rafraîchir</button> */}
    </div>
  );
}
