<template>
  <div id="Chart">
    <h3>Dice Analyzer</h3>
    <div class="mainChartWrapper">
      <div id="Plot" :class="{ 'blur' : loading }">
        <LineChart
          ref="lineRef"
          :chart-data="chartData"
          :options="chartOptions"
          ></LineChart>
          <p class="watermark">www.casinosimulator.netlify.app</p>
      </div>
      <div class="spinnerWrapper" v-if="loading">
        <div class="spinnerContainer">
          <div class="sk-cube-grid">
            <div class="sk-cube sk-cube1"></div>
            <div class="sk-cube sk-cube2"></div>
            <div class="sk-cube sk-cube3"></div>
            <div class="sk-cube sk-cube4"></div>
            <div class="sk-cube sk-cube5"></div>
            <div class="sk-cube sk-cube6"></div>
            <div class="sk-cube sk-cube7"></div>
            <div class="sk-cube sk-cube8"></div>
            <div class="sk-cube sk-cube9"></div>
          </div>
          <p class="loading">Generating data...</p>
        </div>
      </div>
    </div>
    <div class="chartButtons">
      <button :disabled="loading" @click="doBet">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"/></svg>
        Generate Seed Data
      </button>
      <div class="displayChartInput">
          <label for="displayChart">
            <div class="tooltip">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
            <span class="tooltipText">By disabling the chart it will accelerate the speed of the calculations.</span>
          </div>
            Display Chart?
          </label>
          <input
          id="displayChart"
          type="checkbox"
          v-model="displayChart"
          >
        </div>
    </div>
    <span class="displayMessage danger bold">{{ info.data.reportMessage }}</span>
    <div class="resultsWrapper">
      <h3 class="primary">Results</h3>
      <ul>
        <li class="resultsItem mainGrey">Total Wagered
          <span>{{ info.data.wagered }} ({{ (info.data.wagered / initialBalance).toFixed(2) }}x start balance)</span>
        </li>
        <li class="resultsItem mainGrey">Total Bets
          <span>{{ info.data.bets }}</span>
        </li>
        <li class="resultsItem mainGrey">Profit
          <span :class="info.data.profit < 0 ? 'mainRed' : 'contrastGreen'" >{{ info.data.profit }} {{ info.data.currency }}</span>
        </li>
        <li class="resultsItem mainGrey">Lost
          <span>{{ info.data.losses }}</span>
        </li>
        <li class="resultsItem mainGrey">Won
          <span>{{ info.data.wins }}</span>
        </li>
        <li class="resultsItem mainGrey">Max Streaks
          <div>
            <span class="contrastGreen">{{ info.data.maxWinStreak }}</span> | 
            <span class="mainRed">{{ info.data.maxLoosingStreak }}</span>
          </div>
        </li>
        <li class="resultsItem mainGrey">Highest bet
          <span>{{ info.data.highestBet }}</span>
        </li>
        <li class="resultsItem mainGrey">Highest Loss
          <span>{{ info.data.highestLost }}</span>
        </li>
        <li class="resultsItem mainGrey">Highest Win
          <span>{{ info.data.highestSingleWin }}</span>
        </li>
        <li class="resultsItem mainGrey">Highest Balance
          <span>{{ info.data.highestBalance }}</span>
        </li>
        <li class="resultsItem mainGrey">Lowest Balance
          <span>{{ info.data.lowestBalance }}</span>
        </li>
      </ul>
    </div>
    <button @click="exportToJSONStrategy(exportData)">Export to JSON</button>
    <button @click="exportToCSVStrategy(exportData)">Export to CSV</button>
    <div class="tabContainer">
      <div class="tabButtonsContainer">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['tabButton', { active: currentTab === tab }]"
          @click="currentTab = tab"
        >
          <svg  v-if="tab === 'Setup'"  class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M492.7 42.75C517.7 67.74 517.7 108.3 492.7 133.3L436.3 189.7L322.3 75.72L378.7 19.32C403.7-5.678 444.3-5.678 469.3 19.32L492.7 42.75zM44.89 353.2L299.7 98.34L413.7 212.3L158.8 467.1C152.1 473.8 143.8 478.7 134.6 481.4L30.59 511.1C22.21 513.5 13.19 511.1 7.03 504.1C.8669 498.8-1.47 489.8 .9242 481.4L30.65 377.4C33.26 368.2 38.16 359.9 44.89 353.2zM249.4 103.4L103.4 249.4L16 161.9C-2.745 143.2-2.745 112.8 16 94.06L94.06 16C112.8-2.745 143.2-2.745 161.9 16L181.7 35.76C181.4 36.05 181 36.36 180.7 36.69L116.7 100.7C110.4 106.9 110.4 117.1 116.7 123.3C122.9 129.6 133.1 129.6 139.3 123.3L203.3 59.31C203.6 58.99 203.1 58.65 204.2 58.3L249.4 103.4zM453.7 307.8C453.4 308 453 308.4 452.7 308.7L388.7 372.7C382.4 378.9 382.4 389.1 388.7 395.3C394.9 401.6 405.1 401.6 411.3 395.3L475.3 331.3C475.6 330.1 475.1 330.6 476.2 330.3L496 350.1C514.7 368.8 514.7 399.2 496 417.9L417.9 496C399.2 514.7 368.8 514.7 350.1 496L262.6 408.6L408.6 262.6L453.7 307.8z"/></svg>
          <svg v-else-if="tab === 'StrategyTesting'"  class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 32C497.7 32 512 46.33 512 64C512 81.67 497.7 96 480 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H480zM32 128H480V416C497.7 416 512 430.3 512 448C512 465.7 497.7 480 480 480H352V352C352 298.1 309 256 256 256C202.1 256 160 298.1 160 352V480H32C14.33 480 0 465.7 0 448C0 430.3 14.33 416 32 416V128z"/></svg>
          <svg v-else-if="tab === 'TargetHunting'"  class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 48C416 39.13 408.9 32 400 32h-64C327.1 32 320 39.13 320 48V96h96.04L416 48zM63.88 160.1C61.34 253.9 3.5 274.3 0 404V448c0 17.6 14.4 32 32 32h128c17.6 0 32-14.4 32-32V128H95.88C78.26 128 64.35 142.5 63.88 160.1zM448.1 160.1C447.6 142.5 433.7 128 416.1 128H320v320c0 17.6 14.4 32 32 32h128c17.6 0 32-14.4 32-32v-44C508.5 274.3 450.7 253.9 448.1 160.1zM224 288h64V128H224V288zM176 32h-64C103.1 32 96 39.13 96 48L95.96 96H192V48C192 39.13 184.9 32 176 32z"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg"  class="icon" viewBox="0 0 512 512"><path d="M0 64C0 28.65 28.65 0 64 0H352C387.3 0 416 28.65 416 64V128C416 163.3 387.3 192 352 192H64C28.65 192 0 163.3 0 128V64zM160 352C160 334.3 174.3 320 192 320V304C192 259.8 227.8 224 272 224H416C433.7 224 448 209.7 448 192V69.46C485.3 82.64 512 118.2 512 160V192C512 245 469 288 416 288H272C263.2 288 256 295.2 256 304V320C273.7 320 288 334.3 288 352V480C288 497.7 273.7 512 256 512H192C174.3 512 160 497.7 160 480V352z"/></svg>
          {{ wordSeparator(tab) }}
        </button>
      </div>
      <keep-alive>
        <component
          :is="currentTab === 'Setup' ? Setup : currentTab === 'StrategyTesting' ? StrategyTesting : currentTab === 'TargetHunting' ? TargetHunting : ChartConfiguration" class="tab"
          v-model:baseChance="baseChance"
          v-model:initialBalance="initialBalance"
          v-model:currency="currency"
          v-model:printNonce="printNonce"
          v-model:startingNonce="startingNonce"
          v-model:endingNonce="endingNonce"
          v-model:houseEdge="houseEdge"
          v-model:serverSeed="seed.server"
          v-model:clientSeed="seed.client"
          v-model:baseBet="baseBet"
          v-model:legendColor="legendColor"
          v-model:legendFontSize="legendFontSize"
          v-model:axisColor="axisColor"
          v-model:backgroundColor="backgroundColor"
          v-model:betAmountColor="betAmountColor"
          v-model:legendBalanceColor="legendBalanceColor"
          :game="'dice'"
          @updateConditions="updateConditions"
          @updateSetup="updateSetup"
          >
          </component>
      </keep-alive>
    </div>
  </div>
