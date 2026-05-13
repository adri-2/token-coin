import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { tokenAbi } from "../utils/abi";

export default function BuyTokens({ contractAddress }) {
  const [ethAmount, setEthAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setEthAmount("");
      setIsOpen(false);
    }
  }, [isSuccess]);

  const handleBuy = (event) => {
    event.preventDefault();
    if (!ethAmount || parseFloat(ethAmount) <= 0) return;
    writeContract({
      address: contractAddress,
      abi: tokenAbi,
      functionName: "acheter",
      value: parseEther(ethAmount),
    });
  };

  return (
    <div className="card">
      {/* <h3>Acheter des tokens</h3>
      <p>Ouvre le formulaire modal pour saisir le montant en ETH.</p> */}
      <button
        className="px-6 py-2 bg-violet-500 text-2xl text-white rounded hover:bg-violet-600"
        onClick={() => {
          setEthAmount("");
          setIsOpen(true);
        }}
      >
        Acheter
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-slate-900">
                Acheter des tokens
              </h3>
              <button
                type="button"
                className="rounded-full px-3 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                onClick={() => setIsOpen(false)}
              >
                X
              </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleBuy}>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Montant en ETH
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.10"
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                />
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-violet-900 px-4 py-3 text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isPending || isConfirming}
                >
                  {isPending
                    ? "En attente..."
                    : isConfirming
                    ? "Confirmation..."
                    : "Acheter"}
                </button>
              </div>

              {isSuccess && (
                <p className="text-sm font-medium text-emerald-600">
                  Achat réussi !
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
