import { randomString, genRanHex, wordSeparator, calcBetWithMinimumIncrease } from "@/helpers/helpers";

/**
 * @param b: Number - Bet amount
 * @param ch: Number - Probability of winning
 */
 export function checkParams(b,ch) {
  // console.log(b,ch);
  if(b < 0 || b > 1000000000*1000000000) {
      return false
  }
  if(ch > 1000000 || ch < 1.01) {
      return false
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
    // console.log(i);
    // console.log(c);
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
        case "increasePayout":
          i.currentTarget = modifyByPercentage(true, i.currentTarget, c.betDoConditionThreeValue);
          i.currentTarget = i.currentTarget > 1000000 ? 1000000 : i.currentTarget;
          break;
        case "decreasePayout":
          i.currentTarget = modifyByPercentage(false, i.currentTarget, c.betDoConditionThreeValue);
          i.currentTarget = i.currentTarget < 1.01 ? 1.01 : i.currentTarget;
          break;
        case "addToBetAmount":
          i.currentBet += c.betDoConditionThreeValue;
          break;
        case "subtractFromBetAmount":
          i.currentBet -= c.betDoConditionThreeValue;
          i.currentBet = i.currentBet < i.minBet ? i.minBet : i.currentBet;
          break;
        case "addToPayout":
          i.currentTarget += c.betDoConditionThreeValue;
          i.currentTarget = i.currentTarget > 1000000 ? 1000000 : i.currentTarget;
          break;
        case "subtractFromPayout":
          i.currentTarget -= c.betDoConditionThreeValue;
          i.currentTarget = i.currentTarget < 1.01 ? 1.01 : i.currentTarget;
          break;
        case "setBetAmount":
          i.currentBet = c.betDoConditionThreeValue;
          i.currentBet = i.currentBet < i.minBet ? i.minBet : i.currentBet;
          break;
        case "setPayout":
          i.currentTarget = c.betDoConditionThreeValue;
          i.currentTarget = i.currentTarget > 1000000 ? 1000000 : i.currentTarget < 1.01 ? 1.01 : i.currentTarget;
          break;
        case "switchOverUnder":
          i.high = !i.high;
          break;
        case "resetBetAmount":
          i.currentBet = i.baseBet;
          break;
        case "resetPayout":
          i.currentTarget = i.baseTarget;
          break;
        case "stopAutobet":
          i.exit = true;
          let text = c.displayBetOrProfit ? `${wordSeparator(c.betOnConditionOne).toLowerCase()} ${c.betOnConditionOneValue} ${c.betOnConditionOne.includes("result") ? "x" : c.betOnConditionTwo.toLowerCase()} ${c.betDoConditionThree.toLowerCase()}` : `${c.profitOnConditionFour} ${wordSeparator(c.profitOnConditionFive).toLowerCase()} ${c.profitOnConditionFiveValue} ${wordSeparator(c.betDoConditionThree).toLowerCase()}`;
          i.reportMessage = `Stopped by condition: ${text}`;
          break;
        case "resetSeed":
          console.log("Resetting seed");
          i.serverSeed = genRanHex(64);
          i.clientSeed = randomString(30);
          i.nonce = 0;
          break;
        case "minimumIncrease":
          i.currentBet = calcBetWithMinimumIncrease(i.baseTarget, i.currentTarget, i.baseBet, i.profit, i.maxWinAmount);
          break;
        case 'setBalance':
          i.balance = c.betDoConditionThreeValue;
          break;
      }
      return i;
    }

    /**
 * Increases or decreases a value by a percentage of that value.
 * @param {Boolean} b If true, increase value. Other wise decrease.
 * @param {Number} n The number to increase/decrease.
 * @param {Number} p Percentage increase/decrease.
 * @return {Number} Modified Value
 */
export function modifyByPercentage(b, n, p) {
  return b ? n += n * (p / 100) : n -= n * (p / 100);
}