</template>
<script setup>
/* IMPORTS */

import Setup from '@/components/Setup.vue'
import StrategyTesting from '@/components/StrategyTesting.vue'
import TargetHunting from '@/components/TargetHunting.vue'
import ChartConfiguration from '@/components/ChartConfiguration.vue'
import { ref, reactive, onMounted, computed, inject, watch } from "vue"
import { LineChart } from "vue-chart-3"
import { randomString, genRanHex, wordSeparator, grabFromLocalStorage, createDefaultChartTheme, exportToJSONStrategy, exportToCSVStrategy, combineArrays } from "@/helpers/helpers"
import { checkParams, updateBet } from "@/helpers/diceHelper"
import useEventsBus from "@/composables/eventBus"
import { DiceSimulator } from "@/models/diceSimulator"

const { emitBus } = useEventsBus();

/* DATA */

/*  - THEME */

const loading = ref(false)

let chartTheme = reactive({})

/* - THEME - INJECT */

const theme = inject("currentTheme");

/* - TABS */

const currentTab = ref("Setup"),
            tabs = reactive(["Setup", "StrategyTesting", "TargetHunting", "ChartConfiguration"])

/* - DICE */

const seed = reactive({
  server: "",
  client: ""
})

const Sim = new DiceSimulator();

const info = reactive({
  data: {}
});

