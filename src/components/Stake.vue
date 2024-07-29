<template>
    <div class="tab">
        <h3 class="primary">Stake Live Crash</h3>
        <div class="wrapCollapsible">
            <input id="informationCollapsible" class="toggle" type="checkbox">
            <label @click="" for="informationCollapsible" class="collapsibleLabel" tabindex="0">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M169.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 274.7 54.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                What is Stake crash?
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M169.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 274.7 54.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
            </label>
            <div class="collapsibleContent">
                <div>
                    <img class="crashImage" width="200" src="/images/stake/crashIcon.png" alt="">
                    <div class="informationText">
                        <p><span class="bold">Crash</span> is a popular crypto game at Stake casino that operates similarly to <span class="bold">a guessing game with quick rounds lasting just a few seconds</span>. It is played on a simple graph that shows the multipliers listed on the vertical line and the number of seconds on the horizontal base. <span class="bold">The goal of the game is to have the yellow line hit or go above the chosen cash out point in order to win</span>. Players can cash out early at the rate of the multiplier shown on the screen, but they need to pay close attention because rounds are over quickly!</p>
                        <a href="https://stake.com/?c=0e3edf3011" target="_blank" class="bold big mainBlue">
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M156.6 384.9L125.7 354c-8.5-8.5-11.5-20.8-7.7-32.2c3-8.9 7-20.5 11.8-33.8L24 288c-8.6 0-16.6-4.6-20.9-12.1s-4.2-16.7 .2-24.1l52.5-88.5c13-21.9 36.5-35.3 61.9-35.3l82.3 0c2.4-4 4.8-7.7 7.2-11.3C289.1-4.1 411.1-8.1 483.9 5.3c11.6 2.1 20.6 11.2 22.8 22.8c13.4 72.9 9.3 194.8-111.4 276.7c-3.5 2.4-7.3 4.8-11.3 7.2v82.3c0 25.4-13.4 49-35.3 61.9l-88.5 52.5c-7.4 4.4-16.6 4.5-24.1 .2s-12.1-12.2-12.1-20.9V380.8c-14.1 4.9-26.4 8.9-35.7 11.9c-11.2 3.6-23.4 .5-31.8-7.8zM384 168a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>
                            JOIN STAKE
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
                <label for="cf_clearance">cf_clearance:</label>
                <input type="text" id="cf_clearance" v-model="cf_clearance">
                <label for="user_agent">User_agent:</label>
                <input type="text" id="user_agent" v-model="user_agent">
                <button v-if="liveSignal" @click="disconnect">Disconnect</button>
                <button v-else @click="connect">Connect</button>
            </div>
            <span v-if="cantConnect">Cant connect? <a class="setCloudflare" href="https://stake.com/" target="_blank">Try opening up this stake website to set the cloudflare cookie!</a></span>
            <div class="resultBox">
                <p>Last result - <span class="bold big primary">{{ displayLastResult }}x</span></p>
                <p>Previous results - <span class="bold overflowX" v-html="coloredPreviousResults.join(', ')"></span></p>
            </div>
            <LineChart :targets="uncappedPreviousResults"></LineChart>
            <h4 class="primary bigMarginTop">Statistical Analysis</h4>
            <div class="statisticalAnalysisBox">
                <div class="analysisBox">
                    <div class="analysisItem">
                        <h5 class="secondary">Biggest payout:</h5>
                        <span class="bold big">{{ biggestPayout }}</span>
                    </div>
                    <div class="analysisItem">
                        <h5 class="secondary">Distance from biggest payout:</h5>
                        <span class="bold big">{{ distanceFromBiggest }}</span>
                    </div>
                </div>
                <div class="analysisBox">
                    <div class="analysisItem">
                        <h5 class="secondary">Appearance rate of > {{ appearanceRateValue }} / total results:</h5>
                        <span class="bold big">{{ appearanceRate }} / {{ uncappedPreviousResults.length }}</span>
                    </div>
                    <div class="analysisItem">
                        <h5 class="secondary">Distance from last > {{ appearanceRateValue }}x</h5>
                        <span class="bold big">{{ selectedPayoutDistance }}</span>
                    </div>
                    <div class="analysisItem">
                        <h5 class="secondary">Mean Appearance rate of > {{ appearanceRateValue }}
                            <div class="tooltip">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
                                <span class="tooltipText">You can expect this payout to appear every {{ meanAppearanceRate.toFixed(2) }} bets.</span>
                            </div>
                        </h5>
                        <span class="bold big">{{ meanAppearanceRate.toFixed(2) }}</span>
                    </div>
                    <div class="analysisItem">
                        <label for="medianPayoutAppearanceInput">
                            <span>Payout:</span>
                            <div class="tooltip">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
                                <span class="tooltipText">Select a payout to calculate the appearance rate.</span>
                            </div>
                        </label>
                        <input
                            id="medianAppearanceInput"
                            type="number"
                            min="1.01"
                            max="100000"
                            v-model="appearanceRateValue"
                            @focus="$event.target.select()"
                        >
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
                        <label for="B2BInput">
                            <span>Select B2B payout:</span>
                            <div class="tooltip">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>
                                <span class="tooltipText">Select a payout to calculate Back 2 Back appearances.</span>
                            </div>
                        </label>
                        <input
                            id="B2BInput"
                            type="number"
                            min="1.01"
                            max="100000"
                            v-model="B2BChosen"
                            @focus="$event.target.select()"
                        >
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
                <Heatmap :targets="uncappedPreviousResults"></Heatmap>
            </div>
            <NotificationsForm :targets="previousResults"></NotificationsForm>
        </div>
    </div>
    <Feedback></Feedback>
