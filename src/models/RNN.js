"use strict";

import CryptoJS from "crypto-js";
import { Buffer } from "buffer";

const simulateBet = (target, condition, houseEdge, serverseed, clientseed, nonce) => {
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
    let factor = condition == "over" ? 100 /(100 - target) : 100 / target;
    let finalResult = parseFloat(factor - (factor * ((houseEdge === 0 ? 1 : houseEdge)/100))).toFixed(2);
    return finalResult;
}

class RNN {
  constructor(inputSize, hiddenSize, outputSize) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;

    this.Wxh = new Float32Array(inputSize * hiddenSize);
    this.Whh = new Float32Array(hiddenSize * hiddenSize);
    this.Why = new Float32Array(hiddenSize * outputSize);

    this.bh = new Float32Array(hiddenSize);
    this.by = new Float32Array(outputSize);
  }

  forward(x, hprev) {
    let h = new Float32Array(this.hiddenSize);
    let y = new Float32Array(this.outputSize);

    for (let i = 0; i < this.hiddenSize; i++) {
      h[i] = 0;
      for (let j = 0; j < this.inputSize; j++) {
        h[i] += this.Wxh[i + j * this.hiddenSize] * x[j];
      }
      for (let j = 0; j < this.hiddenSize; j++) {
        h[i] += this.Whh[i + j * this.hiddenSize] * hprev[j];
      }
      h[i] = Math.tanh(h[i] + this.bh[i]);
    }

    for (let i = 0; i < this.outputSize; i++) {
      y[i] = 0;
      for (let j = 0; j < this.hiddenSize; j++) {
        y[i] += this.Why[i + j * this.outputSize] * h[j];
      }
      y[i] = Math.tanh(y[i] + this.by[i]);
    }
    return [y, h];
  }

  predict(x, hprev) {
    let [y, h] = this.forward(x, hprev);
    return y;
  }
}

// Create an RNN with input size 1, hidden size 10, and output size 1
let rnn = new RNN(1, 10, 1);

// Generate a sequence of results from the simulateBet function
let sequence = [];
for (let i = 0; i < 100000; i++) {
    sequence.push(simulateBet(50, "over", 1, "serverseed", "clientseed", i));
}

// Use the RNN to predict the next result in the sequence
let hprev = new Float32Array(10).fill(0);
let nextResult = rnn.predict([sequence[sequence.length - 1]], hprev);
console.log(nextResult);
console.log(sequence);
