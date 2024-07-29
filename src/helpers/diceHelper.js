import { randomString, genRanHex, wordSeparator, modifyByPercentage, calcWinChance, calcBet, calcPayoutByPercentage } from "@/helpers/helpers";

/**
 * @param b: Number - Bet amount
 * @param ch: Number - Probability of winning
 * @param {Number} b Bet amount
 * @param {Number} ch Probability of winning
 * @param {Number} bal Initial balance
 * @param {Number} sn Starting Nonce
 * @param {Number} en Ending Nonce
 * @return {Boolean} True if parameters correct, false otherwise
 */
export function checkParams(b, ch, bal, sn, en) {
  if(typeof b !== "number" || b !== b || b < 0 || b > 1000000000*1000000000) {
      return false;
  }
  if(typeof ch !== "number" || ch !== ch || ch > 99 || ch < 0.0001) {
      return false;
  }
  if (typeof bal !== "number" || bal !== bal || bal <= 0) {
    return false;
  }
  if (typeof sn !== "number" || sn !== sn || sn < 0) {
    return false;
  }
  if (typeof en !== "number" || en !== en || en < 1) {
    return false;
  }
  if (en < sn) {
    return false;
  }
  return true;
}

 /**
   * Update the bet based on conditions
   * @param {Object} i Object with all the information of bets
   * @param {Array} c Array of Conditions
   * @return {Object} Updated Information Object with new bet parameters
   */
