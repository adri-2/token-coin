import { useState, useRef, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { tokenAbi } from "../utils/abi";

export default function TransferTokens({ contractAddress }) {
  const { address } = useAccount();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [hasShownSuccess, setHasShownSuccess] = useState(false);
  const modalRef = useRef(null);

  const { data: balance } = useReadContract({
    address: contractAddress,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [address],
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const isValidAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const handleTransfer = () => {
    setError("");

    if (!toAddress.trim()) {
      setError("Veuillez entrer une adresse");
      return;
    }

    if (!isValidAddress(toAddress)) {
      setError("Adresse invalide (doit être 0x suivi de 40 caractères hex)");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Veuillez entrer un montant valide");
      return;
    }

    try {
      writeContract({
        address: contractAddress,
        abi: tokenAbi,
        functionName: "transfer",
        args: [toAddress, parseEther(amount)],
      });
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const showTimer = setTimeout(() => {
        setHasShownSuccess(true);
      }, 0);

      const timer = setTimeout(() => {
        setToAddress("");
        setAmount("");
        setError("");
        setIsModalOpen(false);
        setHasShownSuccess(false);
      }, 2000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(timer);
      };
    }
  }, [isSuccess]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        event.target.id !== "transferButton"
      ) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isModalOpen]);

  return (
    <div>
      {/* <h3>Transférer des tokens</h3>
      <p>Votre solde : {balance ? formatEther(balance) : "0"} TKC</p> */}
      <button
        id="transferButton"
        type="button"
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="w-full rounded bg-violet-500 px-6 py-3 text-2xl text-white hover:bg-violet-600 cursor-pointer"
      >
        Envoyer
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-10 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-2xl p-6 w-96 max-w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Transférer des tokens</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Adresse destinataire
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Montant (TKC)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded text-sm">
                Solde disponible: {balance ? formatEther(balance) : "0"} TKC
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleTransfer}
                disabled={isPending || isLoading || hasShownSuccess}
                className="w-full px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {hasShownSuccess
                  ? " Transfert effectué !"
                  : isPending
                  ? "Envoi en cours..."
                  : isLoading
                  ? "Confirmation..."
                  : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
