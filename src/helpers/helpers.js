/**
 * Calculate the minimum increase on bet necesary to remain in profit for a given win chance
 * @param {Number} chance Target win chance (%)
 * @param {Number} previousbet The bet amount from the previous round
 * @return {Number} Calculated New bet amount
 */
 export function calcBet(chance, previousbet) {
  let pout   = 100 / (chance);
  pout   = pout - (pout * (1/100));
  let minInc = ((((pout / (1 * (pout - 1))) * 100) - 100) * 100 + 1) / 100;
  let multi  = 1 + (minInc / 100);
  let result = previousbet * multi;
  return result;
}

/**
 * Calculate the minimum increase on bet necesary to remain in profit for a given win chance
 * @param {Number} baseTarget Initial target payout (x)
 * @param {Number} currentTarget Current target payout (x)
 * @param {Number} initialBetSize Initial bet size
 * @param {Number} currentProfit Current profit
 * @param {Number} maxWinAmount Highest profit
 * @return {Number} New calculated bet amount
 */
export function calcBetWithMinimumIncrease(baseTarget, currentTarget, baseBet, currentProfit, maxWinAmount) {
  let toRecover = (maxWinAmount - currentProfit) + baseBet * baseTarget;
  let bet =  toRecover / (currentTarget-1);
  return bet;
}

/**
 * @param length: Number - Length of the random string to be generated
 */
export function randomString(length) {
  const availableChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = '';
  for(let i = 0; i < length; i++) {
    randomString += availableChars[Math.floor(Math.random() * availableChars.length)];
  }
  return randomString;
}

/**
 * @param size: Number - Size of the random hex number to be generated
 */