export function updateBet(i, c) {
  //console.log(i);
  //console.log(c);
  c.forEach(condition => {
    condition.betOnConditionOneValue = parseFloat(condition.betOnConditionOneValue);
    condition.betDoConditionThreeValue = parseFloat(condition.betDoConditionThreeValue);
    condition.profitOnConditionFiveValue = parseFloat(condition.profitOnConditionFiveValue);
    if (condition.displayBetOrProfit) {
      // Bet path
      switch (condition.betOnConditionOne) {
        case "every":
          switch (condition.betOnConditionTwo) {
            case "wins":
              if (i.currentBetWin) {
                if (i.wins % condition.betOnConditionOneValue === 0) {
                  doCondition(i, condition);
                }
              }
              break;
            case "losses":
              if (!i.currentBetWin) {
                if (i.losses % condition.betOnConditionOneValue === 0) {
                  doCondition(i, condition);
                }
              }
              break;
            case "bets":
              if (i.bets % condition.betOnConditionOneValue === 0) {
                doCondition(i, condition);
              }
              break;
          }
          break;
        case "everyStreakOf":
          switch (condition.betOnConditionTwo) {
            case "wins":
              if (i.currentStreak > 0) {
                if (i.currentStreak % condition.betOnConditionOneValue === 0) {
                  doCondition(i, condition);
                }
              }
              break;
            case "losses":
              if (i.currentStreak < 0) {
                if (i.currentStreak % condition.betOnConditionOneValue === 0) {
                  doCondition(i, condition);
                }
              }
              break;
            case "bets":
              if (i.currentStreak % condition.betOnConditionOneValue === 0) {
                doCondition(i, condition);
              }
              break;
          }
          break;
        case "firstStreakOf":
          switch (condition.betOnConditionTwo) {
            case "wins":
              if (i.currentStreak > 0) {
                if (i.currentStreak === condition.betOnConditionOneValue) {
                  console.log("First streak of X wins...");
                  doCondition(i, condition);
                }
              }
              break;
            case "losses":
              if (i.currentStreak < 0) {
                if (Math.abs(i.currentStreak) === condition.betOnConditionOneValue) {
                  doCondition(i, condition);
                }
              }
              break;
            case "bets":
              if (i.currentStreak === condition.betOnConditionOneValue) {
                doCondition(i, condition);
              }
              break;
          }
          break;
        case "streakGreaterThan":
          switch (condition.betOnConditionTwo) {
            case "wins":
              if (i.currentStreak > 0) {
                if (i.currentStreak > condition.betOnConditionOneValue) {
                  doCondition(i, condition);
                }
              }
              break;
            case "losses":
              if (i.currentStreak < 0) {
                if (Math.abs(i.currentStreak) > condition.betOnConditionOneValue) {
                  doCondition(i, condition);
                }
              }
              break;
            case "bets":
              if (Math.abs(i.currentStreak) > condition.betOnConditionOneValue) {
                doCondition(i, condition);
              }
              break;
          }
          break;
        case "streakLowerThan":
          switch (condition.betOnConditionTwo) {
            case "wins":
              if (i.currentStreak > 0) {
                if (i.currentStreak < condition.betOnConditionOneValue) {
                  doCondition(i, condition);
                }
              }
              break;
            case "losses":
              if (i.currentStreak < 0) {
                if (Math.abs(i.currentStreak) < condition.betOnConditionOneValue) {
                  doCondition(i, condition);
                }
              }
              break;
            case "bets":
              if (Math.abs(i.currentStreak) < condition.betOnConditionOneValue) {
                doCondition(i, condition);
              }
              break;
          }
          break;
        case "resultBiggerThan":
          if ( i.result > condition.betOnConditionOneValue) {
            doCondition(i, condition);
          }
          break;
        case "resultBiggerThanOrEqualTo":
          if ( i.result >= condition.betOnConditionOneValue) {
            doCondition(i, condition);
          }
          break;
        case "resultSmallerThan":
          if ( i.result < condition.betOnConditionOneValue) {
            doCondition(i, condition);
          }
          break;
        case "resultSmallerThanOrEqualTo":
          if ( i.result <= condition.betOnConditionOneValue) {
            doCondition(i, condition);
          }
          break;
        case "resultEqualTo":
          if ( i.result === condition.betOnConditionOneValue) {
            doCondition(i, condition);
          }
          break;
      }
    } else {
      // Profit path
      switch(condition.profitOnConditionFour) {
        case "balance":
          switch(condition.profitOnConditionFive) {
            case "greaterThan":
              if (i.balance > condition.profitOnConditionFiveValue) {
                doCondition(i, condition);
              }
              break;
            case "greaterThanOrEqualTo":
              if (i.balance >= condition.profitOnConditionFiveValue) {
                doCondition(i, condition);
              }
              break;
            case "lowerThan":
              if (i.balance < condition.profitOnConditionFiveValue) {
                doCondition(i, condition);
              }
              break;
            case "lowerThanOrEqualTo":
              if (i.balance <= condition.profitOnConditionFiveValue) {
                doCondition(i, condition);
              }
              break;
          }
          break;
        case "loss":
          switch(condition.profitOnConditionFive) {
            case "greaterThan":
              if (i.profit < -Math.abs(condition.profitOnConditionFiveValue)) {
                doCondition(i, condition);
              }
              break;
            case "greaterThanOrEqualTo":
              if (i.profit <= -Math.abs(condition.profitOnConditionFiveValue)) {
                doCondition(i, condition);
              }
              break;
            case "lowerThan":
              if (i.profit > -Math.abs(condition.profitOnConditionFiveValue)) {
                doCondition(i, condition);
              }
              break;
            case "lowerThanOrEqualTo":
              if (i.profit >= -Math.abs(condition.profitOnConditionFiveValue)) {
                doCondition(i, condition);
              }
              break;
          }
          break;
        case "profit":
          switch(condition.profitOnConditionFive) {
            case "greaterThan":
              if (i.profit > condition.profitOnConditionFiveValue) {
                doCondition(i, condition);
              }
              break;
            case "greaterThanOrEqualTo":
              if (i.profit >= condition.profitOnConditionFiveValue) {
                doCondition(i, condition);
              }
              break;
            case "lowerThan":
              if (i.profit < condition.profitOnConditionFiveValue) {
                doCondition(i, condition);
              }
              break;
            case "lowerThanOrEqualTo":
              if (i.profit <= condition.profitOnConditionFiveValue) {
                doCondition(i, condition);
              }
              break;
          }
          break;
      }
    }
    return i;
  })
}

 /**
   * Perform condition operations and update information on Bets
   * @param {Object} i Object with all the information of bets
   * @param {Array} c Current conditions
   * @return {Object} Updated Information Object with new bet parameters
   */
  export function doCondition(i, c) {
    switch (c.betDoConditionThree) {
      case "increaseBetAmount":
        i.currentBet = modifyByPercentage(true, i.currentBet, c.betDoConditionThreeValue);
        break;
      case "decreaseBetAmount":
        i.currentBet = modifyByPercentage(false, i.currentBet, c.betDoConditionThreeValue);
        i.currentBet = i.currentBet < i.minBet ? i.minBet : i.currentBet;
        break;
      case "increaseWinChance":
        i.currentChance = modifyByPercentage(true, i.currentChance, c.betDoConditionThreeValue);
        i.currentChance = i.currentChance > (99-i.houseEdge) ? (99-i.houseEdge) : i.currentChance;
        break;
      case "decreaseWinChance":
        i.currentChance = modifyByPercentage(false, i.currentChance, c.betDoConditionThreeValue);
        i.currentChance = i.currentChance < 0.01 ? 0.01 : i.currentChance;
        break;
      case "addToBetAmount":
        i.currentBet += c.betDoConditionThreeValue;
        break;
      case "subtractFromBetAmount":
        i.currentBet -= c.betDoConditionThreeValue;
        i.currentBet = i.currentBet < i.minBet ? i.minBet : i.currentBet;
        break;
      case "addToWinChance":
        i.currentChance += c.betDoConditionThreeValue;
        i.currentChance = i.currentChance > (99-i.houseEdge) ? (99-i.houseEdge) : i.currentChance;
        break;
      case "subtractFromWinChance":
        i.currentChance -= c.betDoConditionThreeValue;
        i.currentChance = i.currentChance < 0.01 ? 0.01 : i.currentChance;
        break;
      case "addToPayout":
        let pout = calcPayoutByPercentage(i.currentChance, i.houseEdge) + c.betDoConditionThreeValue;
        i.currentChance = parseFloat(calcWinChance(pout, i.houseEdge)).toFixed(6);
        i.currentChance = i.currentChance < 0.01 ? 0.01 : i.currentChance;
        break;
      case "subtractFromPayout":
        let pout2 = calcPayoutByPercentage(i.currentChance, i.houseEdge) - c.betDoConditionThreeValue;
        i.currentChance = parseFloat(calcWinChance(pout2, i.houseEdge)).toFixed(4);
        i.currentChance = i.currentChance > (99-i.houseEdge) ? (99-i.houseEdge) : i.currentChance;
        break;
      case "setBetAmount":
        i.currentBet = c.betDoConditionThreeValue;
        i.currentBet = i.currentBet < i.minBet ? i.minBet : i.currentBet;
        break;
      case "setWinChance":
        i.currentChance = c.betDoConditionThreeValue;
        i.currentChance = i.currentChance > (99-i.houseEdge) ? (99-i.houseEdge) : i.currentChance < 0.01 ? 0.01 : i.currentChance;
        break;
      case "switchOverUnder":
        i.high = !i.high;
        break;
      case "resetBetAmount":
        console.log("ResetBetAmount...");
        i.currentBet = i.baseBet;
        break;
      case "resetWinChance":
        i.currentChance = i.baseChance;
        break;
      case "stopAutobet":
        i.exit = true;
        let text = c.displayBetOrProfit ? `${wordSeparator(c.betOnConditionOne).toLowerCase()} ${c.betOnConditionOneValue} ${c.betOnConditionOne.includes("result") ? "%" : c.betOnConditionTwo.toLowerCase()} ${c.betDoConditionThree.toLowerCase()}` : `${c.profitOnConditionFour} ${wordSeparator(c.profitOnConditionFive).toLowerCase()} ${c.profitOnConditionFiveValue} ${wordSeparator(c.betDoConditionThree).toLowerCase()}`;
        i.reportMessage = `Stopped by condition: ${text}`;
        break;
      case "resetSeed":
        console.log("Resetting seed");
        i.serverSeed = genRanHex(64);
        i.clientSeed = randomString(30);
        i.nonce = 0;
        break;
      case "minimumIncrease":
        i.currentBet = calcBet(i.currentChance, i.currentBet);
        break;
      case 'setBalance':
        i.balance = c.betDoConditionThreeValue;
        break;
    }
    return i;
  }