import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function ReceiveAddress() {
  const { address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [copyState, setCopyState] = useState("Copier l'adresse");

  const handleCopy = async () => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopyState("Adresse copiée");
      window.setTimeout(() => setCopyState("Copier l'adresse"), 1500);
    } catch {
      setCopyState("Copie impossible");
      window.setTimeout(() => setCopyState("Copier l'adresse"), 1500);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  if (!isConnected) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full rounded bg-violet-500 px-6 py-3 text-2xl font-semibold text-white hover:bg-violet-600 cursor-pointer"
      >
        Recevoir
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-900">
                Adresse publique
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold leading-none text-gray-500 hover:text-gray-700"
              >
                X
              </button>
            </div>

            <div className="rounded-lg border border-gray-300 px-3 py-2">
              <p className="break-all font-mono text-sm text-slate-900">
                {address}
              </p>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 rounded-lg bg-violet-500 px-4 py-2 font-medium text-white hover:bg-violet-600"
              >
                {copyState}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