const initialBalance = ref(100),
      balance = ref(initialBalance.value),
      baseChance = ref(49.5),
      currency = ref("usdt"),
      generatedResults = ref(false),
      chance = ref(baseChance),
      startingNonce = ref(0),
      endingNonce = ref(10000),
      nonce = ref(startingNonce.value),
      printNonce = ref(10),
      houseEdge = ref(1),
      displayChart = ref(true),
      diceData = reactive({
        balance: [],
        betAmount: [],
        highestBet: 0,
        wagered: 0,
        losses: 0,
        wins: 0,
        maxWinStreak: 0,
        maxLoosingStreak: 0,
        highestLost: 0,
        highestSingleWin: 0,
        highestBalance: 0,
        lowestBalance: 0,
      }),
      chartData = reactive({
        labels: [],
        datasets: []
      }),
      exportData = ref([]);

const updatedConditions = ref([])


const baseBet = ref(balance.value / 500000),
      currentBet = ref(baseBet.value)

const resetState = () => {
  chartData.labels = [];
  chartData.datasets = [];
  diceData.balance = [];
  diceData.betAmount = [];
  diceData.wagered = 0;
  diceData.highestBet = 0;
  diceData.losses = 0;
  diceData.wins = 0;
  diceData.maxWinStreak = 0;
  diceData.maxLoosingStreak = 0;
  diceData.highestLost = 0;
  diceData.highestSingleWin = 0;
  diceData.highestBalance = 0;
  diceData.lowestBalance = 0;
  balance.value = initialBalance.value;
  currentBet.value = baseBet.value;
  chance.value = baseChance.value;
  nonce.value = startingNonce.value;
}

const doBet = async () => {
  if(!checkParams(baseBet.value, baseChance.value, initialBalance.value, startingNonce.value, endingNonce.value)) {
    emitBus('notify', {
      type: 'error',
      title: 'Error betting',
      message: 'Please set a correct BaseBet, win chance, balance, starting & ending nonces.',
      action: 'retry'
    });
    return false;
  }

  resetState();

  loading.value = true;

  info.data = await Sim.clear(currency.value, initialBalance.value, houseEdge.value);

  let results;

  info.data.baseBet = baseBet.value;
  info.data.currentBet = info.data.baseBet;
  info.data.baseChance = baseChance.value;
  info.data.currentChance = info.data.baseChance;
  info.data.currency = currency.value;
  info.data.nonceSteps = printNonce.value;
  info.data.clientSeed = seed.client;
  info.data.serverSeed = seed.server;
  info.data.exit = false;

  // let startTime = performance.now();

  chartData.labels.push(info.data.nonce);
  diceData.balance.push(info.data.balance);
  diceData.betAmount.push(info.data.currentBet);

  setTimeout(async function () {
    for (let i = startingNonce.value; i < endingNonce.value; i++) {
      info.data.nonce = i;

      exportData.value.push({
        balance: Number(info.data.balance),
        betAmount: Number(info.data.currentBet),
        nonce: i
      });

      // console.log(info.data.currentBet);

      if (info.data.nonce !== startingNonce.value && updatedConditions.value.length) {
        updateBet(info.data, updatedConditions.value);
      }

      if (info.data.balance < info.data.currentBet) {
        info.data.reportMessage = "Unable to perform next bet. Balance is smaller than bet amount."
        break;
      }

      // Check conditions
      if (info.data.exit) {
        if (displayChart.value) {
          chartData.labels.push(info.data.nonce);
        }
        diceData.balance.push(info.data.balance);
        diceData.betAmount.push(info.data.currentBet);
        break;
      }

      results = await Sim.bet(info);

      if (info.data.nonce % info.data.nonceSteps === 0 && displayChart.value) {
        chartData.labels.push(info.data.nonce);
        diceData.balance.push(info.data.balance);
        diceData.betAmount.push(info.data.currentBet);
      }
    }

    if (displayChart) {
      // Print results to chart
      chartData.datasets.push({
        label: "Balance",
        data: diceData.balance,
        backgroundColor: legendBalanceColor.value,
        borderColor: legendBalanceColor.value
      });
      chartData.datasets.push({
        label: "BetAmount",
        data: diceData.betAmount,
        backgroundColor: betAmountColor.value,
        borderColor: betAmountColor.value,
        yAxisID: 'y1'
      })
    };
    generatedResults.value = true;

    setTimeout(function() {
      loading.value = false;
    }, 1000);
  }.bind(this),0)
}

const generateData = () => {
  // Reset Data
  resetState();
  simulateTargets();
}

