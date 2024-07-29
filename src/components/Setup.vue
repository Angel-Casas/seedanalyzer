<template>
<div class="tab">
  <div class="setupTab">
    <div class="inputWrap" v-if="game === 'limbo'">
      <label for="chanceInput">Initial Target (x):</label>
      <input
        id="chanceInput"
        :value="baseTarget"
        @focus="$event.target.select()"
        @input="$emit('update:baseTarget', parseFloat($event.target.value))"
        type="text"
        inputmode="decimal"
        min=1.01
        max=1000000
      >
    </div>
    <div class="inputWrap" v-else>
      <label for="chanceInput">Initial Win Chance (%):</label>
      <input
        id="chanceInput"
        type="text"
        inputmode="decimal"
        :value="baseChance"
        @focus="$event.target.select()"
        @input="$emit('update:baseChance', parseFloat($event.target.value))"
        min=0.01
        max=99
      >
    </div>
    <div class="inputWrap">
      <label for="balanceInput">Initial Balance:</label>
      <input
        id="balanceInput"
        :value="initialBalance"
        @focus="$event.target.select()"
        @input="$emit('update:initialBalance', parseFloat($event.target.value))"
        type="number"
        min=0.00000001
        max=1000000000*1000000000
      >
    </div>
    <div class="inputWrap">
      <label for="baseBetInput">Base Bet:</label>
      <input
        id="baseBetInput"
        type="number"
        inputmode="decimal"
        :value="baseBet"
        @focus="$event.target.select()"
        @input="$emit('update:baseBet', parseFloat($event.target.value))"
      >
    </div>
    <div class="inputWrap">
      <label for="currencyInput">Currency:</label>
      <div class="select">
        <select id="currencyInput"
          @input="$emit('update:currency', $event.target.value)"
          :value="currency"
        >
          <option value="btc">BTC</option>
          <option value="eth">ETH</option>
          <option value="ltc">LTC</option>
          <option value="doge">DOGE</option>
          <option value="bch">BCH</option>
          <option value="xrp">XRP</option>
          <option value="trx">TRX</option>
          <option value="eos">EOS</option>
          <option value="bnb">BNB</option>
          <option value="usdt">USDT</option>
        </select>
        <span class="focus"></span>
      </div>
    </div>
    <div class="inputWrap">
      <label for="houseEdgeInput">
        <div class="tooltip">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
          <span class="tooltipText">Change House Edge to 0 if you want to increase the maximum win chance to 99%.</span>
        </div>
        House Edge:
      </label>
      <input
        id="houseEdgeInput"
        :value="houseEdge"
        @focus="$event.target.select()"
        @input="$emit('update:houseEdge', parseFloat($event.target.value))"
        type="number"
      >
    </div>
    <div class="inputWrap">
      <label class="checkmarkLabel" for="startingNonce">Starting nonce:</label>
      <input
        id="startingNonce"
        :value="startingNonce"
        @focus="$event.target.select()"
        @input="$emit('update:startingNonce', parseFloat($event.target.value))"
        type="number"
        min="0"
      >
    </div>
    <div class="inputWrap">
      <label class="checkmarkLabel" for="endingNonce">Ending nonce:</label>
      <input
        id="endingNonce"
        :value="endingNonce"
        @focus="$event.target.select()"
        @input="$emit('update:endingNonce', parseFloat($event.target.value))"
        type="number"
        min="0"
      >
    </div>
    <div class="inputWrap">
      <label for="printNonceInput">
        <div class="tooltip">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
          <span class="tooltipText">Printing data from every nonce is expensive. This saves resources and allows the simulation to run faster.</span>
        </div>
        Print every {{ printNonce }} nonces:</label>
      <input
        id="printNonceInput"
        :value="printNonce"
        @focus="$event.target.select()"
        @input="$emit('update:printNonce', parseFloat($event.target.value))"
        type="number"
      >
    </div>
    <div class="inputWrap">
      <label class="checkmarkLabel" for="clientInput">Client Seed:</label>
      <input
        id="clientInput"
        type="text"
        :value="clientSeed"
        @focus="$event.target.select()"
        @input="$emit('update:clientSeed', $event.target.value)"
      >
    </div>
    <div class="inputWrap">
      <label for="serverInput">Server Seed:</label>
      <input
        id="serverInput"
        type="text"
        :value="serverSeed"
        @focus="$event.target.select()"
        @input="$emit('update:serverSeed', $event.target.value)"
      >
    </div>
</div>
    <div class="chartButtons">
      <button @click="generateSeed">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 95.1H0c0 123.8 100.3 224 224 224v128C224 465.6 238.4 480 255.1 480S288 465.6 288 448V320C288 196.3 187.7 95.1 64 95.1zM448 32c-84.25 0-157.4 46.5-195.8 115.3c27.75 30.12 48.25 66.88 59 107.5C424 243.1 512 147.9 512 32H448z"/></svg>
        Generate Random Seed</button>
    </div>
  </div>
</template>

<script setup>
/* Imports */
import { randomString, genRanHex } from "@/helpers/helpers"

/* Props */

const props = defineProps({
  baseChance: Number,
  baseTarget: Number,
  initialBalance: Number,
  baseBet: Number,
  currency: String,
  printNonce: Number,
  startingNonce: Number,
  endingNonce: Number,
  houseEdge: Number,
  clientSeed: String,
  serverSeed: String,
  game: String
})

/* Emits */

const emit = defineEmits([ "update:baseChance", "update:baseTarget", "update:initialBalance", "update:currency", "update:baseBet", "update:printNonce", "update:startingNonce", "update:endingNonce", "update:clientSeed", "update:serverSeed" ])

/* Data */

const generateSeed = () => {
  emit("update:clientSeed", randomString(30));
  emit("update:serverSeed", genRanHex(64));
}

</script>