//const provider = new ethers.providers.Web3Provider(window.etherium)
//window.provider = new ethers.providers.InfuraProvider("ropsten");
// const testNet = "ropsten";
// const infuraProjectId = "86a437462c0b40b18dcc634cfb6b0a6a";
// window.provider = new ethers.providers.InfuraProvider(testNet, infuraProjectId);
//const signer = provider.getSigner()

let provider;
let kattContract;
let signer;

// You can also use an ENS name for the contract address
const kattAddress = "0xc481676320d18c7459fa979128d0139d58c5f3cd";

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const kattAbi = [
  "function totalSupply() view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "function approve(address delegate, uint numTokens) returns (bool)",
  "function allowance(address owner, address delegate) view returns (uint)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "function transferFrom(address owner, address buyer, uint numTokens) returns (bool)",
  "function joinLottery() returns(bool)",
  "function withdrawAllLotteryWins(uint era) returns (uint value)",
  "function withdrawLotteryWin(uint era, uint day) returns (uint value)",
  "function getMemberLotteryWin(uint era, uint day, address member) view returns (uint value)",
  "function getNextEraEmission() public view returns (uint)",
  "function getDayEmission() view returns (uint)",
  "function createBet(string calldata _description, bytes32[] calldata _options, uint256 _betDurationInHours) returns (uint256)",
  "function placeBet(uint256 _betID, uint _option, uint256 _betAmount)",
  "function endBet(uint256 _betID, uint winOption)",
  "function withdrawBetWin(uint256 _betID) returns (uint value)",
  "function getMemberBetWin(uint256 _betID, address _member) view returns (uint value)"
];

// x = await kattContract.getDayEmission();
// BigNumberToInt(x)

async function connectWallet() {
  window.ethereum.enable().then(async function() {
    provider = await new ethers.providers.Web3Provider(window.ethereum);
    window.signer = provider.getSigner();
    kattContract = await new ethers.Contract(kattAddress, kattAbi, window.signer);
    getOverviewData();
  });
}

async function joinLottery() {
  return kattContract.joinLottery();
}

function BigNumberToInt(x) {
  return ethers.utils.formatEther(x);
}

$(function() {
});

function getOverviewData() {
  $.getJSON("https://tdao.me/kattapi/getKattStatsFromEtherscan.php", function( data ) {
    console.log(data);
  });

  $.when(kattContract.totalSupply()).then(function( data, textStatus, jqXHR ) {
    $("#data-max-supply").html(BigNumberToInt(data));
  });

  $("#btn-join-lottery").click(async function() {
    var _success = await joinLottery();
    var _message = _success ? "Join successfully" : "Something went wrong";
    $("#lottery-join-message").html(_message);
    console.log(_success);
  });

}