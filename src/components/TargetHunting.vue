<template>
  <div class="tab">
    <div class="targetTab">
      <div class="tabItem">
        <h3 class="primary">Visualize Raw Seed Data</h3>
        <div class="arrayWrapper">
          <div class="arrayItem"  v-for="(nonce, i) in rawData.nonce" :key="nonce">
            <p><span class="bold">Nonce:</span><span class="primary"> {{ nonce }}</span></p>
            <p><span class="bold">Result: </span><span class="primary">{{ rawData.results[i] }}</span></p>
          </div>
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
        <div class="inputWrap">
          <label for="startingNonce">Starting nonce:</label>
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
          <label for="endingNonce">Ending nonce:</label>
          <input
          id="endingNonce"
          :value="endingNonce"
          @focus="$event.target.select()"
          @input="$emit('update:endingNonce', parseFloat($event.target.value))"
          type="number"
          min="0"
          >
        </div>
        <div class="chartButtons">
          <button @click="generateSeed">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 95.1H0c0 123.8 100.3 224 224 224v128C224 465.6 238.4 480 255.1 480S288 465.6 288 448V320C288 196.3 187.7 95.1 64 95.1zM448 32c-84.25 0-157.4 46.5-195.8 115.3c27.75 30.12 48.25 66.88 59 107.5C424 243.1 512 147.9 512 32H448z"/></svg>
            Generate Random Seed</button>
            <button @click="generateRawData">
              Generate Raw Data
            </button>
            <button @click="exportRawToJSON(rawData)">Export to JSON</button>
          <button @click="exportRawToCSV(rawData)">Export to CSV</button>
        </div>
      </div>
      <div class="tabItem">
        <h3 class="primary">Target Analysis:</h3>
        <div class="chartWrapper">
          <apexchart class="apexCharts" type="bar" height="350" :options="chartOptionsOne" :series="seriesOne"></apexchart>
          <apexchart class="apexCharts" type="bar" height="350" :options="chartOptionsTwo" :series="seriesTwo"></apexchart>
          <apexchart class="apexCharts" type="bar" height="350" :options="chartOptionsThree" :series="seriesThree"></apexchart>
          <apexchart class="apexCharts" type="scatter" height="350" :options="chartOptionsFour" :series="seriesFour"></apexchart>
        </div>
        <div class="arrayWrapper">
          <div class="arrayItem"  v-for="(nonce, i) in targetData.nonce" :key="nonce">
            <p><span class="bold">Nonce:</span><span class="primary"> {{ nonce }}</span></p>
            <p><span class="bold">Result: </span><span class="primary">{{ targetData.results[i] }}</span></p>
            <p><span class="bold">Distance from previous payout: <span class="primary">{{ targetData.distanceFromPrevious[i] }}</span></span></p>
            <p><span class="bold">Seed: </span> <span>Client-</span><span class="primary">{{ targetData.seed[i].client }}</span> <span>Server-</span><span class="primary">{{ targetData.seed[i].server }}</span></p>
          </div>
        </div>
        <div class="resultsWrapper">
          <h3 class="primary">Analytics</h3>
          <ul>
            <li class="resultsItem mainGrey" v-if="game === 'dice'">Target win chance (%):
              <span>{{ calcWinChance(targetPayout, houseEdge) }}</span>
            </li>
            <li class="resultsItem mainGrey" v-else>Target payout:
              <span>{{ targetPayout }}x</span>
            </li>
            <li class="resultsItem mainGrey"># of targets found:
              <span>{{ targetData.results.length }}</span>
            </li>
            <li class="resultsItem mainGrey">Mean Distance
              <span>{{ meanDistance }}</span>
            </li>
            <li class="resultsItem mainGrey">Median Distance
              <span>{{ medianDistance }}</span>
            </li>
            <li class="resultsItem mainGrey">Spread:
              <span>Closest - {{ sortedDistanceArray[0] }}  Furthest - {{ sortedDistanceArray[sortedDistanceArray.length-1] }}</span>
            </li>
          </ul>
        </div>
        <div class="inputWrap">
          <label for="targetPayoutInput">
            <div class="tooltip">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
              <span class="tooltipText">Select target payout to search for in the given seed.</span>
            </div>
            Target payout:</label>
          <input
            id="targetPayoutInput"
            type="number"
            min="1.01"
            max="9900"
            v-if="game === 'dice'"
            v-model="targetPayout"
            @focus="$event.target.select()"
          >
          <input
            id="targetPayoutInput"
            type="number"
            min="1.01"
            max="1000000"
            v-else
            v-model="targetPayout"
            @focus="$event.target.select()"
          >
        </div>
        <div class="inputWrap">
          <label for="payoutNumber">Number of targets to search for:</label>
          <input
          id="payoutNumber"
          type="number"
          v-model="payoutNumber"
          @focus="$event.target.select()"
          >
        </div>
        <div class="inputWrap" v-if="game === 'dice'">
          <label for="betHigh">Bet High?:</label>
          <input
          id="betHigh"
          type="checkbox"
          v-model="betHigh"
          >
        </div>
        <div class="inputWrap">
          <label for="resetSeed">
            <div class="tooltip">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
              <span class="tooltipText">After finding the first target in the seed it will change to a new seed and continue searching.</span>
            </div>
            Reset seed after payout?:</label>
          <input
          id="resetSeed"
          type="checkbox"
          v-model="resetSeed"
          >
        </div>
        <div class="chartButtons">
          <button @click="generateSeed">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 95.1H0c0 123.8 100.3 224 224 224v128C224 465.6 238.4 480 255.1 480S288 465.6 288 448V320C288 196.3 187.7 95.1 64 95.1zM448 32c-84.25 0-157.4 46.5-195.8 115.3c27.75 30.12 48.25 66.88 59 107.5C424 243.1 512 147.9 512 32H448z"/></svg>
            Generate Random Seed</button>
          <button @click="generateDiceTargetData" v-if="game === 'dice'">
            Generate Dice Target Data
          </button>
          <button @click="generateLimboTargetData" v-else>
            Generate Limbo Target Data
          </button>
          <button @click="exportToJSON(targetData)">Export to JSON</button>
          <button @click="exportToCSV(targetData)">Export to CSV</button>
        </div>
      </div>
    </div>
    <span class="large"> ⛺ More Updates Coming soon 🍂 </span>