export function genRanHex(size) {
  return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

/**
 * @param min: Number - Minimum number included in range
 * @param max: Number - Maximum number included in range
 */
export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @param m: Number - Target multiplier for the bet
 * @param bet: Number - Current Bet
 */
export function calcBetByMulti(m, bet) {
  let nextbet = bet + bet * m;
  return nextbet;
}

/**
 * @param string: String - String to be separated with spaces before each Capital letter
 */
export function wordSeparator(string) {
  return string.replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Calculate the win chance based on target payout
 * @param {Number} target Target payout
 * @param {Number} houseEdge The casino house edge
 * @return {Number} Calculated win chance based on target and house edge
 */
 export function calcWinChance(target, houseEdge) {
  let factor = 100 / target;
  factor = factor - (factor * (houseEdge/100));
  return factor;
}

/**
 * Calculate the payout with given percentage win chance
 * @param {Number} p Percentage to calculate payout
 * @param {Number} e House edge
 * @return {Number} Calculated payout
 */
 export function calcPayoutByPercentage(p, e) {
  let pout = 100/p;
  pout = pout-(pout*(e/100));
  return pout;
}

/**
 * @param item: String - Item to retrieve from localStorage
 */
export function grabFromLocalStorage(item) {
  if (typeof item === 'string' && localStorage) {
    const e = JSON.parse(localStorage.getItem(item));
    if (e) {
      return e;
    }
  }
  return;
}

/**
 * @param chartTheme: Object - Theme Object to be updated in localStorage
 * @param themeObject: Object - New values added to chartTheme
 * @param themeString: String - the Light/dark theme
 */
export function setThemeValues(chartTheme, themeObject, themeString) {
  if (themeString === "light") {
    chartTheme.light = {
      "legendColor": themeObject.legendColor,
      "legendFontSize": themeObject.legendFontSize,
      "axisColor": themeObject.axisColor,
      "backgroundColor": themeObject.backgroundColor,
      "betAmountColor": themeObject.betAmountColor,
      "legendBalanceColor": themeObject.legendBalanceColor
    }
  } else {
    chartTheme.dark = {
      "legendColor": themeObject.legendColor,
      "legendFontSize": themeObject.legendFontSize,
      "axisColor": themeObject.axisColor,
      "backgroundColor": themeObject.backgroundColor,
      "betAmountColor": themeObject.betAmountColor,
      "legendBalanceColor": themeObject.legendBalanceColor
    }
  }
}

export function createDefaultChartTheme() {
  return {
    "light": {
      "legendColor": "#FFFFFF",
      "legendFontSize": 16,
      "axisColor": "#FFFFFF",
      "backgroundColor": "#0250C6",
      "betAmountColor": "#00FFFF",
      "legendBalanceColor": "#FE5252"
    },
    "dark": {
      "legendColor": "#000000",
      "legendFontSize": 16,
      "axisColor": "#000000",
      "backgroundColor": "#59FFAC",
      "betAmountColor": "#8C0000",
      "legendBalanceColor": "#0000FF"
    }
  }
}


/**
 * Convert value from one range to another
 * @param {Number} value value to convert
 * @param {Object} oldRange min, max of values range
 * @param {Object} newRange min, max of desired range
 * @return {Number} value converted to other range
 */
export function convertRange(value, oldRange, newRange) {
    return ((value - oldRange.min) * (newRange.max - newRange.min)) / (oldRange.max - oldRange.min) + newRange.min;
  }

/**
 * Check if Object is empty
 * @param {Object} someObject An object to check
 * @return {Boolean} True if Object is empty, false otherwise
 */
export function isObjectEmpty(someObject) {
  return !(Object.keys(someObject).length)
}

/**
 * Round a number to given decimal places
 * @param {Number} oldAmount Number to be rounded
 * @param {Number} decimal Amount of decimal places
 * @param {String} direction Mathematical operation to produce
 * @return {Number} Resulting number from the operation
 */
export function round(oldAmount, decimal, direction = 'round') {
  if (!oldAmount && oldAmount !== 0) return oldAmount;
  let amount = parseFloat(oldAmount);
  decimal = Math.pow(10, decimal);
  let result = Math[direction](amount * decimal) / decimal;
  return (result === 0) ? 0 : result;
};

/**
 * Find the median in a given array of numbers
 * @param {Array} array Array of numbers
 * @return {Number} Median from the given array
 */
export function calcMedian(array) {
  let median = 0;
  let arr = [...array];
  arr.sort((a,b)=>a-b);
  if (arr.length > 1) {
      if (arr.length % 2 != 0) {
          median = arr[Math.floor(arr.length / 2)]
      } else {
          median = (arr[Math.floor(arr.length / 2) + 1] + arr[Math.floor(arr.length / 2)]) / 2
      }
  }
  return median
}

/**
 * Find the mean in a given array of numbers
 * @param {Array} array Array of numbers
 * @return {Number} Mean from the given array
 */
export function calcMean(array) {
  let mean = 0;
  if (array.length > 1) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    mean = sum / array.length;
  }
  return mean;
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

/**
 * Calculates the Median value from an Array of numbers
 * @param {Array} data Array of numbers
 * @return {Number} Median value
 */
export function median(data) {
  return quartile50(data);
}

/**
 * Calculates the Q1 value of a given SORTED array of numbers
 * @param {Array} data Sorted array of numbers
 * @return {Number} Q1 value
 */
export function quartile25(data) {
  return quartile(data, 0.25);
}

/**
 * Calculates the Q2 value of a given SORTED array of numbers
 * @param {Array} data Sorted array of numbers
 * @return {Number} Q2 value
 */
export function quartile50(data) {
  return quartile(data, 0.5);
}

/**
 * Calculates the Q3 value of a given SORTED array of numbers
 * @param {Array} data Sorted array of numbers
 * @return {Number} Q3 value
 */
export function quartile75(data) {
  return quartile(data, 0.75);
}

/**
 * Calculates the Quartile value of a given SORTED array of numbers
 * @param {Array} data Sorted array of numbers
 * @param {Number}  q Quarterly value to be calculated
 * @return {Number} Quarterly value
 */
export function quartile(data, q) {
  data=arraySortNumbers(data);
  var pos = ((data.length) - 1) * q;
  var base = Math.floor(pos);
  var rest = pos - base;
  if( (data[base+1]!==undefined) ) {
    return data[base] + rest * (data[base+1] - data[base]);
  } else {
    return data[base];
  }
}

/**
 * Sorts an Array of numbers from smallest to biggest
 * @param {Array} inputarray Array of numbers
 * @return {Array} Sorted array of numbers
 */
export function arraySortNumbers(inputarray) {
  return inputarray.sort(function(a, b) {
    return a - b;
  });
}

/**
 * Downloads an array of data into JSON format
 * @param {Array} targetData Array of data
 */
export function exportToJSON(targetData) {
  if (!targetData.results || targetData.results.length === 0) {
    alert("Target Data is empty, please generate the data first!");
    return;
  }
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(targetData));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "data.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

/**
 * Downloads an array of data into JSON format
 * @param {Array} targetData Array of data
 */
export function exportRawToJSON(rawData) {
  if (!rawData.results || rawData.results.length === 0) {
    alert("Raw Data is empty, please generate the data first!");
    return;
  }
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(rawData));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "data.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}


/**
 * Downloads an array of data into CSV format
 * @param {Array} targetData Array of data
 */
export function exportToCSV(targetData) {
  if (!targetData.results || targetData.results.length === 0) {
    alert("Target Data is empty, please generate the data first!");
    return;
  }
  const dataArray = targetData.results.map((result, index) => ({
    nonce: targetData.nonce[index],
    result,
    distanceFromPrevious: targetData.distanceFromPrevious[index],
    client: targetData.seed[index].client,
    server: targetData.seed[index].server,
  }));

  const headers = Object.keys(dataArray[0]).join(",");
  const csv = dataArray.map((row) => Object.values(row).join(",")).join("\n");
  const csvData = `${headers}\n${csv}`;

  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "data.csv");
  a.click();
}

/**
 * Downloads an array of raw data into CSV format
 * @param {Array} rawData Array of data
 */
export function exportRawToCSV(rawData) {
  if (!rawData.results || rawData.results.length === 0) {
    alert("Raw Data is empty, please generate the data first!");
    return;
  }
  const dataArray = rawData.results.map((result, index) => ({
    nonce: rawData.nonce[index],
    result
  }));

  const headers = Object.keys(dataArray[0]).join(",");
  const csv = dataArray.map((row) => Object.values(row).join(",")).join("\n");
  const csvData = `${headers}\n${csv}`;

  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "data.csv");
  a.click();
}

