<template>
  <div class="tab">
    <!-- <h3 class="bigMarginTop">⛺ COMING SOON ⛺</h3> -->
    <h3 class="primary">CSGO500 Live Wheel, Roulette & Crash</h3>
    <div class="wrapCollapsible">
      <input id="informationCollapsible" class="toggle" type="checkbox">
      <label @click="" for="informationCollapsible" class="collapsibleLabel" tabindex="0">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M169.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 274.7 54.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
        What is CSGO500 crash?
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M169.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 274.7 54.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
      </label>
      <div class="collapsibleContent">
        <div>
          <img class="crashImage" width="200" src="/images/stake/crashIcon.png" alt="">
            <div class="informationText">
              <p><span class="bold">Crash</span> is a popular crypto game at Stake casino that operates similarly to <span class="bold">a guessing game with quick rounds lasting just a few seconds</span>. It is played on a simple graph that shows the multipliers listed on the vertical line and the number of seconds on the horizontal base. <span class="bold">The goal of the game is to have the yellow line hit or go above the chosen cash out point in order to win</span>. Players can cash out early at the rate of the multiplier shown on the screen, but they need to pay close attention because rounds are over quickly!</p>
              <a href="https://stake.com/?c=0e3edf3011" target="_blank" class="bold big mainBlue">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M156.6 384.9L125.7 354c-8.5-8.5-11.5-20.8-7.7-32.2c3-8.9 7-20.5 11.8-33.8L24 288c-8.6 0-16.6-4.6-20.9-12.1s-4.2-16.7 .2-24.1l52.5-88.5c13-21.9 36.5-35.3 61.9-35.3l82.3 0c2.4-4 4.8-7.7 7.2-11.3C289.1-4.1 411.1-8.1 483.9 5.3c11.6 2.1 20.6 11.2 22.8 22.8c13.4 72.9 9.3 194.8-111.4 276.7c-3.5 2.4-7.3 4.8-11.3 7.2v82.3c0 25.4-13.4 49-35.3 61.9l-88.5 52.5c-7.4 4.4-16.6 4.5-24.1 .2s-12.1-12.2-12.1-20.9V380.8c-14.1 4.9-26.4 8.9-35.7 11.9c-11.2 3.6-23.4 .5-31.8-7.8zM384 168a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>
                JOIN CSGO500
              </a>
            </div>
        </div>
      </div>
    </div>
    <div class="liveBox">
      <div class="status">
        <span class="liveSignal bold" v-if='liveSignal'>Live</span>
        <span class="reconnectingSignal bold" v-else-if='reconnectingSignal'>Reconnecting</span>
        <span class="offlineSignal bold" v-else>Offline</span>
        <button v-if="liveSignal" @click="disconnect">Disconnect</button>
        <button v-else @click="connect">Connect</button>
      </div>
      <div class="resultBox">
        <p>Last result - <span class="bold big primary">{{ lastResult }}x</span></p>
        <p>Previous results - <span class="bold overflowX" v-html="coloredPreviousResults.join(', ')"></span></p>
      </div>
      <!-- <LineChartWheel :key="uncappedPreviousResults.length" :targets="[2, 5, 3, 2, 50, 3, 5, 2, 2]"></LineChartWheel> -->
      <LineChartWheel :key="uncappedPreviousResults.length" :targets="uncappedPreviousResults"></LineChartWheel>
      <h4 class="primary bigMarginTop">Statistical Analysis</h4>
      <div class="statisticalAnalysisBox">
        <div class="analysisBox">
            <div class="analysisItem">
                <h5 class="secondary">Appearance rate of {{ appearanceRateValue }} / total results:</h5>
                <span class="bold big">{{ appearanceRate }} / {{ uncappedPreviousResults.filter((value) => value.result !== 0).length }}</span>
            </div>
            <div class="analysisItem">
                <h5 class="secondary">Distance from last {{ appearanceRateValue }}x</h5>
                <span class="bold big">{{ selectedPayoutDistance }}</span>
            </div>
            <div class="analysisItem">
                <h5 class="secondary">Mean Appearance rate of {{ appearanceRateValue }}
                    <div class="tooltip">
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
                        <span class="tooltipText">You can expect this payout to appear every {{ meanAppearanceRate.toFixed(2) }} bets.</span>
                    </div>
                </h5>
                <span class="bold big">{{ meanAppearanceRate.toFixed(2) }}</span>
            </div>
            <div class="analysisItem">
              <span class="bold">Select a payout:
                <div class="tooltip">
                  <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
                  <span class="tooltipText">Select a payout to calculate the appearance rate.</span>
                </div>
              </span>
              <div class="select">
                  <select v-model="appearanceRateValue" class="bold">
                      <option
                      class="bold"
                      v-for="value in [2, 3, 5, 50]"
                      :key="value"
                      :value="value">{{ value }}
                      </option>
                  </select>
              </div>
            </div>
        </div>
        <div class="analysisBox">
            <div class="analysisItem">
                <h5 class="secondary">B2B Chosen:</h5>
                <span class="bold big">{{ B2BChosen }}</span>
            </div>
            <div class="analysisItem">
                <h5 class="secondary">Highest Number of B2B:</h5>
                <span class="bold big">{{ B2BHighest }}</span>
            </div>
            <div class="analysisItem">
                <h5 class="secondary">Total Multiplier:</h5>
                <span class="bold big">{{ B2BTotal }}</span>
            </div>
            <div class="analysisItem">
              <span class="bold">Select a B2B payout:
                <div class="tooltip">
                  <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
                  <span class="tooltipText">Select a payout for Back 2 Back calculations.</span>
                </div>
              </span>
              <div class="select">
                  <select v-model="B2BChosen" class="bold">
                      <option
                      class="bold"
                      v-for="value in [2, 3, 5, 50]"
                      :key="value"
                      :value="value">{{ value }}
                      </option>
                  </select>
              </div>
            </div>
        </div>
        <div class="analysisBox">
          <div class="analysisItem">
              <h5 class="secondary">Distance between each B2B:</h5>
              <span class="bold big">{{ B2BFrequency.slice(-10).join(', ') }}</span>
          </div>
          <div class="analysisItem">
              <h5 class="secondary">
                  Mean appearance rate:
                  <div class="tooltip">
                      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
                      <span class="tooltipText">You can expect another streak of {{ B2BFrequencyChosen }} B2B to appear every {{ B2BFrequencyMean }} bets.</span>
                  </div>
              </h5>
              <span class="bold big">{{ B2BFrequencyMean.toFixed(2) }}</span>
          </div>
          <div class="analysisItem">
              <label for="B2BFrequencyInput">
                  <span>Total B2B Length:</span>
                  <div class="tooltip">
                      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
                      <span class="tooltipText">Select a B2B length to calculate the frequency of appearance for the given B2B.</span>
                  </div>
              </label>
              <input
                  id="B2BFrequencyInput"
                  type="number"
                  min="1.01"
                  max="100000"
                  v-model="B2BFrequencyChosen"
                  @focus="$event.target.select()"
              >
          </div>
        </div>
      </div>
    </div>
    <NotificationsFormWheel :targets="previousResults"></NotificationsFormWheel>
  </div>
  <Feedback></Feedback>
