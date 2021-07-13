import { ethers } from "js/ethers-5.2.esm.min.js";

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

// You can also use an ENS name for the contract address
const kattAddress = "0x658dcfaeec83ab0bf6857b2603f94fc948ba86a9";

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const kattAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

const kattContract = new ethers.Contract(kattAddress, kattAbi, provider);
