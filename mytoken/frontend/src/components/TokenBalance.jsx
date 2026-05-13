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
    <div className="">
      <div className="mt-4 rounded-lg bg-linear-to-t p-4 text-white shadow-lg from-violet-500 to-purple-700 flex justify-center">
        <p className="text-4xl font-bold sm:text-6xl">
          {balance ? formatEther(balance) : "0"} TKC
        </p>
      </div>

      {/* <button onClick={() => refetchBalance()}>Rafraîchir</button> */}
    </div>
  );
}
