//const provider = new ethers.providers.Web3Provider(window.etherium)
//window.provider = new ethers.providers.InfuraProvider("ropsten");
const testNet = "ropsten";
const infuraProjectId = "86a437462c0b40b18dcc634cfb6b0a6a";
window.provider = new ethers.providers.InfuraProvider(testNet, infuraProjectId);
//const signer = provider.getSigner()

// You can also use an ENS name for the contract address
const kattAddress = "0xc481676320d18c7459fa979128d0139d58c5f3cd";

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const kattAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "function getDayEmission() view returns (uint)"
];

const kattContract = new ethers.Contract(kattAddress, kattAbi, provider);

async function connectWallet() {
  let provider;
  window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
  const signer = provider.getSigner();
}