const updateConditions = (cond) => {
  updatedConditions.value = [];
  
  cond.value.forEach(elem => {
    updatedConditions.value.push(elem);
  });
  return;
}

const updateSetup = (setup) => {
  initialBalance.value = setup.initialBalance;
  baseChance.value = setup.baseChance;
  baseBet.value = setup.baseBet;
  currency.value = setup.currency;
  printNonce.value = setup.printNonce;
  startingNonce.value = setup.startingNonce;
  endingNonce.value = setup.endingNonce;
  seed.client = setup.clientSeed;
  seed.server = setup.serverSeed;
}

/* - CHART */

const legendColor = ref(theme.value === "light" ? "#000000" : "#FFFFFF"),
      legendFontSize = ref(16),
      axisColor = ref(theme.value === "light" ? "#000000" : "#FFFFFF"),
      backgroundColor = ref(theme.value === "light" ? "#0250C6" : "#59FFAC"),
      legendBalanceColor = ref(theme.value === "light" ? "#FE5252" : "#0000FF"),
      betAmountColor = ref(theme.value === "light" ? "#00FFFF" : "#8C0000")

const lineRef = ref();

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      label: {
        color: legendColor.value ? legendColor.value : theme.value === "light" ? "white" : "black",
      }
    },
    tooltip: {
      callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += Math.round( context.parsed.y * 100000) / 100000;
            }
            return label;
        }
      }
    },
  },
  scales: {
    xAxis: {
      // The axis for this scale is determined from the first letter of the id as `'x'`
      // It is recommended to specify `position` and / or `axis` explicitly.
      min: startingNonce.value,
      title: {
        display: true,
        text: "Nonce",
        color: legendColor.value ? legendColor.value : theme.value === "light" ? "white" : "black",
        font: {
          weight: "bold",
          size: legendFontSize.value
        }
      },
      ticks: {
        color: axisColor.value ? axisColor.value : theme.value === "light" ? "white" : "black",
        min: 0,
        stepSize: 100
      }
    },
    yAxis: {
      // The axis for this scale is determined from the first letter of the id as `'x'`
      // It is recommended to specify `position` and / or `axis` explicitly.
      title: {
        display: true,
        text: "Balance",
        color: legendColor.value ? legendColor.value : theme.value === "light" ? "white" : "black",
        font: {
          weight: "bold",
          size: legendFontSize.value
        }
      },
      ticks: {
        color: axisColor.value ? axisColor.value : theme.value === "light" ? "white" : "black",
        min: 0,
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      min: baseBet.value,
      title: {
        display: true,
        text: "Bet Amount",
        color: legendColor.value ? legendColor.value : theme.value === "light" ? "white" : "black",
        font: {
          weight: "bold",
          size: legendFontSize.value
        }
      },
      ticks: {
        color: axisColor.value ? axisColor.value : theme.value === "light" ? "white" : "black",
      },
      // grid line settings
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
    },
  }
})
)

const setChartStyles = (themeString) => {
  if (localStorage.chartTheme) {
    chartTheme = grabFromLocalStorage("chartTheme");
  } else {
    chartTheme = createDefaultChartTheme();
    try {
      localStorage.setItem("chartTheme", JSON.stringify(chartTheme));
      emitBus('notify', {
        type: 'success',
        title: 'Setup Success',
        message: 'First time setup saved!',
        action: 'close'
      });
    } catch(error) {
      emitBus('notify', {
        type: 'error',
        title: 'Error on first Setup',
        message: 'Please try refreshing the page.',
        action: 'retry'
      });
    }
  }
  backgroundColor.value = themeString === "light" ? chartTheme.light.backgroundColor : chartTheme.dark.backgroundColor;
  axisColor.value = themeString === "light" ? chartTheme.light.axisColor : chartTheme.dark.axisColor;
  legendColor.value = themeString === "light" ? chartTheme.light.legendColor : chartTheme.dark.legendColor;
  legendFontSize.value = themeString === "light" ? chartTheme.light.legendFontSize : chartTheme.dark.legendFontSize;
  betAmountColor.value = themeString === "light" ? chartTheme.light.betAmountColor : chartTheme.dark.betAmountColor;
  legendBalanceColor.value = themeString === "light" ? chartTheme.light.legendBalanceColor : chartTheme.dark.legendBalanceColor;
}

/* MOUNTED */

onMounted(async () => {
  seed.server = genRanHex(64);
  seed.client = randomString(30);
  setChartStyles(theme.value);
  info.data = await Sim.clear(currency.value, initialBalance.value, 1);
})

/* WATCHERS */

watch(() => theme.value,(newValue) => {
  setChartStyles(newValue);
})

</script>

<style scoped>
#Plot {
  background-color: v-bind(backgroundColor)
}
</style>