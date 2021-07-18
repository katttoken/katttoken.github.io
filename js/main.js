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
  // window.ethereum.enable().then(async function() {
  //   provider = await new ethers.providers.Web3Provider(window.ethereum);
  //   signer = await provider.getSigner();
  //   kattContract = await new ethers.Contract(kattAddress, kattAbi, signer);
  //   // getNetworkStateChangedFunctions();
  // });
  await window.ethereum.enable();
  provider = await new ethers.providers.Web3Provider(window.ethereum);
  signer = await provider.getSigner();
  kattContract = await new ethers.Contract(kattAddress, kattAbi, signer);
}

async function isWalletConnected() {
  var _connected = true;
  try {
    await signer.getAddress();
  } catch (error) {
    _connected = false;
  }
  return _connected;
}

async function joinLottery() {
  await connectWallet();
  return await kattContract.joinLottery();
}

async function claimLottery() {
  await connectWallet();
  var _currentEra = await infuraKattContract.currentEra();
  return await kattContract.withdrawAllLotteryWins(_currentEra);
}

function BigNumberToInt(x) {
  return ethers.utils.formatEther(x);
}

$(function() {
  getNetworkStateChangedFunctions();
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
    $("#lottery-join-loading").css('display','inline');
    joinLottery().then((_success) => {
      $("#lottery-claim-message").html(_success);
      $("#lottery-join-loading").hide();
    }).catch((error) => {
      $("#lottery-claim-message").html(error);
      $("#lottery-join-loading").hide();
    });
  });
  $("#btn-claim-lottery").click(async function() {
    $("#lottery-claim-loading").css('display','inline');
    claimLottery().then((_success) => {
      $("#lottery-claim-message").html(_success);
      $("#lottery-claim-loading").hide();
    }).catch((error) => {
      $("#lottery-claim-message").html(error);
      $("#lottery-claim-loading").hide();
    });
  });
}

function beer() {
  return {
      seconds: '00',
      minutes: '00',
      hours: '00',
      days: '00',
      distance: 0,
      countdown: null,
      beerTime: new Date('May 17, 2021 00:00:00').getTime(),
      now: new Date().getTime(),
      start: function() {
          this.countdown = setInterval(() => {
              // Calculate time
              this.now = new Date().getTime();
              this.distance = this.beerTime - this.now;
              // Set Times
              this.days = this.padNum( Math.floor(this.distance / (1000*60*60*24)) );
              this.hours = this.padNum( Math.floor((this.distance % (1000*60*60*24)) / (1000*60*60)) );
              this.minutes = this.padNum( Math.floor((this.distance % (1000*60*60)) / (1000*60)) );
              this.seconds = this.padNum( Math.floor((this.distance % (1000*60)) / 1000) );
              // Stop
              if (this.distance < 0) {
                  clearInterval(this.countdown);
                  this.days = '00';
                  this.hours = '00';
                  this.minutes = '00';
                  this.seconds = '00';
              }
          },100);
      },
      padNum: function(num) {
          var zero = '';
          for (var i = 0; i < 2; i++) {
              zero += '0';
          }
          return (zero + num).slice(-2);
      }
  }
}