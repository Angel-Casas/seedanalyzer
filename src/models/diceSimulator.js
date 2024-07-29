"use strict";

import BaseDice from './baseDice';
import CryptoJS from "crypto-js";
import { Buffer } from "buffer";

export class DiceSimulator extends BaseDice {
  constructor(proxy) {
    super(proxy);
    this.currencies = ["btc", "eth", "ltc", "doge", "dash", "bch", "xrp", "zec", "etc", "neo", "kmd", "btg", "lsk", "dgb", "qtum", "strat", "waves", "burst"];
  }

  async clear(currency, balance, houseEdge) {
    let c = currency;

    let info = {};

    info.high = false;
    info.balance = 0;
    info.baseBet = 0;
    info.currentBet = 0;
    info.minBet = 0;
    info.baseChance = 0;
    info.currentChance = 0;
    info.bets = 0;
    info.wins = 0;
    info.losses = 0;
    info.profit = 0;
    info.wagered = 0;
    info.currentStreak = 0;
    info.maxWinStreak = 0;
    info.maxLoosingStreak = 0;
    info.maxWinAmount = 0;
    info.maxLostAmount = 0;
    info.highestSingleWin = 0;
    info.highestBet = 0;
    info.highestLost = 0;
    info.highestBalance = 0;
    info.lowestBalance = 0;
    info.nonce = 0;
    info.nonceSteps = 0;
    info.nonceLimit = 0;
    info.currentBetWin = false;
    info.currency = c;
    info.houseEdge = houseEdge;
    info.exit = false;
    info.clientSeed = "";
    info.serverSeed = "";
    info.reportMessage = "";

    switch (c) {

      case "btc": {
        info.balance = 1.000000000*0.01;
        info.minBet=0;

        break;
      }
      case "eth": {

        info.balance=1.000000000*0.001;
        info.minBet=0;

        break;
      }

       case "ltc": {

        info.balance=1.000000000;
        info.minBet=0;

        break;
      }

       case "doge": {

        info.balance=1.000000000*1000;
        info.minBet=0;

        break;
      }

       case "bch": {

        info.balance=1.000000000;
        info.minBet=0;

        break;
        
      }

      case "xrp": {

        info.balance=1.000000000;
        info.minBet=0;

        break;

      }

      case "trx": {

        info.balance=1.000000000;
        info.minBet=0;

        break;

      }

      case "eos": {

        info.balance=1.000000000;
        info.minBet=0;

        break;

      }

      case "bnb": {

        info.balance=1.000000000;
        info.minBet=0;

        break;

      }

      case "usdt": {

        info.balance=1.000000000;
        info.minBet=0;

        break;

      }

      default: {
        info.balance=1.000000000;
      }
    }
    if (balance) {
      info.balance = parseFloat(balance);
      info.balance = info.balance.toFixed(8);
      info.highestBalance = info.balance;
      info.lowestBalance = info.balance;
    }

    info.success = "true";
    return info;
  }