</template>
<script setup>
/* IMPORTS */
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import LineChartWheel from "@/components/LineChartWheel.vue";
import NotificationsFormWheel from "@/components/NotificationsFormWheel.vue";
import Feedback from "@/components/Feedback.vue";
import { 
  updateNumber,
  updateArray,
  updateBooleanVariable,
  getMean,
  getDistanceWheel,
  getMeanAppearanceRateWheel,
  getAppearanceRateWheel,
  getB2BWheel,
  getLastValueArray,
  getUnbrokenArray,
} from "@/helpers/liveGamesHelper.js";

/* VARIABLES */
const      wheelPingInterval = ref(null),
        wheelPingIntervalTime = ref(20000),
                    wheelData = ref(null),
                resultsArray = ref([]),
                  noncesArray = ref([]),
                  lastResult = ref(0),
                    lastNonce = ref(null),
              previousResults = ref([]),
      uncappedPreviousResults = ref([]),
                  liveSignal = ref(false),
          reconnectingSignal = ref(false),
                  cantConnect = ref(false),
          appearanceRateValue = ref(2),
              appearanceRate = ref(0),
          meanAppearanceRate = ref(0),
      selectedPayoutDistance = ref(0),
                    B2BChosen = ref(2),
                  B2BHighest = ref(0),
                    B2BTotal = ref(0),
          B2BFrequencyChosen = ref(2),
                B2BFrequency = ref([]),
            B2BFrequencyMean = ref(0);

/* COMPUTED PROPERTIES */
const coloredPreviousResults = computed(() => {
  const coloredResults = [...previousResults.value].reverse();
  if (coloredResults.length > 0) {
    coloredResults[0] = `<span class="secondary">${coloredResults[0]}</span>`;
  }
  return coloredResults;
});

