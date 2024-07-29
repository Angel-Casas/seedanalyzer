<template>
<div class="notificationSoundWrapper">
    <h3 class="primary">Notifications</h3>
    <div class="notificationSoundBox">
        <div class="notificationBox">
            <p class="bold">Enable sound notification when a given payout shows up?</p>
            <div class="notificationItem">
                <div class="select">
                    <select v-model="selectedPayout" class="bold">
                        <option
                        class="bold"
                        v-for="value in [2, 3, 5, 50]"
                        :key="value"
                        :value="value">{{ value }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="notificationItem">
                <label class="togglerWrapper notificationLabel" for="payoutNotificationInput">
                    <input type="checkbox" id="payoutNotificationInput" v-model="isPayoutNotification">
                    <div class="togglerSlider">
                        <div class="togglerKnob"></div>
                    </div>
                </label>
            </div>
            <p class="bold">Enable sound notification for B2B?</p>
            <div class="notificationItem">
                <div class="select">
                    <select v-model="B2BTarget" class="bold">
                        <option
                        class="bold"
                        v-for="value in [2, 3, 5, 50]"
                        :key="value"
                        :value="value">{{ value }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="notificationItem">
                <label for="B2BLengthInput">Select B2B Length:</label>
                <input
                    id="B2BLengthInput"
                    type="number"
                    min="2"
                    max="100000"
                    v-model="B2BLength"
                    @focus="$event.target.select()"
                >
            </div>
            <div class="notificationItem">
                <label class="togglerWrapper notificationLabel" for="B2BNotificationInput">
                    <input type="checkbox" id="B2BNotificationInput" v-model="isB2BNotification">
                    <div class="togglerSlider">
                        <div class="togglerKnob"></div>
                    </div>
                </label>
            </div>
            <p class="bold">Select your prefered sound!</p>
            <div class="notificationItem">
                <div class="select">
                    <select v-model="selectedSound" class="bold">
                        <option
                        class="bold"
                        v-for="sound in notificationSounds"
                        :key="sound"
                        :value="sound">{{ sound }}
                        </option>
                    </select>
                </div>
                <button @click="playSound">Play</button>
            </div>
        </div>
    </div>
</div>
</template>
<script setup>
/* IMPORTS */
import { ref, inject, watch, onMounted } from "vue";

/* PROPS */
const props = defineProps({
    targets: Array,
});

/* - THEME - INJECT */

const theme = inject("currentTheme");

/* VARIABLES */

const       selectedPayout = ref(2),
               B2BTarget = ref(2),
               B2BLength = ref(2),
    isPayoutNotification = ref(false),
       isB2BNotification = ref(false),
        notificationSounds = ref([
            "Black",
            "Red",
            "Blue",
            "Yellow"
        ]),
        selectedSound = ref(selectedPayout === 2 ? notificationSounds[0] : selectedPayout === 3 ? notificationSounds[1] : selectedPayout === 5 ? notificationSounds[2] : notificationSounds[3]);

let selectedSoundAudio = new Audio(`./sounds/${selectedPayout.value}.mp3`);

/* ACTIONS */
const playSound = () => {
    selectedSoundAudio.play();
}

const checkLogic = () => {
    if (isPayoutNotification.value) {
        if (props.targets[props.targets.length - 1] === selectedPayout.value) {
            playSound();
        }
    }
    if (isB2BNotification.value) {
        let counter = 0;
        for (let i = props.targets.length-1; i>props.targets.length-1-B2BLength.value; i--) {
            if (props.targets[i] === B2BTarget.value) {
                counter += 1;
                if (counter >= B2BLength.value) {
                    playSound();
                    break;
                }
            } else {
                counter = 0;
                break;
            }
        }
    }
}

/* MOUNTED */
onMounted(() => {
    const localSound = JSON.parse(localStorage.getItem("notificationSoundWheel"));
    if (localSound) {
        selectedPayout.value = localSound;
    }
});

/* WATCHER */
watch(selectedPayout, (newValue, oldValue) => {
    if (selectedPayout.value) {
        // Do something
    }
});
watch(props.targets, (newValue, oldValue) => {
    checkLogic();
});
watch(selectedPayout, (newValue, oldValue) => {
    if (selectedPayout.value) {
        localStorage.setItem("notificationSoundWheel", JSON.stringify(newValue));
        selectedSoundAudio = new Audio(`./sounds/${selectedPayout.value}.mp3`);
    }
});
</script>