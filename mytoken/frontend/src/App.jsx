import ConnectWallet from "./components/ConnectWallet";
import TokenBalance from "./components/TokenBalance";
import BuyTokens from "./components/BuyTokens";
import TransferTokens from "./components/TransferTokens";
import TransactionHistory from "./components/TransactionHistory";
import AdminPanel from "./components/AdminPanel";
import { useAccount } from "wagmi";

const contractAddress =
  import.meta.env.VITE_CONTRACT_ADDRESS ??
  "0xb4A80CCd9EA66c2FDCE48Fd589ab88De47d69744";

function App() {
  const { address, isConnected } = useAccount();
  const isAdmin =
    isConnected &&
    address.toLowerCase() ===
      "0x105BB13429850368a94bE4E184735200E6DE3865".toLowerCase(); // Remplacez par l'adresse du propriétaire du contrat
  return (
    <div className="">
      {!isConnected ? (
        <ConnectWallet />
      ) : (
        <div className="flex flex-col items-center gap-6 p-6">
          {/* <h1 className="text-3xl font-bold">TokenCoin - ERC20 TKC</h1> */}
          <ConnectWallet />
          <TokenBalance contractAddress={contractAddress} />
          <div className="flex justify-between gap-8">
            <BuyTokens contractAddress={contractAddress} />
            <TransferTokens contractAddress={contractAddress} />
          </div>
          <TransactionHistory contractAddress={contractAddress} />
          {isAdmin && <AdminPanel contractAddress={contractAddress} />}
        </div>
      )}
    </div>
  );
}

export default App;