</div>
</template>

<script setup>
/* IMPORTS */
import { ref, reactive, inject, computed } from "vue";
import { randomString, genRanHex, calcMean, calcMedian, calcWinChance, median, arraySortNumbers, exportToJSON, exportRawToJSON, exportToCSV, exportRawToCSV } from "@/helpers/helpers";
import { useRoute } from 'vue-router';
import CryptoJS from "crypto-js";
import { Buffer } from "buffer";
import useEventsBus from "@/composables/eventBus";

/* PROPS */

const props = defineProps({
  startingNonce: Number,
  endingNonce: Number,
  clientSeed: String,
  serverSeed: String,
  game: String,
  houseEdge: Number,
});

/* - THEME - INJECT */

const theme = inject("currentTheme");

/* APEX CHART */

const seriesOne = ref([
  {
    name: "Closest",
    type: "column",
    data: []
  },
  {
    name: "Median",
    type: "column",
    data: []
  },
  {
    name: "Farthest",
    type: "column",
    data: []
  }
]);

const seriesTwo = ref([
  {
    name: "B2B",
    type: "column",
    data: []
  },
  {
    name: "HighestB2B",
    type: "column",
    data: []
  },
  {
    name: "HighestB2BMulti",
    type: "column",
    data: []
  }
]);

const seriesThree = ref([
  {
    name: 'Actual',
    data: []
  }
]);

const seriesFour = ref([
  {
    name: 'Payouts',
    data: []
  }
]);

const chartOptionsOne = computed(() => {
  return {
    title: { 
      text: "Distance between Payouts",
      style: { color: theme.value === "dark" ? "#59FFAC" : "#0250C6" },
      align: "center"
      },
    chart: { 
      type: "bar",
      toolbar: { show: false },
      foreColor: theme.value === "dark" ? "white" : "black",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '100%',
        endingShape: 'rounded'
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Closest", "Median", "Farthest"],
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#008FFB'
        },
        labels: {
          style: {
            colors: '#008FFB',
          }
        },
        title: {
          text: "Closest Payout",
          style: {
            color: '#008FFB',
          }
        },
        tooltip: {
          enabled: true
        }
      },
      {
        seriesName: 'Median',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#00E396'
        },
        labels: {
          style: {
            colors: '#00E396',
          }
        },
        title: {
          text: "Median Appearance",
          style: {
            color: '#00E396',
          }
        },
      },
      {
        seriesName: 'Farthest',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#FEB019'
        },
        labels: {
          style: {
            colors: '#FEB019',
          }
        },
        title: {
          text: "Farthest Payout",
          style: {
            color: '#FEB019',
          }
        },
      }],
    grid: { borderColor: theme.value === "dark" ? "#59FFAC" : "#0250C6"},
    tooltip: { theme: theme.value },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    colors: ["#008FFB", "#00E396", "#FEB019"],
  };
});