/**
 * Downloads an array of data into JSON format
 * @param {Array} targetData Array of data
 */
export function exportToJSONStrategy(targetData) {
  if (!targetData || targetData.length === 0) {
    alert("Data object is empty, please generate the data first!");
    return;
  }
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(targetData));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "data.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

/**
 * Downloads an array of data into CSV format
 * @param {Array} targetData Array of data
 */
export function exportToCSVStrategy(targetData) {
  if (!targetData || targetData.length === 0) {
    alert("Data object is empty, please generate the data first!");
    return;
  }

  const headers = Object.keys(targetData[0]).join(",");
  const csv = targetData.map((row) => Object.values(row).join(",")).join("\n");
  const csvData = `${headers}\n${csv}`;

  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "data.csv");
  a.click();
}

/**
 * Combines two Arrays into one new Array of Object with the elements of both arrays in order.
 * @param {Array} arr1 Array of balance
 * @param {Array} arr2 Array of bet amount
 * @param {Number} startingNonce The nonce at which it started
 * @return {Array} Array of objects with each object representing one nonce.
 */
export function combineArrays(arr1, arr2, startingNonce) {
  if (arr1.length !== arr2.length) {
    throw new Error("Arrays must be of the same length");
  }

  const result = [];

  for (let i = 0; i < arr1.length; i++) {
    const obj = {
      balance: Number(arr1[i]),
      betAmount: Number(arr2[i]),
      nonce: startingNonce + i,
    };
    result.push(obj);
  }

  return result;
}
  