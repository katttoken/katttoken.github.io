window.kattAddress = "0x02977aabdc8fd2a8cdbeb8ec4c26d356d5a5e4ff";
// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
window.kattAbi = [
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
  "function withdrawLottery(uint era, uint day) returns (uint value)",
  "function getMemberLotteryWin(uint era, uint day, address member) view returns (uint value)",
  "function getNextEraEmission() public view returns (uint)",
  "function betCount() view returns (uint)",
  "function bets_(uint256 index) view returns (uint256[])",
  "function getDayEmission() view returns (uint)",
  "function createBet(string calldata _description, bytes32[] calldata _options, uint256 _betDurationInHours) returns (uint256)",
  "function placeBet(uint256 _betID, uint _option, uint256 _betAmount)",
  "function endBet(uint256 _betID, uint winOption)",
  "function withdrawBet(uint256 _betID) returns (uint value)",
  "function getMemberBetWin(uint256 _betID, address _member) view returns (uint value)",
  "function currentEra() view returns (uint256)",
  "function currentDay() view returns (uint256)",
  "function nextDayTime() view returns (uint256)",
  "function nextEraTime() view returns (uint256)",
  "function mapMemberEra_LotteryDays(address member, uint256 era, uint256 day) view returns (uint256)",
  "function mapEraDayMember_LotteryShares(uint256 era, uint256 day, address member) view returns (uint256)",
  "function mapEraDay_LotteryTotalShares(uint256 era, uint256 day) view returns (uint256)",
  "function mapEraDay_LotteryMemberCount(uint256 era, uint256 day) view returns (uint256)",
  "function mapEraDay_LotteryMembers(uint256 era, uint256 day, uint256 index) view returns (address)",
  "function getMemberDaysLotteryJoined(address member, uint era) view returns(uint[], uint[])"
];

// infura provider
let infuraProjectId = "86a437462c0b40b18dcc634cfb6b0a6a";
let infuraProvider = new ethers.InfuraProvider("sepolia", infuraProjectId);
let infuraKattContract = new ethers.Contract(window.kattAddress, window.kattAbi, infuraProvider);

// ui variables
window.nextDayTime = 0;
window.currentDay = 0;
window.currentEra = 0;
window.daysPerEra = 244;
window.myDayLotteryShare = 0;
window.bets = [];

async function connectWallet() {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  window.provider = new ethers.BrowserProvider(window.ethereum);
  window.signer = await window.provider.getSigner();
  window.kattContract = await new ethers.Contract(window.kattAddress, window.kattAbi, window.signer);

  $('body')[0].__x.$data.isWalletConnected = true;
  // updates after connecting wallet
  await updateInfoAfterWalletConnected();
  return;
}

async function updateInfoAfterWalletConnected() {
  $.when(infuraKattContract.mapEraDayMember_LotteryShares(window.currentEra,window.currentDay,window.signer.getAddress())).then(function( data, textStatus, jqXHR ) {
    window.myDayLotteryShare = data.toNumber();
    $("#txt-lottery-my-points").text(window.myDayLotteryShare);
    if (window.myDayLotteryShare > 0)
      $("#txt-lottery-joined").show();
    else
      $("#btn-join-lottery").show();
  });
  $.when(infuraKattContract.getMemberDaysLotteryJoined(window.signer.getAddress(),window.currentEra)).then(function( data, textStatus, jqXHR ) {
    var _days = data[0];
    var _shares = data[1];
    var _shareSum = 0;
    $("#table-member-lottery-history > table > tbody").html("");
    for (var i = 0; i < _days.length; i++) {
      var _trElem = $("<tr class='relative transform scale-100 text-xs py-1 border-b-2 border-gray-100 cursor-default'></tr>");
      _trElem.append("<td class='pl-5 pr-3 whitespace-no-wrap'><div class='text-gray-400'>Day " + _days[i].toNumber() + "</div></td>");
      _trElem.append("<td class='px-2 py-2 whitespace-no-wrap'><div class='leading-5 text-gray-900'>" + _shares[i].toNumber() + " shares unclaimed</div></td>");
      $("#table-member-lottery-history > table > tbody").prepend(_trElem);
      if (_days[i] != window.currentDay)
        _shareSum += _shares[i].toNumber();
    }
    if (_shareSum > 0 || Math.floor(new Date().getTime()/1000) > window.nextDayTime)
      $("#btn-claim-lottery").show();
  });
}