const chartOptionsTwo = computed(() => {
  return {
    title: {
      text: "Back2Back",
      style: { color: theme.value === "dark" ? "#59FFAC" : "#0250C6" },
      align: "center"
      },
    chart: { 
      type: "bar",
      toolbar: { show: false },
      foreColor: theme.value === "dark" ? "white" : "black",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '100%',
        endingShape: 'rounded'
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Found", "Highest Streak", "Multi"],
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#008FFB'
        },
        labels: {
          style: {
            colors: '#008FFB',
          }
        },
        title: {
          text: "B2B Found",
          style: {
            color: '#008FFB',
          }
        },
        tooltip: {
          enabled: true
        }
      },
      {
        seriesName: 'HighestB2B',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#00E396'
        },
        labels: {
          style: {
            colors: '#00E396',
          }
        },
        title: {
          text: "Highest # of B2B",
          style: {
            color: '#00E396',
          }
        },
      },
      {
        seriesName: 'B2BHighestB2BMulti',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#FEB019'
        },
        labels: {
          style: {
            colors: '#FEB019',
          }
        },
        title: {
          text: "Highest B2B Multi",
          style: {
            color: '#FEB019',
          }
        },
      }],
    grid: { borderColor: theme.value === "dark" ? "#59FFAC" : "#0250C6"},
    tooltip: { theme: theme.value },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    colors: ["#008FFB", "#00E396", "#FEB019"],
  };
});

const chartOptionsThree = computed(() => {
  return {
    title: {
      text: "Expected Hits",
      style: { color: theme.value === "dark" ? "#59FFAC" : "#0250C6" },
      align: "center"
      },
    chart: {
      height: 350,
      type: 'bar'
    },
    xaxis: {
        labels: {
          style: {
            colors: theme.value === "dark" ? "#ffffff" : "#222222",
          },
      },
    },
    yaxis: [
      {
        seriesName: "hitRate",
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#008FFB'
        },
        labels: {
          style: {
            colors: "#008FFB",
          },
          formatter: function (val) {
                return val.toFixed(4)
            }
        },
        title: {
          text: "Target Hit Rate",
          style: {
            color: '#008FFB',
          }
        },
        tooltip: {
          enabled: true
        }
      },
      {
        seriesName: "targetsFound",
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#FEB019'
        },
        labels: {
          style: {
            colors: "#FEB019",
          },
          formatter: function (val) {
                return val.toFixed(4)
            }
        },
        title: {
          text: "Expected Hits",
          style: {
            color: '#FEB019',
          }
        },
      }],
    colors: ['#00E396', "#FEB019"],
    tooltip: { theme: theme.value },
    dataLabels: {
      enabled: false
    },
    grid: { borderColor: theme.value === "dark" ? "#59FFAC" : "#0250C6"},
    legend: {
      show: true,
      labels: {
          colors: theme.value === "dark" ? "#ffffff" : "#222222",
          useSeriesColors: false
      },
      showForSingleSeries: true,
      customLegendItems: ["Actual Hit Rate", "Actual Targets Found", "Expected"],
      markers: {
        fillColors: ["#59FFAC", "#FEB019", "#775DD0"],
      }
    }
  }
});

const chartOptionsFour = computed(() => {
  return {
    title: { 
      text: "Highest 100 Targets found",
      style: { color: theme.value === "dark" ? "#59FFAC" : "#0250C6" },
      align: "center"
      },
    chart: { 
      type: "scatter",
      toolbar: { show: false },
      foreColor: theme.value === "dark" ? "white" : "black",
      height: 350,
      zoom: {
        enabled: true,
        type: 'xy'
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '100%',
        endingShape: 'rounded'
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      title: {
        text: "Nonce",
        style: {
          fontWeight: 100,
          color: theme.value === "dark" ? "white" : "black",
        },
        position: 'bottom',
      },
      tickAmount: 1,
    },
    yaxis: {
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: "#008FFB"
      },
      labels: {
        style: {
          colors: "#008FFB",
        },
        formatter: function (val) {
          return val.toFixed(2)
        }
      },
      title: {
        text: "Target (x)",
        style: {
          color: "#008FFB",
        }
      },
      tooltip: {
        enabled: true
      }
    },
    grid: { borderColor: theme.value === "dark" ? "#59FFAC" : "#0250C6"},
    tooltip: { theme: theme.value },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    colors: ["#008FFB"],
  };
});

