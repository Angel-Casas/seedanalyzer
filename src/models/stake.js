"use strict";

var BaseDice = require("./baseDice");

module.exports = class StakeDice extends BaseDice {
  constructor(proxy) {
    super(proxy);
    this.currencies = ["btc", "eth", "ltc", "doge", "bch", "usdt"];
  }

  async bet(betInfo, info) {
    let betInfo = betInfo;
    let info = info;
    let amount = betInfo.PayIn / 100000000;
    let condition = betInfo.high == true ? "above" : "below";
    let currency = betInfo.currency.toLowerCase();
    let target = 0;
    if (betInfo.high) {
      target = 999999 - Math.floor((betInfo.chance * 10000)) + 1;
    } else {
      target = Math.floor((betInfo.chance * 10000)) - 1;
    }
    target = parseFloat(target/10000).toFixed(2);
    betInfo.condition = betInfo.high ? ">" : "<";
    betInfo.target = target;
    betInfo.profit = (parseFloat(betInfo.payout) - parseFloat(betInfo.amount)).toFixed(8);
    betInfo.roll = parseFloat(betInfo.state.result).toFixed(2);
    betInfo.payout = parseFloat(betInfo.payout).toFixed(8);
    betInfo.amount = parseFloat(betInfo.amount).toFixed(8);
    info.info.balance = (parseFloat(info.info.profit) + parseFloat(betInfo.profit)).toFixed(8);
    info.info.wagered = (parseFloat(info.info.wagered) + parseFloat(amount)).toFixed(8);
    info.currentInfo.wagered = (parseFloat(info.currentInfo.wagered) + parseFloat(amount)).toFixed(8);
    info.currentInfo.profit = (parseFloat(info.currentInfo.profit) + parseFloat(betInfo.profit)).toFixed(8);
    if (betInfo.profit > 0) {
      betInfo.win = true;
      info.info.wins++;
      info.currentInf.wins++;
    } else {
      betInfo.win = false;
      info.info.losses++;
      info.currentInfo.losses++;
    }
    let returnInfo = {};
    returnInfo.betInfo = betInfo;
    returnInfo.info = info;
    return returnInfo;
  }
}
exports.StakeDice