</template>
<script setup>
/* IMPORTS */
import { ref, watch, computed, onMounted } from "vue";
import { StakeAPI } from "@/helpers/api";
import Heatmap from "@/components/Heatmap.vue";
import LineChart from "@/components/LineChart.vue";
import NotificationsForm from "@/components/NotificationsForm.vue";
import Feedback from "@/components/Feedback.vue";
import axios from "axios";
import { 
    updateNumber,
    updateArray,
    updateBooleanVariable,
    updateDisplayLastResult,
    getMean,
    getDistance,
    getMeanAppearanceRate,
    getAppearanceRate,
    getB2B
} from "@/helpers/liveGamesHelper.js";

/* VARIABLES */
const             lastResult = ref(0.00),
           displayLastResult = ref(lastResult),
             previousResults = ref([]),
     uncappedPreviousResults = ref([]),
                  liveSignal = ref(false),
          reconnectingSignal = ref(false),
                 cantConnect = ref(false),
               biggestPayout = ref(0),
         distanceFromBiggest = ref(0),
         appearanceRateValue = ref(2),
              appearanceRate = ref(0),
          meanAppearanceRate = ref(0),
      selectedPayoutDistance = ref(0),
                       stake = ref(null),
                         raw = ref(null),
                   B2BChosen = ref(2),
                  B2BHighest = ref(0),
                    B2BTotal = ref(0),
          B2BFrequencyChosen = ref(2),
                B2BFrequency = ref([]),
            B2BFrequencyMean = ref(0),
                cf_clearance = 'KMvRp3W6n0P2l86kPY14Ky4XuKpSeZYdiW77keiowls-1715701832-1.0.1.1-NF2r8bug3uIMYgCp7JwpN4p4livS6GJyIEcG.Gli8K.qx8FcwOkOeDBjCuI4.4gHfdHEz5Gfe_pjaoj5hM.eUw',
                  user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              stakeWSS = 'wss://stake.com/_api/websockets',
              url = 'https://api.stake.com/crash/history',
              x_access_token = '169ce009b6954f833d994e1cbd525e0964bfad72567902e922f4e70c20f1f3b049d7f8384dd0e9589da1bd8f3723d348';