async function isWalletConnected() {
  var _connected = true;
  try {
    await window.signer.getAddress();
  } catch (error) {
    _connected = false;
  }
  return _connected;
}

async function joinLottery() {
  await connectWallet();
  if (window.myDayLotteryShare == 0)
    await window.kattContract.joinLottery();
  return;
}

async function claimLottery() {
  await connectWallet();
  if (window.currentEra == 0)
    alert("Infura service is not working properly. Try reload the page before proceeding.");
  else
    return await window.kattContract.withdrawAllLotteryWins(window.currentEra);
  //return await kattContract.withdrawLottery(1,1);
}

async function getBets() {
  await connectWallet();
  var betCount = await window.kattContract.betCount();
  window.bets = await window.kattContract.bets_();
  return;
}

function BigNumberToKatt(x) {
  return ethers.utils.formatEther(x);
}

$(function() {
  getOverviewData();
});

function getOverviewData() {
  $("#txt-contract-address").text(window.kattAddress);
  // $.getJSON("https://tdao.me/kattapi/getKattStatsFromEtherscan.php", function( data ) {
  //   console.log(data);
  // });

  // $.when(infuraKattContract.totalSupply()).then(function( data, textStatus, jqXHR ) {
  //   $("#data-max-supply").html(BigNumberToKatt(data));
  // });

  $.when(infuraKattContract.nextDayTime()).then(function( data, textStatus, jqXHR ) {
    window.nextDayTime = data.toNumber();
  });

  $.when(infuraKattContract.currentEra()).then(function( data, textStatus, jqXHR ) {
    window.currentEra = data.toNumber();
    $("#txt-current-era").text(window.currentEra);
    $.when(infuraKattContract.currentDay()).then(function( data, textStatus, jqXHR ) {
      window.currentDay = data.toNumber();

      getNetworkStateChangedFunctions(); // make sure that window.currentEra and window.currentDay are available

      $("#txt-current-day").text(window.currentDay);
      let eraProgress = window.currentDay/window.daysPerEra*100;
      $("#txt-progress-bar").text(eraProgress.toLocaleString(window.document.documentElement.lang)+"%");
      $("#txt-progress-bar").css("width",eraProgress+"%");
      $.when(infuraKattContract.mapEraDay_LotteryMemberCount(window.currentEra,window.currentDay)).then(function( data, textStatus, jqXHR ) {
        $("#txt-lottery-total-participants").text(data.toNumber());
      });
      $.when(infuraKattContract.mapEraDay_LotteryTotalShares(window.currentEra,window.currentDay)).then(function( data, textStatus, jqXHR ) {
        $("#txt-lottery-total-points").text(data.toNumber());
      });
    });
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

function remainingTimeData() {
  return {
      seconds: '00',
      minutes: '00',
      hours: '00',
      days: '00',
      distance: 0,
      countdown: null,
      now: Math.floor(new Date().getTime()/1000),
      remainingTimeCountdown: function() {
          this.countdown = setInterval(() => {
              // Calculate time
              this.now = Math.floor(new Date().getTime()/1000);
              this.distance = window.nextDayTime - this.now;
              // Set Times
              if (this.distance > 0)
              {
                //this.days = this.padNum( Math.floor(this.distance / (60*60*24)) );
                this.hours = this.padNum( Math.floor((this.distance % (60*60*24)) / (60*60)) );
                this.minutes = this.padNum( Math.floor((this.distance % (60*60)) / (60)) );
                this.seconds = this.padNum( Math.floor((this.distance % (60))) );
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