/**
 * Get the last value of an array
 * @param {Array} arr Array of numbers
 * @return {Array} Last value of the array
 */
export function getLastValueArray(arr) {
    return arr[arr.length-1];
}

/**
 * Add zero padded values when an array skips nonces
 * @param {Array} arr Array of numbers
 * @return {Array} Updated array with zero padded values
 */
export function addZeroPaddedValues(arr) {
    const result = [];
  
    for (let i = 0; i < arr.length; i++) {
      result.push(arr[i]);
  
      if (i < arr.length - 1) {
        const diff = arr[i + 1] - arr[i] - 1;
  
        for (let j = 0; j < diff; j++) {
          result.push(0);
        }
      }
    }
  
    return result;
}

/**
 * Add zero padded values to the results array based on the updated and zero padded nonces array
 * @param {Array} arr Array of numbers
 * @param {Array} zeroPaddedArray Array of numbers with zero padded values
 * @return {Array} Updated array with zero padded values
 */
export function updateArraysWithZeroPaddedValues(arr, zeroPaddedArray) {
    let result = [];
    for (let i = 0; i < zeroPaddedArray.length; i++) {
      if (zeroPaddedArray[i] === 0) {
        result.push(0);
      } else {
        result.push(arr.shift());
      }
    }
    return result;
}

/**
 * Update a variable with a new number value
 * @param {Number} variable Variable to change number value
 * @param {Number} value New desired value
 */
export function updateNumber(variable, value) {
    variable.value = Number(value);
}

/**
 * Push a new value into an array, capped at maxSize
 * @param {Array} array The array to be updated
 * @param {Number} value The new number to be added to the array
 * @param {Number} maxSize The maximum size of the array, defaults to Inifinity
 */
export function updateArray(array, value, maxSize = Infinity) {
    array.value.push(value);
    if (array.value.length > maxSize) {
        array.value.shift();
    }
}

/**
 * Update the liveSignal with a new value
 * @param {Boolean} variable The variable to update
 * @param {Boolean} value The new boolean value
 */
export function updateBooleanVariable(variable, value) {
    variable.value = value;
}

/**
 * Gradually update the lastResult variable over a short period of time
 * using aniimationFrames.
 * @param {Number} variable the display variable to change over time
 * @param {Number} startValue The starting value
 * @param {Number} endValue The desired ending value
 */
export function updateDisplayLastResult(variable, startValue, endValue, increment = 10) {
    const duration = 500; // animation duration in ms
    const frames = duration / increment;
    const direction = startValue < endValue ? 1 : -1;
    const diff = Math.abs(endValue - startValue);
    const step = direction * (diff / frames);

    let current = startValue;
    let count = 0;

    const update = () => {
        current += step;
        count++;

        const diffDirection = direction * (current - endValue);
        if (count < frames && diffDirection <= 0) {
            variable.value = Math.round(current * 100) / 100;
            requestAnimationFrame(update);
        } else {
            variable.value = Math.round(endValue * 100) / 100;
        }
    };

    requestAnimationFrame(update);
}

/**
 * Calculate and return the mean value of a given array
 * @param {Array} arr The array used to calculate the mean
 * @return {Number} Mean value
 */
export function getMean(arr) {
    if (arr.length === 0) {
        return 0;
    }
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    return total / arr.length;
};

/**
 * Calculate and return the distance from the previous element in array with the same value
 * @param {Number} value The desired value to calculate the distance
 * @param {Array} array The array used to calculate the distance
 * @return {Number} Distance from last time the value appeared
 */
export function getDistance(value, array) {
    let arr = [...array].reverse();
    let distance = 0;
    let found = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] >= value) {
        distance = i;
        found = true;
        break;
        }
    }
    if (!found) {
        distance = 0;
    }
    return distance;
}

/**
 * Calculate and return the distance from the previous element in array with the same value
 * @param {Number} value The desired value to calculate the distance
 * @param {Array} array The array used to calculate the distance
 * @return {Number} Distance from last time the value appeared
 */
export function getDistanceWheel(value, array) {
    let arr = [...array].reverse();
    let distance = 0;
    let found = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].result >= value) {
        distance = i;
        found = true;
        break;
        }
    }
    if (!found) {
        distance = 0;
    }
    return distance;
}

/**
 * Calculate and return the mean appearance rate of a value in a given array
 * @param {Number} value The desired value to calculate the mean appearance rate
 * @param {Array} array The array used to calculate the mean appearance rate
 * @return {Number} The calculated mean appearance rate of the chosen value in the array
 */
export function getMeanAppearanceRate(value, array) {
    if (array.length === 0) {
        return 0;
    }

    let steps = 0;
    let sum = 0;
    let count = 0;
    array.forEach((elem, i) => {
        steps +=1;
        if (elem >= value) {
            sum += steps;
            count += 1;
            steps = 0;
        }
    });

    if (count === 0) {
        return 0;
    }

    return sum / count;
}
/**
 * Calculate and return the mean appearance rate of a value in a given array for Wheel
 * @param {Number} value The desired value to calculate the mean appearance rate
 * @param {Array} array The array used to calculate the mean appearance rate
 * @return {Number} The calculated mean appearance rate of the chosen value in the array
 */