const pickGreatest = (arr = [], num = 1) => {
   if(num > arr.length){
      return [];
   };
   const sorter = (a, b) => b - a;
   const descendingCopy = arr.slice().sort(sorter);
   return descendingCopy.splice(0, num);
};

const generatePayoutFrequencyChart = () => {
  let results = [...targetData.distanceFromPrevious];
  let sorted = arraySortNumbers(results);
  let med = median(sorted);
  let topPayouts = [];
  seriesOne.value = [];
  seriesTwo.value = [];

  seriesOne.value = [
    {
    name: "Closest",
    type: "column",
    data: [sorted[0], 0, 0]
    },
    {
    name: "Median",
    type: "column",
    data: [0, med, 0]
    },
    {
      name: "Farthest",
      type: "column",
      data: [0, 0, sorted[sorted.length-1]]
    }
  ];

  seriesTwo.value = [
    {
    name: "B2B",
    type: "column",
    data: [foundB2B.value, 0, 0]
    },
    {
    name: "highestB2B",
    type: "column",
    data: [0, highestB2B.value, 0]
    },
    {
      name: "HighestB2BMulti",
      type: "column",
      data: [0, 0, highestB2BMulti.value]
    }
  ];

  seriesThree.value = [
    {
      name: "hitRate",
      data: [
        {
          x: "Hit Rate",
          y: hitRate.value,
          goals: [
            {
              name: 'Expected',
              value: expectedHitRate.value,
              strokeHeight: 5,
              strokeColor: '#775DD0'
              }
            ]
        },
        {
          x: "Targets Found",
          y: 0,
        }
      ]
    },
    {
      name: "highestTargetsFound",
      data: [
        {
          x: "Hit Rate",
          y: 0,
        },
        {
          x: "Targets Found",
          y: targetsFound.value,
          goals: [
            {
              name: 'Expected',
              value: expectedHits.value,
              strokeHeight: 5,
              strokeColor: '#775DD0'
            }
          ]
        },
      ]
    }
  ];

  topPayouts = topResults.value.map(({ payout, nonce }) => {
    return { x: nonce, y: payout }
  })

  seriesFour.value = [
    {
    name: "Targets Found",
    data: topPayouts
    },
  ];
};

/* DATA */

const { emitBus } = useEventsBus();

const payoutNumber = ref(1),
      targetPayout = ref(2),
      betHigh = ref(false),
      resetSeed = ref(false),
      meanDistance = ref(0),
      medianDistance = ref(0),
      rawData = reactive({
        nonce: [],
        results: []
      }),
      targetData = reactive({
        nonce: [],
        results: [],
        distanceFromPrevious: [],
        seed: []
      }),
      sortedDistanceArray = ref([]),
      seedsTested = ref(0),
      targetsFound = ref(0),
      noncesSearched = ref(0),
      foundB2B = ref(0),
      highestB2B = ref(0),
      highestB2BMulti = ref(0),
      expectedHitRate = ref(0),
      hitRate = ref(0),
      expectedHits = ref(0),
      topResults = ref([]);

const route = useRoute();


const generateSeed = () => {
  emit("update:clientSeed", randomString(30));
  emit("update:serverSeed", genRanHex(64));
}

const generateRawData = () => {
  rawData.nonce = [];
  rawData.results = [];

  for (var i = Number(startingNonce.value); i < Number(endingNonce.value); i++) {
    let roll = generateRoll(i);
    rawData.nonce.push(i);
    rawData.results.push(roll);
  }
}

