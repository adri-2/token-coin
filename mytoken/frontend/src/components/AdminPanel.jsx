import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { tokenAbi } from "../utils/abi";

export default function AdminPanel({ contractAddress }) {
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [prixAchat, setPrixAchat] = useState("");
  const [prixVente, setPrixVente] = useState("");

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleMint = () => {
    if (!mintTo || !mintAmount) return;
    writeContract({
      address: contractAddress,
      abi: tokenAbi,
      functionName: "mint",
      args: [mintTo, parseEther(mintAmount)],
    });
  };

  const handlePause = () => {
    writeContract({
      address: contractAddress,
      abi: tokenAbi,
      functionName: "pause",
    });
  };

  const handleUnpause = () => {
    writeContract({
      address: contractAddress,
      abi: tokenAbi,
      functionName: "unpause",
    });
  };

  const handleSetPrice = () => {
    if (!prixAchat || !prixVente) return;
    writeContract({
      address: contractAddress,
      abi: tokenAbi,
      functionName: "modifierPrix",
      args: [parseEther(prixAchat), parseEther(prixVente)],
    });
  };

  return (
    <div className="rounded-2xl border border-purple-200/10 bg-gray-800 p-6 text-white shadow-md">
      <h3 className="mb-4 text-lg font-semibold">
        Administration (propriétaire uniquement)
      </h3>

      <section className="mb-5">
        <h4 className="mb-2 text-sm font-medium text-slate-300">
          Mint des tokens
        </h4>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none placeholder:text-slate-500"
            placeholder="Adresse destinataire"
            value={mintTo}
            onChange={(e) => setMintTo(e.target.value)}
          />
          <input
            className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none placeholder:text-slate-500 sm:mt-0 sm:ml-3"
            placeholder="Montant (TKC)"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
          />
          <button
            className="mt-2 rounded-2xl bg-violet-500 px-4 py-2 text-white transition hover:bg-violet-600 sm:mt-0 sm:ml-3"
            onClick={handleMint}
            disabled={isPending}
          >
            Minter
          </button>
        </div>
      </section>

      <section className="mb-5">
        <h4 className="mb-2 text-sm font-medium text-slate-300">
          Pause du contrat
        </h4>
        <div className="flex gap-3">
          <button
            className="rounded-2xl border border-white/10 px-4 py-2 text-slate-200 hover:bg-white/5"
            onClick={handlePause}
          >
            Pause
          </button>
          <button
            className="rounded-2xl border border-white/10 px-4 py-2 text-slate-200 hover:bg-white/5"
            onClick={handleUnpause}
          >
            Reprendre
          </button>
        </div>
      </section>

      <section className="mb-4">
        <h4 className="mb-2 text-sm font-medium text-slate-300">
          Modifier les prix (ETH/token)
        </h4>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none placeholder:text-slate-500"
            placeholder="Nouveau prix achat"
            value={prixAchat}
            onChange={(e) => setPrixAchat(e.target.value)}
          />
          <input
            className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none placeholder:text-slate-500 sm:mt-0 sm:ml-3"
            placeholder="Nouveau prix vente"
            value={prixVente}
            onChange={(e) => setPrixVente(e.target.value)}
          />
          <button
            className="mt-2 rounded-2xl bg-violet-500 px-4 py-2 text-white transition hover:bg-violet-600 sm:mt-0 sm:ml-3"
            onClick={handleSetPrice}
          >
            Appliquer
          </button>
        </div>
      </section>

      {isSuccess && (
        <p className="mt-3 text-sm font-medium text-emerald-400">
          ✅ Opération réussie !
        </p>
      )}
    </div>
  );
}