/* ACTIONS */
const connect = async () => {
  console.log("Connecting");
  const initialResponse = await fetch('https://sphenoid-maple-couch.angel-casas.repl.co/api/');
  if (initialResponse.status === 200) {
    updateBooleanVariable(cantConnect, false);
    fetchResults();
    wheelPingInterval.value = setInterval(() => {
        fetchResults();
    }, wheelPingIntervalTime.value);
  }
  else {
    updateBooleanVariable(cantConnect, true);
  }
};
const disconnect = async () => {
  updateBooleanVariable(liveSignal, false);
  updateBooleanVariable(cantConnect, false);
  updateNumber(lastNonce, null);
  clearInterval(wheelPingInterval.value);
}

const fetchResults = async () => {
  const response = await fetch('https://sphenoid-maple-couch.angel-casas.repl.co/api/wheel');
  if (!response || response.error) {
    updateBooleanVariable(liveSignal, false);
    updateBooleanVariable(reconnectingSignal, true);
  } else {
    updateBooleanVariable(reconnectingSignal, false);
    updateBooleanVariable(liveSignal, true);
    const data = await response.json();
    if (data.length) {
      wheelData.value = data;
      noncesArray.value = wheelData.value.map((object) => object.nonce);
      resultsArray.value = wheelData.value.map((object) => object.result);
      const latestNonce = getLastValueArray(noncesArray.value);
      const latestResult = getLastValueArray(resultsArray.value);
      console.log(latestNonce);
      console.log(latestResult);
      if (lastNonce.value) {
        if (latestNonce > lastNonce.value) {
          updateNumber(lastNonce, latestNonce);
          updateArray(uncappedPreviousResults, {result: latestResult, nonce: latestNonce}); // This array has no limit size.
          updateArray(previousResults, latestResult, 50);
          updateNumber(selectedPayoutDistance, getDistanceWheel(appearanceRateValue.value, uncappedPreviousResults.value));
          updateNumber(appearanceRate, getAppearanceRateWheel(appearanceRateValue.value, uncappedPreviousResults.value));
          updateNumber(meanAppearanceRate, getMeanAppearanceRateWheel(appearanceRateValue.value, uncappedPreviousResults.value));
          let B2B = getB2BWheel(B2BFrequencyChosen, B2BChosen.value, [...uncappedPreviousResults.value].reverse());
          updateNumber(B2BTotal, B2B.B2BTotal);
          updateNumber(B2BHighest, B2B.B2BHighest);
          if(B2B.B2BFrequency.length !== 0) {
            B2BFrequency.value = [...B2B.B2BFrequency];
          }
          updateNumber(B2BFrequencyMean, getMean(B2B.B2BFrequency));
        }
      } else {
        // INITIAL SETUP ONCE CONNECTED, CALLED ONCE
        console.log("INITIAL SETUP");
        updateNumber(lastNonce, latestNonce);
        uncappedPreviousResults.value = getUnbrokenArray([...wheelData.value].reverse()).reverse();
      }
      updateNumber(lastResult, getLastValueArray(wheelData.value).result);
    }
  }
}

/* WATCHERS */
watch(appearanceRateValue, (newValue, oldValue) => {
    if (appearanceRateValue) {
        updateNumber(appearanceRate, getAppearanceRateWheel(appearanceRateValue.value, uncappedPreviousResults.value));
        updateNumber(meanAppearanceRate, getMeanAppearanceRateWheel(appearanceRateValue.value, uncappedPreviousResults.value));
        updateNumber(selectedPayoutDistance, getDistanceWheel(appearanceRateValue.value, uncappedPreviousResults.value));
    }
});

watch(B2BFrequencyChosen, (newValue, oldValue) => {
    if (B2BFrequencyChosen) {
        let B2B = getB2BWheel(B2BFrequencyChosen, B2BChosen.value, [...uncappedPreviousResults.value].reverse());
        if(B2B.B2BFrequency.length !== 0) {
            B2BFrequency.value = [...B2B.B2BFrequency];
        } else {
            B2BFrequency.value = [];
        }
        updateNumber(B2BFrequencyMean, getMean(B2B.B2BFrequency));
    }
});
watch(B2BChosen, (newValue, oldValue) => {
    if (B2BChosen) {
        let B2B = getB2BWheel(B2BFrequencyChosen, B2BChosen.value, [...uncappedPreviousResults.value].reverse());
        if(B2B.B2BFrequency.length !== 0) {
            B2BFrequency.value = [...B2B.B2BFrequency];
        } else {
            B2BFrequency.value = [];
        }
        updateNumber(B2BFrequencyMean, getMean(B2B.B2BFrequency));
    }
});


/* MOUNTED */
onUnmounted(() => {
  clearInterval(wheelPingInterval.value);
});
</script>