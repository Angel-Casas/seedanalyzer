<template>
  <div class="tab">
    <div class="configurationTab">
      <div class="inputWrap">
        <label for="legendColorInput">Color of Legends:</label>
        <input
          id="legendColorInput"
          :value="legendColor"
          @input="$emit('update:legendColor', $event.target.value)"
          type="color"
        >
      </div>
      <div class="inputWrap">
        <label for="axisColorInput">Color of Axis:</label>
        <input
          id="axisColorInput"
          :value="axisColor"
          @input="$emit('update:axisColor', $event.target.value)"
          type="color"
        >
      </div>
      <div class="inputWrap">
        <label for="backgroundColorInput">Color of Background:</label>
        <input
          id="backgroundColorInput"
          :value="backgroundColor"
          @input="$emit('update:backgroundColor', $event.target.value)"
          type="color"
        >
      </div>
      <div class="inputWrap">
        <label for="legendFontSizeInput">Font Size of Legend:</label>
        <input
          id="legendFontSizeInput"
          type="number"
          :value="legendFontSize"
          @focus="$event.target.select()"
          @input="$emit('update:legendFontSize', parseFloat($event.target.value))"
          min=12
          max=32
        >
      </div>
      <div class="inputWrap">
        <label for="legendBalanceColorInput">Color of Balance Legend:</label>
        <input
          id="legendBalanceColorInput"
          type="color"
          :value="legendBalanceColor"
          @input="$emit('update:legendBalanceColor', $event.target.value)"
        >
      </div>
      <div class="inputWrap">
        <label for="betAmountColorInput">Color of Bet Amount Legend:</label>
        <input
          id="betAmountColorInput"
          type="color"
          :value="betAmountColor"
          @input="$emit('update:betAmountColor', $event.target.value)"
        >
      </div>
    </div>
    <button @click="saveToLS">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M96.2 200.1C96.07 197.4 96 194.7 96 192C96 103.6 167.6 32 256 32C315.3 32 367 64.25 394.7 112.2C409.9 101.1 428.3 96 448 96C501 96 544 138.1 544 192C544 204.2 541.7 215.8 537.6 226.6C596 238.4 640 290.1 640 352C640 422.7 582.7 480 512 480H144C64.47 480 0 415.5 0 336C0 273.2 40.17 219.8 96.2 200.1z"/></svg>
      Save
    </button>
    <button @click="reset">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M180.2 243.1C185 263.9 162.2 280.2 144.1 268.8L119.8 253.6l-50.9 81.43c-13.33 21.32 2.004 48.98 27.15 48.98h32.02c17.64 0 31.98 14.32 31.98 31.96c0 17.64-14.34 32.05-31.98 32.05H96.15c-75.36 0-121.3-82.84-81.47-146.8L65.51 219.8L41.15 204.5C23.04 193.1 27.66 165.5 48.48 160.7l91.43-21.15C148.5 137.7 157.2 142.9 159.2 151.6L180.2 243.1zM283.1 78.96l41.25 66.14l-24.25 15.08c-18.16 11.31-13.57 38.94 7.278 43.77l91.4 21.15c8.622 1.995 17.23-3.387 19.21-12.01l21.04-91.43c4.789-20.81-17.95-37.05-36.07-25.76l-24.36 15.2L337.4 45.14c-37.58-60.14-125.2-60.18-162.8-.0617L167.2 56.9C157.9 71.75 162.5 91.58 177.3 100.9c14.92 9.359 34.77 4.886 44.11-10.04l7.442-11.89C241.6 58.58 270.9 59.33 283.1 78.96zM497.3 301.3l-16.99-27.26c-9.336-14.98-29.06-19.56-44.04-10.21c-14.94 9.318-19.52 29.15-10.18 44.08l16.99 27.15c13.35 21.32-1.984 49-27.14 49h-95.99l.0234-28.74c0-21.38-25.85-32.09-40.97-16.97l-66.41 66.43c-6.222 6.223-6.222 16.41 .0044 22.63l66.42 66.34c15.12 15.1 40.95 4.386 40.95-16.98l-.0234-28.68h95.86C491.2 448.1 537.2 365.2 497.3 301.3z"/></svg>
      Reset
    </button>
  </div>
</template>

<script setup>
/* IMPORT */
import { inject } from "vue"
import { grabFromLocalStorage, setThemeValues, createDefaultChartTheme } from "@/helpers/helpers"
import useEventsBus from "@/composables/eventBus";

/* PROPS */

const props = defineProps({
  legendColor: String,
  legendFontSize: Number,
  legendBalanceColor: String,
  axisColor: String,
  backgroundColor: String,
  betAmountColor: String,
})

/* EMITS */

const emit = defineEmits([ "update:legendColor", "update:legendFontSize", "update:axisColor", "update:backgroundColor", "update:legendBalanceColor", "update:betAmountColor" ])

/* INJECTS */

const theme = inject("currentTheme");

/* DATA */

const { emitBus } = useEventsBus();

const saveToLS = () => {
  let chartTheme;
  if (localStorage.chartTheme) {
    chartTheme = grabFromLocalStorage("chartTheme");
  } else {
    chartTheme = createDefaultChartTheme();
  }
  setThemeValues(chartTheme, props, theme.value);
  try {
    localStorage.setItem("chartTheme", JSON.stringify(chartTheme));
    emitBus('notify', {
      type: 'success',
      title: 'Styles saved',
      message: 'Enjoy your new look!',
      action: 'close'
    });
  } catch(error) {
    emitBus('notify', {
    type: 'error',
    title: 'Error saving',
    message: 'Please try again.',
    action: 'retry'
  });
  }
}

const reset = async () => {
  await emit("update:legendColor", theme.value === "light" ? "#FFFFFF" : "#000000");
  await emit("update:legendFontSize", 16);
  await emit("update:axisColor", theme.value === "light" ? "#FFFFFF" : "#000000");
  await emit("update:backgroundColor", theme.value === "light" ? "#003AE8" : "#59FFAC");
  await emit("update:legendBalanceColor", theme.value === "light" ? "#FE5252" : "#0000FF");
  await emit("update:betAmountColor", theme.value === "light" ? "#00FFFF" : "#8C0000");
  saveToLS();
}
</script>