import Web3 from "web3";
 
let web3;
 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  //window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/e57793b4fdd6406e8dd386ebf0c8f60d"
  );
  web3 = new Web3(provider);
}
//https://goerli.infura.io/v3/6e60fbbfba9346db89e37bdd1cf28916
 
export default web3;