const generateDiceTargetData = async () => {
  targetData.results = [];
  targetData.nonce = [];
  targetData.distanceFromPrevious = [];
  targetData.seed = [];
  seedsTested.value = 1;
  targetsFound.value = 0;
  noncesSearched.value = 1;
  foundB2B.value = 0;
  highestB2B.value = 0;
  highestB2BMulti.value = 0;

  let inarow = 0;
  let distance = 0;
  let winChance = calcWinChance(targetPayout.value, props.houseEdge);
  let loop = true;
  let counter = 1;
  let payout = 0;
  let topOrderedResults = [];
  let orderedTargets = [];
  let resultsArray = [];


  if (targetPayout.value < 1.01 || targetPayout.value > 9900) {
      emitBus('notify', {
      type: 'error',
        title: 'Error while generating data.',
        message: 'Please set the correct payout (Between 1.01x and 9900x)',
        action: 'close'
      });
    return;
  }
  
  while (loop) {
    let roll = generateRoll(counter);
    noncesSearched.value += 1;
    distance += 1;

    payout = (100/roll);
    payout = payout-(payout*(1/100));

    if (payout < 1000) {
      payout = payout.toFixed(4);
    }
    payout = parseFloat(payout);

    resultsArray.push({
      payout: payout,
      nonce: counter
    });

    if (betHigh.value) {
      if (roll > (100 - winChance)) {
        targetData.results.push(roll);
        targetData.nonce.push(counter);
        targetData.distanceFromPrevious.push(distance);
        targetData.seed.push({client: props.clientSeed, server: props.serverSeed});
        targetsFound.value += 1;
        distance = 0;
        inarow += 1;

        if (inarow > 1) {
          foundB2B.value += 1;
          if (inarow > highestB2B.value) {
            highestB2B.value = inarow;
          }
        }

        if (resetSeed.value) {
          counter = 0;
          seedsTested.value += 1;
          await generateSeed();
          props.clientSeed.toString();
          props.serverSeed.toString();
        }
      } else {
        inarow = 0;
      }
    } else {
      if (roll < winChance) {
        targetData.results.push(roll);
        targetData.nonce.push(counter);
        targetData.distanceFromPrevious.push(distance);
        targetData.seed.push({client: props.clientSeed, server: props.serverSeed});
        targetsFound.value += 1;
        distance = 0;
        inarow += 1;

        if (inarow > 1) {
          foundB2B.value += 1;
          if (inarow > highestB2B.value) {
            highestB2B.value = inarow;
          }
        }

        if (resetSeed.value) {
          counter = 0;
          seedsTested.value += 1;
          await generateSeed();
          props.clientSeed.toString();
          props.serverSeed.toString();
        }
      } else {
        inarow = 0;
      }
    }

    counter += 1;

    if (targetsFound.value >= payoutNumber.value) {
      loop = false;
    }
  }

  if (highestB2B.value > 0) {
    highestB2BMulti.value = Math.pow(targetPayout.value, highestB2B.value);
  }

  orderedTargets = [...resultsArray].sort((a, b) => {
    return a.payout - b.payout;
  });

  topOrderedResults.value = orderedTargets.slice(-100);
  topResults.value = topOrderedResults.value.sort((a, b) => {
    return a.nonce - b.nonce;
  });

  expectedHitRate.value = parseFloat((((100/targetPayout.value) * 0.99) / 100).toFixed(7));
  hitRate.value = parseFloat((targetsFound.value / noncesSearched.value).toFixed(7));
  expectedHits.value = parseFloat((expectedHitRate.value * noncesSearched.value).toFixed(7));

  generatePayoutFrequencyChart();

  sortedDistanceArray.value = [...targetData.distanceFromPrevious].sort((a, b)=>a-b);

  medianDistance.value = calcMedian(targetData.distanceFromPrevious);
  meanDistance.value = calcMean(targetData.distanceFromPrevious);
}

