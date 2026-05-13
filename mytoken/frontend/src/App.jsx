import ConnectWallet from "./components/ConnectWallet";
import ReceiveAddress from "./components/ReceiveAddress";
import TokenBalance from "./components/TokenBalance";
// import BuyTokens from "./components/BuyTokens";
import TransferTokens from "./components/TransferTokens";
import TransactionHistory from "./components/TransactionHistory";
// import AdminPanel from "./components/AdminPanel";
import { useAccount } from "wagmi";

const contractAddress =
  import.meta.env.VITE_CONTRACT_ADDRESS ??
  "0xb4A80CCd9EA66c2FDCE48Fd589ab88De47d69744";

function App() {
  const { address, isConnected } = useAccount();
  // const isAdmin =
  //   isConnected &&
  //   address.toLowerCase() ===
  //     "0x105BB13429850368a94bE4E184735200E6DE3865".toLowerCase(); // Remplacez par l'adresse du propriétaire du contrat
  return (
    <div className="min-h-screen w-full bg-slate-950 px-0 py-0 text-slate-900 sm:flex sm:items-center sm:justify-center sm:px-4 sm:py-10">
      <div className="flex w-full max-w-none flex-col gap-4 sm:max-w-md">
        {!isConnected ? (
          <ConnectWallet />
        ) : (
          <div className="flex flex-col items-stretch gap-4">
            {/* <h1 className="text-3xl font-bold">TokenCoin - ERC20 TKC</h1> */}
            <ConnectWallet />

            <TokenBalance contractAddress={contractAddress} />
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <ReceiveAddress />
              </div>
              <div className="flex-1">
                <TransferTokens contractAddress={contractAddress} />
              </div>
            </div>
            <TransactionHistory contractAddress={contractAddress} />
            {/* {isAdmin && <AdminPanel contractAddress={contractAddress} />} */}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