export function getMeanAppearanceRateWheel(value, array) {
    if (array.length === 0) {
        return 0;
    }

    let steps = 0;
    let sum = 0;
    let count = 0;
    array.forEach((elem, i) => {
        steps +=1;
        if (elem.result === value) {
            sum += steps;
            count += 1;
            steps = 0;
        }
    });

    if (count === 0) {
        return 0;
    }

    return sum / count;
}

/**
 * Calculate and return the appearance rate of a value in a given array
 * @param {Number} value The desired value to calculate the appearance rate
 * @param {Array} array The array used to calculate the appearance rate
 * @return {Number} The calculated appearance rate of the chosen value in the array
 */
export function getAppearanceRate(value, array) {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] >= value) {
        count++;
      }
    }
    return count;
};

/**
 * Calculate and return the appearance rate of a value in a given array for Wheel
 * @param {Number} value The desired value to calculate the appearance rate
 * @param {Array} array The array used to calculate the appearance rate
 * @return {Number} The calculated appearance rate of the chosen value in the array
 */
export function getAppearanceRateWheel(value, array) {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i].result === value) {
        count++;
      }
    }
    return count;
};

/**
 * Calculate and return B2BTotal, B2BHighest and B2BFrequency
 * @param {Number} value The desired value to calculate the B2B
 * @param {Array} array The array used to calculate the B2B
 * @return {Object} Returns B2bTotal (Number), B2BHighest (Number) and B2BFrequency (Number)
 */
export function getB2B(chosenB2BFrequency, value, array) {
    let B2BTotal = 0;
    let B2BTotalCounter = 0;
    let B2BHighest = 0;
    let B2BFrequency = [];
    let inarow = false;
    let counter = 0;
    let distance = 0;

    if (array.length === 0) {
        return {};
    }

    array.forEach((elem, i) => {
        distance += 1;
        if (elem >= value) {
            counter += 1;
            if (inarow) {
                // Multiply B2BTotal by the multiplier
                B2BTotalCounter *= value;
            } else {
                // If it is the first, set to value.
                B2BTotalCounter = value;
            }
            if (B2BTotalCounter > B2BTotal) {
                B2BTotal = B2BTotalCounter;
            }
            if (counter > B2BHighest) {
                B2BHighest = counter;
            }
            if (counter === chosenB2BFrequency.value) {
                B2BFrequency.push(distance);
                distance = 0;
            }
            inarow = true;
        } else {
            counter = 0;
            B2BTotalCounter = 0;
            inarow = false;
        }
    });

    return  { B2BTotal, B2BHighest, B2BFrequency };
}

/**
 * Calculate and return B2BTotal, B2BHighest and B2BFrequency for Wheel
 * @param {Number} value The desired value to calculate the B2B
 * @param {Array} array The array used to calculate the B2B
 * @return {Object} Returns B2bTotal (Number), B2BHighest (Number) and B2BFrequency (Number)
 */
export function getB2BWheel(chosenB2BFrequency, value, array) {
    let B2BTotal = 0;
    let B2BTotalCounter = 0;
    let B2BHighest = 0;
    let B2BFrequency = [];
    let inarow = false;
    let counter = 0;
    let distance = 0;

    if (array.length === 0) {
        return {};
    }

    array.forEach((elem, i) => {
        distance += 1;
        if (elem.result === value) {
            counter += 1;
            if (inarow) {
                // Multiply B2BTotal by the multiplier
                B2BTotalCounter *= value;
            } else {
                // If it is the first, set to value.
                B2BTotalCounter = value;
            }
            if (B2BTotalCounter > B2BTotal) {
                B2BTotal = B2BTotalCounter;
            }
            if (counter > B2BHighest) {
                B2BHighest = counter;
            }
            if (counter === chosenB2BFrequency.value) {
                B2BFrequency.push(distance);
                distance = 0;
            }
            inarow = true;
        } else {
            counter = 0;
            B2BTotalCounter = 0;
            inarow = false;
        }
    });

    return  { B2BTotal, B2BHighest, B2BFrequency };
}

/**
 * Add remove everything from an array after a 0 value is encountered
 * @param {Array} arr Array of numbers
 * @return {Array} Updated array of only the latest nonces
 */
export function getValuesBeforeFirstZero(arr)  {
    const firstZeroIndex = arr.indexOf(0);
    if (firstZeroIndex === -1) {
        return [...arr]; // return a copy of the original array if there is no 0
    } else {
        return arr.slice(0, firstZeroIndex);
    }
}

/**
 * Create a new array with only those objects with an unbroken nonce chain.
 * @param {Array} arr Array of numbers
 * @return {Array} Return an array of only the latest nonces.
 */
export function getUnbrokenArray(arr) {
    const resultsArray = [];

    for (let i = 0; i < arr.length; i++) {
        if (i === 0 || arr[i].nonce === arr[i-1].nonce - 1) {
            resultsArray.push({result: arr[i].result, nonce: arr[i].nonce});
        } else {
            break;
        }
    }
    return resultsArray;
}