/* ACTIONS */
const connect = async () => {
    try {
        console.log('TRYING TO CONNECT');
        const payload = {
            limit: 1,
            offset: 1
        }
        const response = await axios.post(url, payload, {
            headers: {
                'x_access_token': x_access_token,
                'Content-Type': 'application/json'
            }
        });

        console.log(response);
    } catch (error) {
        console.log('Failed to connect to API');
        
        if (error.response) {
            console.log('Error Data:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
        } else if (error.request) {
            console.log('Error Request:', error.request);
        } else {
            console.log('Error Message:', error.message);
        }

        console.log('Error Config:', error.config);
    }


    // stake.value = new StakeAPI(stakeWSS, cf_clearance, user_agent);
    // console.log(stake.value);
    // if (stake) {
    //     try {
    //         const isConnected = await stake.value.connect();
    //         if (isConnected) {
    //             updateBooleanVariable(liveSignal, true); // Set liveSignal value to true when connected
    //             updateBooleanVariable(cantConnect, false);
    //             stake.value.startConnectionChecker((response) => {
    //                 raw.value = response;
    //                 updateBooleanVariable(liveSignal, true); // Update liveSignal value to true when connection is maintained
    //             }, (isConnected) => {
    //                 updateBooleanVariable(liveSignal, isConnected); // Update liveSignal value to false when disconnected or failed to reconnect
    //                 if (!isConnected) {
    //                     updateBooleanVariable(reconnectingSignal, true);
    //                 } else {
    //                     updateBooleanVariable(reconnectingSignal, false);
    //                 }
    //             });
    //         } else {
    //             updateBooleanVariable(liveSignal, false); // Set liveSignal value to false when not connected
    //             updateBooleanVariable(cantConnect, true);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         updateBooleanVariable(liveSignal, false);
    //     }
    // }
}
const disconnect = async () => {
    stake.value.disconnect();
    updateBooleanVariable(liveSignal, false);
}

/* COMPUTED PROPERTIES */
const coloredPreviousResults = computed(() => {
  const coloredResults = [...previousResults.value].reverse();
  if (coloredResults.length > 0) {
    coloredResults[0] = `<span class="secondary">${coloredResults[0]}</span>`;
  }
  return coloredResults;
});

/* WATCHER */
watch(raw, (newRaw, oldRaw) => {
    if (newRaw) {
        if (oldRaw && newRaw.startTime !== oldRaw.startTime) {
            const roundedResult = Math.round((newRaw.crashpoint + Number.EPSILON) * 100) / 100;
            updateDisplayLastResult(displayLastResult, lastResult.value, roundedResult);
            updateNumber(lastResult, roundedResult);
            updateArray(previousResults, roundedResult, 50);
            updateArray(uncappedPreviousResults, roundedResult); // This array has no limit size.
            updateNumber(biggestPayout, Math.max(...uncappedPreviousResults.value))
            updateNumber(distanceFromBiggest, getDistance(biggestPayout.value, uncappedPreviousResults.value));
            updateNumber(selectedPayoutDistance, getDistance(appearanceRateValue.value, uncappedPreviousResults.value));
            updateNumber(appearanceRate, getAppearanceRate(appearanceRateValue.value, uncappedPreviousResults.value));
            updateNumber(meanAppearanceRate, getMeanAppearanceRate(appearanceRateValue.value, uncappedPreviousResults.value));
            let B2B = getB2B(B2BFrequencyChosen, B2BChosen.value, uncappedPreviousResults.value);
            updateNumber(B2BTotal, B2B.B2BTotal);
            updateNumber(B2BHighest, B2B.B2BHighest);
            if(B2B.B2BFrequency.length !== 0) {
                B2BFrequency.value = [...B2B.B2BFrequency];
            }
            updateNumber(B2BFrequencyMean, getMean(B2B.B2BFrequency));
        }
    }
});

watch(appearanceRateValue, (newValue, oldValue) => {
    if (appearanceRateValue) {
        updateNumber(appearanceRate, getAppearanceRate(appearanceRateValue.value, uncappedPreviousResults.value));
        updateNumber(meanAppearanceRate, getMeanAppearanceRate(appearanceRateValue.value, uncappedPreviousResults.value));
        updateNumber(selectedPayoutDistance, getDistance(appearanceRateValue.value, uncappedPreviousResults.value));
    }
});

watch(B2BFrequencyChosen, (newValue, oldValue) => {
    if (B2BFrequencyChosen) {
        let B2B = getB2B(B2BFrequencyChosen, B2BChosen.value, uncappedPreviousResults.value);
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
        let B2B = getB2B(B2BFrequencyChosen, B2BChosen.value, uncappedPreviousResults.value);
        if(B2B.B2BFrequency.length !== 0) {
            B2BFrequency.value = [...B2B.B2BFrequency];
        } else {
            B2BFrequency.value = [];
        }
        updateNumber(B2BFrequencyMean, getMean(B2B.B2BFrequency));
    }
});
</script>