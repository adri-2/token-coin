async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("wallet connecte");
  } else {
    alert("Installe MetaMask");
  }
}
