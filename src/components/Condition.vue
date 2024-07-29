<template>
<div class="conditionWrapper">
  <span class="bold">
    Condition {{ id }}
  </span>
  <div class="conditionItemWrapper">
    <div class="editWrapper" v-if="editMode">
      <div class="selectionWrap">
        <fieldset>
          <label class="conditionLabel">
            Bet Condition
            <input type="radio" :name="'radio' + id" v-model="conditionObject.displayBetOrProfit" :value="true">
          </label>
          <label class="conditionLabel">
            Profit Condition
            <input type="radio" :name="'radio' + id" v-model="conditionObject.displayBetOrProfit" :value="false">
          </label>
        </fieldset>
        <div class="editBlock" v-if="conditionObject.displayBetOrProfit">
          <span class="bold">On</span>
          <div class="editInputs">
            <div class="select">
              <select v-model="conditionObject.betOnConditionOne">
                <option value="every">Every</option>
                <option value="everyStreakOf">Every streak of</option>
                <option value="firstStreakOf">First streak of</option>
                <option value="streakGreaterThan">Streak greater than</option>
                <option value="streakLowerThan">Streak lower than</option>
                <option value="resultBiggerThan">Target result bigger than</option>
                <option value="resultBiggerThanOrEqualTo">Target result bigger than or equal to</option>
                <option value="resultSmallerThan">Target result smaller than</option>
                <option value="resultSmallerThanOrEqualTo">Target result smaller than or equal to</option>
                <option value="resultEqualTo">Target result is equal to</option>
              </select>
            </div>
            <div>
              <label class="labelElement">
                <input
                  v-model="conditionObject.betOnConditionOneValue"
                  @focus="$event.target.select()"
                  class="inputElement"
                  autocomplete="off"
                  type="text"
                >
              </label>
            </div>
            <div class="select" v-if="checkStringDisabled(conditionObject.betOnConditionOne)">
              <select v-model="conditionObject.betOnConditionTwo">
                <option value="wins">Wins</option>
                <option value="losses">Losses</option>
                <option value="bets">Bets</option>
              </select>
            </div>
          </div>
          <span class="bold">Do</span>
          <div class="editInputs">
            <div class="select">
              <select v-model="conditionObject.betDoConditionThree">
                <option value="increaseBetAmount">Increase bet amount</option>
                <option value="decreaseBetAmount">Decrease bet amount</option>
                <option v-if="game === 'dice'" value="increaseWinChance">Increase win chance</option>
                <option v-else value="increasePayout">Increase payout</option>
                <option v-if="game === 'dice'" value="decreaseWinChance">Decrease win chance</option>
                <option v-else value="decreasePayout">Decrease payout</option>
                <option value="addToBetAmount">Add to bet amount</option>
                <option value="subtractFromBetAmount">Subtract from bet amount</option>
                <option value="addToWinChance">Add to win chance</option>
                <option value="addToPayout">Add to payout</option>
                <option value="subtractFromWinChance">Substract from win chance</option>
                <option value="subtractFromPayout">Substract from payout</option>
                <option value="setBetAmount">Set bet amount</option>
                <option v-if="game === 'dice'" value="setWinChance">Set win chance</option>
                <option v-else value="setPayout">Set payout</option>
                <option value="switchOverUnder">Switch over under</option>
                <option value="resetBetAmount">Reset bet amount</option>
                <option v-if="game === 'dice'" value="resetWinChance">Reset win chance</option>
                <option v-else value="resetPayout">Reset payout</option>
                <option value="stopAutobet">Stop autobet</option>
                <option value="resetSeed">Reset seed</option>
                <option value="minimumIncrease">Minimum bet increase to remain in profit</option>
                <option value="setBalance">Set Balance</option>
              </select>
            </div>
            <div>
              <label class="labelElement">
                <input
                  v-if="checkStringDisabled(conditionObject.betDoConditionThree)"
                  v-model="conditionObject.betDoConditionThreeValue"
                  @focus="$event.target.select()"
                  class="inputElement"
                  autocomplete="off"
                  type="num"
                >
              </label>
            </div>
          </div>
        </div>
        <div v-else>
          <span class="bold">On</span>
          <div class="editInputs">
            <div class="select">
              <select v-model="conditionObject.profitOnConditionFour">
                <option value="balance">Balance</option>
                <option value="loss">Loss</option>
                <option value="profit">Profit</option>
              </select>
            </div>
            <div class="select">
              <select v-model="conditionObject.profitOnConditionFive">
                <option value="greaterThan">Greater than</option>
                <option value="greaterThanOrEqualTo">Greater than or equal to</option>
                <option value="lowerThan">Lower than</option>
                <option value="lowerThanOrEqualTo">Lower than or equal to</option>
              </select>
            </div>
            <div>
              <label class="labelElement">
                <input
                  v-model="conditionObject.profitOnConditionFiveValue"
                  @focus="$event.target.select()"
                  class="inputElement"
                  autocomplete="off"
                  type="num"
                >
              </label>
            </div>
          </div>
          <span class="bold">Do</span>
          <div class="editInputs">
            <div class="select">
              <select v-model="conditionObject.betDoConditionThree">
                <option value="increaseBetAmount">Increase bet amount</option>
                <option value="decreaseBetAmount">Decrease bet amount</option>
                <option v-if="game === 'dice'" value="increaseWinChance">Increase win chance</option>
                <option v-else value="increasePayout">Increase payout</option>
                <option v-if="game === 'dice'" value="decreaseWinChance">Decrease win chance</option>
                <option v-else value="decreasePayout">Decrease payout</option>
                <option value="addToBetAmount">Add to bet amount</option>
                <option value="subtractFromBetAmount">Subtract from bet amount</option>
                <option v-if="game === 'dice'" value="addToWinChance">Add to win chance</option>
                <option v-else value="addToPayout">Add to payout</option>
                <option v-if="game === 'dice'" value="subtractFromWinChance">Substract from win chance</option>
                <option v-else value="subtractFromPayout">Substract from payout</option>
                <option value="setBetAmount">Set bet amount</option>
                <option v-if="game === 'dice'" value="setWinChance">Set win chance</option>
                <option v-else value="setPayout">Set payout</option>
                <option value="switchOverUnder">Switch over under</option>
                <option value="resetBetAmount">Reset bet amount</option>
                <option v-if="game === 'dice'" value="resetWinChance">Reset win chance</option>
                <option v-else value="resetPayout">Reset payout</option>
                <option value="stopAutobet">Stop autobet</option>
                <option value="resetSeed">Reset seed</option>
                <option value="minimumIncrease">Minimum bet increase to remain in profit</option>
                <option value="setBalance">Set Balance</option>
              </select>
            </div>
            <div>
              <label class="labelElement">
                <input
                  v-if="checkStringDisabled(conditionObject.betDoConditionThree)"
                  v-model="conditionObject.betDoConditionThreeValue"
                  @focus="$event.target.select()"
                  class="inputElement"
                  autocomplete="off"
                  type="num"
                >
              </label>
            </div>
          </div>
        </div>
        <div class="editControls">
          <button @click="editMode=false"> Minimize  
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM136 232C122.7 232 112 242.7 112 256C112 269.3 122.7 280 136 280H312C325.3 280 336 269.3 336 256C336 242.7 325.3 232 312 232H136z"/></svg>
          </button>
          <button @click="$emit('deleteComponent', id)"> Delete  
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/></svg>
          </button>
        </div>
      </div>
    </div>
    <div class="summaryWrapper" v-else>
      <div class="summaryText">
        <span>On</span>
      </div>
      <div class="summaryText">
        <span v-if="conditionObject.displayBetOrProfit">{{ wordSeparator(conditionObject.betOnConditionOne).toLowerCase() }}</span>
        <span v-else>{{ conditionObject.profitOnConditionFour.toLowerCase() }}</span>
      </div>
      <div class="summaryText">
        <span v-if="conditionObject.displayBetOrProfit" class="secondary bold">{{ conditionObject.betOnConditionOneValue }}</span>
        <span v-else class="primary bold">{{ wordSeparator(conditionObject.profitOnConditionFive).toLowerCase() }}</span>
        <span class="secondary bold" v-if="!checkStringDisabled(conditionObject.betOnConditionOne)">
          <span v-if="game === 'limbo'">x</span>
        </span>
      </div>
      <div class="summaryText" v-if="checkStringDisabled(conditionObject.betOnConditionOne)">
        <span v-if="conditionObject.displayBetOrProfit" class="primary bold">{{ wordSeparator(conditionObject.betOnConditionTwo).toLowerCase() }}</span>
        <span v-else class="secondary bold">{{ conditionObject.profitOnConditionFiveValue }}</span>
      </div>
      <div class="summaryText">
        <span v-if="conditionObject.displayBetOrProfit">{{ wordSeparator(conditionObject.betDoConditionThree).toLowerCase() }}</span>
        <span v-else>{{ wordSeparator(conditionObject.betDoConditionThree).toLowerCase() }}</span>
      </div>
      <div class="summaryText" v-if="checkStringDisabled(conditionObject.betDoConditionThree)">
        <span class="secondary bold">{{ conditionObject.betDoConditionThreeValue }}{{ /crease|setWinChance/.test(conditionObject.betDoConditionThree) ? "%" : /setPayout/.test(conditionObject.betDoConditionThree) ? "x" : "" }}</span>
        
      </div>
      <div class="conditionButtons">
        <div v-if="id === 1">
          <button @click="$emit('moveDown', id)">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"/></svg>
          </button>
        </div>
        <div v-else-if="id === length">
          <button @click="$emit('moveUp', id)">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M352 352c-8.188 0-16.38-3.125-22.62-9.375L192 205.3l-137.4 137.4c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25C368.4 348.9 360.2 352 352 352z"/></svg>
          </button>
        </div>
        <div v-else>
          <button @click="$emit('moveUp', id)">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M352 352c-8.188 0-16.38-3.125-22.62-9.375L192 205.3l-137.4 137.4c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25C368.4 348.9 360.2 352 352 352z"/></svg>
          </button>
          <button @click="$emit('moveDown', id)">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"/></svg>
          </button>
        </div>
        <div>
          <button @click="editMode=true">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M421.7 220.3L188.5 453.4L154.6 419.5L158.1 416H112C103.2 416 96 408.8 96 400V353.9L92.51 357.4C87.78 362.2 84.31 368 82.42 374.4L59.44 452.6L137.6 429.6C143.1 427.7 149.8 424.2 154.6 419.5L188.5 453.4C178.1 463.8 165.2 471.5 151.1 475.6L30.77 511C22.35 513.5 13.24 511.2 7.03 504.1C.8198 498.8-1.502 489.7 .976 481.2L36.37 360.9C40.53 346.8 48.16 333.9 58.57 323.5L291.7 90.34L421.7 220.3zM492.7 58.75C517.7 83.74 517.7 124.3 492.7 149.3L444.3 197.7L314.3 67.72L362.7 19.32C387.7-5.678 428.3-5.678 453.3 19.32L492.7 58.75z"/></svg>
          </button>
        </div>
        <div>
          <button @click="$emit('deleteComponent', id)">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
/* IMPORTS */

import { ref, reactive } from "vue"
import { wordSeparator } from "@/helpers/helpers"

/* PROPS */

const props = defineProps({
  conditionObject: Object,
  id: Number,
  length: Number,
  game: String
})

/* EMITS */

const emit = defineEmits([ "moveUp", "moveDown", "deleteComponent" ])

/* DATA */

const editMode = ref(false)

const checkStringDisabled = (string) => {
  let toMatch = ["reset", "stop", "switch", "minimum", "result"];
  if (toMatch.some(el => string.includes(el))) {
    return false;
  }
  return true;
}

</script>