  async bet(i) {
    let data = i.data;
    let currentBet = data.currentBet.toFixed(8);
    let condition = data.high === true ? "over" : "under";
    let houseEdge = data.houseEdge;
    let nonce = data.nonce;
    let serverSeed = data.serverSeed;
    let clientSeed = data.clientSeed;
    let target = 0;
    data.addDataPoint = false;
    // console.log("currentStreak: " + data.currentStreak);
    // console.log("CurrentBet: " + currentBet);
    // console.log("Win Chance: " + data.currentChance);

    if (data.high) {
      target = 999999 - Math.floor(data.currentChance * 10000) + 1;
    } else {
      target = Math.floor(data.currentChance * 10000) - 1;
    }
    target = parseFloat(target/10000).toFixed(2);
    let betInfo = await this._simulateBet(currentBet, target, condition, houseEdge, serverSeed, clientSeed, nonce);
    betInfo.condition = data.high ? ">" : "<";
    betInfo.target = target;
    data.result = betInfo.diceRoll;
    data.balance = parseFloat((parseFloat(data.balance) + parseFloat(betInfo.profit)).toFixed(8));
    data.bets++;
    data.profit = (parseFloat(data.profit) + parseFloat(betInfo.profit)).toFixed(8);
    data.wagered = (parseFloat(data.wagered) + parseFloat(currentBet)).toFixed(8);
    if (data.currentBet > data.highestBet) {
      data.highestBet = data.currentBet;
    }
    if (betInfo.win) {
      data.wins++;
      data.currentBetWin = true;
      if (data.currentStreak < 0) {
        data.currentStreak = 1;
      } else {
        data.currentStreak++;
      }
      if (data.currentStreak > data.maxWinStreak) {
        data.maxWinStreak = data.currentStreak;
      }
      if (betInfo.profit > data.highestSingleWin) {
        data.highestSingleWin = betInfo.profit
      }
      if (data.balance > data.highestBalance) {
        data.highestBalance = parseFloat(data.balance);
      }
    } else {
      data.losses++;
      data.currentBetWin = false;
      if (data.currentStreak > 0) {
        data.currentStreak = -1;
      } else {
        data.currentStreak--;
      }
      if (Math.abs(data.currentStreak) > data.maxLoosingStreak) {
        data.maxLoosingStreak = Math.abs(data.currentStreak);
        // console.log("Nonce: " + nonce);
        // console.log(`CurrentStreak: ${data.currentStreak}, Target: ${target}, current Balance: ${data.balance}`);
        // console.log("Bet: " + currentBet);
      }
      if (Math.abs(betInfo.profit) > data.highestLost) {
        data.highestLost = Math.abs(betInfo.profit);
      }
      if (data.balance < data.lowestBalance) {
        data.lowestBalance = parseFloat(data.balance);
      }
    }

    let returnInfo = {};
    returnInfo.betInfo = betInfo;
    returnInfo.info = data;
    return returnInfo;
  }

  async _simulateBet(currentBet, target, condition, houseEdge, serverseed, clientseed, nonce) {
    let betInfo = {};
    betInfo.id = "Simulator_" + Math.random().toString(10).substring(2).substr(0, 10);
    betInfo.currentBet = parseFloat(currentBet);
    let serverSeed = serverseed || Math.random().toString(36).substring(2);
    let clientSeed = clientseed || Math.random().toString(36).substring(2);
    let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, serverSeed);
    hmac.update(`${clientSeed}:${nonce}:0`);
    let buffer = Buffer.from(hmac.finalize().toString(), 'hex');
    let bytes = [];
    for (let i = 0; i < 5; i++) {
        const el = buffer[i];
        bytes.push(el);
    }
    let floats = [];
    floats.push(bytes[0] / 256);
    floats.push(bytes[1] / (256 ** 2));
    floats.push(bytes[2] / (256 ** 3));
    floats.push(bytes[3] / (256 ** 4));

    let float = (floats.reduce((a, b) => a + b, 0));
    let result =  float * 10001 / 100;
    let diceRoll = Math.floor(result * 100) / 100;

    let factor = condition == "over" ? 100 / (100 - target) : 100 / target;
    let houseEdgeMultiplier = 1 - (houseEdge / 100);
    let multiplier = parseFloat(factor * houseEdgeMultiplier).toFixed(2);

    // let factor = condition == "over" ? 100 /(100 - target) : 100 / target;
    // factor = parseFloat(factor - (factor * ((houseEdge === 0 ? 1 : houseEdge)/100))).toFixed(2);
    // let profit = (currentBet * factor) - currentBet;
    
    let profit = (currentBet * multiplier) - currentBet;
    betInfo.serverSeed = serverSeed;
    betInfo.clientSeed = clientSeed;
    betInfo.diceRoll = diceRoll;
    betInfo.win = false;
    // console.log(nonce);
    // console.log(condition);
    // console.log("Target: " + target);
    // console.log("Diceroll: " + diceRoll);
    // console.log("bet amount: " + currentBet);
    // console.log(multiplier + "x");
    // console.log("Profit: " + profit);
    if (condition == "over") {
      if (diceRoll > target) {
        betInfo.win = true;
      }
    } else {
      if (diceRoll < target) {
        betInfo.win = true;
      }
    }
    if (betInfo.win) {
      betInfo.payout = parseFloat((betInfo.currentBet + profit)).toFixed(8);
      betInfo.profit = parseFloat(profit).toFixed(8);
    } else {
      betInfo.payout = 0;
      betInfo.profit = parseFloat(-betInfo.currentBet).toFixed(8);
    }
    return betInfo;
  }
}