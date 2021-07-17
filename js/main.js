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
  "function getMemberBetWin(uint256 _betID, address _member) view returns (uint value)",
  "function currentEra() view returns (uint256)",
];

// main provider
let provider;
let kattContract;
let signer;

// infura provider
let infuraProjectId = "86a437462c0b40b18dcc634cfb6b0a6a";
let infuraProvider = new ethers.providers.InfuraProvider("ropsten", infuraProjectId);
let infuraKattContract = new ethers.Contract(kattAddress, kattAbi, infuraProvider);

async function connectWallet() {
  window.ethereum.enable().then(async function() {
    provider = await new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    kattContract = await new ethers.Contract(kattAddress, kattAbi, window.signer);
    getNetworkStateChangedFunctions();
  });
}

async function joinLottery() {
  await connectWallet();
  return kattContract.joinLottery();
}

async function claimLottery() {
  await connectWallet();
  var _currentEra = await infuraKattContract.currentEra();
  return kattContract.withdrawAllLotteryWins(_currentEra);
}

function BigNumberToInt(x) {
  return ethers.utils.formatEther(x);
}

$(function() {
  getOverviewData();
});

function getOverviewData() {
  $.getJSON("https://tdao.me/kattapi/getKattStatsFromEtherscan.php", function( data ) {
    console.log(data);
  });

  $.when(infuraKattContract.totalSupply()).then(function( data, textStatus, jqXHR ) {
    $("#data-max-supply").html(BigNumberToInt(data));
  });
}

function getNetworkStateChangedFunctions() {
  $("#btn-join-lottery").click(async function() {
    var _success = await joinLottery();
    var _message = _success ? "Join successfully" : "Something went wrong";
    $("#lottery-join-message").html(_message);
    console.log(_success);
  });
  $("#btn-claim-lottery").click(async function() {
    var _success = await claimLottery();
    var _message = _success ? "Claim successfully" : "Something went wrong";
    $("#lottery-claim-message").html(_message);
    console.log(_success);
  });
}

// Modals

// var openmodaljoinlottery = document.querySelectorAll('.modal-join-lottery-open')
// for (var i = 0; i < openmodaljoinlottery.length; i++) {
//   openmodaljoinlottery[i].addEventListener('click', function(event){
//   event.preventDefault()
//   toggleModalJoinLottery()
//   })
// }
// const overlay = document.querySelector('.modal-overlay')
// overlay.addEventListener('click', toggleModalJoinLottery)

// var closemodaljoinlottery = document.querySelectorAll('.modal-close')
// for (var i = 0; i < closemodaljoinlottery.length; i++) {
//   closemodaljoinlottery[i].addEventListener('click', toggleModalJoinLottery)
// }      
// document.onkeydown = function(evt) {
//   evt = evt || window.event
//   var isEscape = false
//   if ("key" in evt) {
//   isEscape = (evt.key === "Escape" || evt.key === "Esc")
//   } else {
//   isEscape = (evt.keyCode === 27)
//   }
//   if (isEscape && document.body.classList.contains('modal-active')) {
//     toggleModalJoinLottery()
//   }
// }; 
// function toggleModalJoinLottery() {
//   const body = document.querySelector('body')
//   const modal = document.querySelector('.modal-join-lottery')
//   modal.classList.toggle('opacity-0')
//   modal.classList.toggle('pointer-events-none')
//   body.classList.toggle('modal-active')
// }