const generateLimboTargetData = async () => {
  targetData.results = [];
  targetData.nonce = [];
  targetData.distanceFromPrevious = [];
  targetData.seed = [];
  seedsTested.value = 1;
  targetsFound.value = 0;
  noncesSearched.value = 1;
  foundB2B.value = 0;
  highestB2B.value = 0;
  highestB2BMulti.value = 0;

  let inarow = 0;
  let distance = 0;
  let loop = true;
  let counter = 1;
  let topOrderedResults = [];
  let orderedTargets = [];
  let resultsArray = [];

  if (targetPayout.value < 1.01 || targetPayout.value > 1000000) {
      emitBus('notify', {
      type: 'error',
        title: 'Error while generating data.',
        message: 'Please set the correct payout (Between 1.01x and 1000000x)',
        action: 'close'
      });
    return;
  }


  while (loop) {
    let roll = generateRoll(counter);
    distance += 1;
    noncesSearched.value += 1;

    resultsArray.push({
      payout: roll,
      nonce: counter
    });

    if (roll >= targetPayout.value) {
      targetData.results.push(roll);
      targetData.nonce.push(counter);
      targetData.distanceFromPrevious.push(distance);
      targetData.seed.push({client: props.clientSeed, server: props.serverSeed});
      targetsFound.value += 1;
      distance = 0;
      inarow += 1;

      if (inarow > 1) {
        foundB2B.value += 1;
        if (inarow > highestB2B.value) {
          highestB2B.value = inarow;
        }
      }

      if (resetSeed.value) {
        counter = 0;
        seedsTested.value += 1;
        await generateSeed();
        props.clientSeed.toString();
        props.serverSeed.toString();
      }
    } else {
      inarow = 0;
    }

    counter += 1;

    if (targetsFound.value >= payoutNumber.value) {
      loop = false;
    }
  }

  if (highestB2B.value > 0) {
    highestB2BMulti.value = Math.pow(targetPayout.value, highestB2B.value);
  }

  orderedTargets = [...resultsArray].sort((a, b) => {
    return a.payout - b.payout;
  });
  topOrderedResults.value = orderedTargets.slice(-100);
  topResults.value = topOrderedResults.value.sort((a, b) => {
    return a.nonce - b.nonce;
  });

  expectedHitRate.value = parseFloat((((100/targetPayout.value) * 0.99) / 100).toFixed(7));
  hitRate.value = parseFloat((targetsFound.value / noncesSearched.value).toFixed(7));
  expectedHits.value = parseFloat((expectedHitRate.value * noncesSearched.value).toFixed(7));

  generatePayoutFrequencyChart();

  sortedDistanceArray.value = [...targetData.distanceFromPrevious].sort((a, b)=>a-b);

  medianDistance.value = calcMedian(targetData.distanceFromPrevious);
  meanDistance.value = calcMean(targetData.distanceFromPrevious);
}

const generateRoll = (nonce) => {
  let roll;
  if (props.game === "dice") {
      let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, props.serverSeed);
      hmac.update(`${props.clientSeed}:${nonce}:0`);
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
      roll = Math.floor(result * 100) / 100;
    } else {
      const serverSeed = CryptoJS.enc.Utf8.parse(props.serverSeed);
      const message = CryptoJS.enc.Utf8.parse(`${props.clientSeed}:${nonce}:0`);
      const hmac = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(message, serverSeed));
      const buffer = Buffer.from(hmac, 'hex');

      const bytes = [];
      for (let i = 0; i < 5; i++) {
          const el = buffer[i];
          bytes.push(el);
      }
      const floats = [];
      floats.push(bytes[0] / 256);
      floats.push(bytes[1] / (256 ** 2));
      floats.push(bytes[2] / (256 ** 3));
      floats.push(bytes[3] / (256 ** 4));

      const float = Math.floor((floats.reduce((a, b) => a + b, 0)) * 100000000);
      const result = 100000000 / (float + 1) * (1 - 0.01);
      const finalResult = Math.floor(result * 100) / 100;

      return finalResult;


      // let betHash = CryptoJS.HmacSHA256(`${props.clientSeed}:${nonce}:0`, props.serverSeed).toString();
      // console.log(betHash);
      // let floats = new Array(4).fill(0).map((el, index) => {
      //   return parseInt(betHash.substr(index * 2, 2), 16);
      // });
      // let sum = 0;
      // floats.forEach((float, index) => {
      //   sum += round((float / Math.pow(256, index+1)), 10);
      // });
      // let float = sum * 1e8;
      // let normalizedFloat = Math.max(float, 0.01);
      // let floatPoint = 1e8 / normalizedFloat * (1-(props.houseEdge/100));
      // let clampedFloatPoint = Math.min(floatPoint, 9900000);
      // let crashPoint = Math.floor(clampedFloatPoint * 100) / 100;
      // roll = Math.max(crashPoint, 1);
    }
    return roll;
}

/* Emits */

const emit = defineEmits(["update:clientSeed", "update:serverSeed", "update:startingNonce", "update:endingNonce"]);


</script>