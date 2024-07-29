<template>
<div class="lineChartContainer">
    <apexchart :key="chartSeries.length" class="lineChart" type="area" height="400" :options="chartOptions" :series="chartSeries" />
    <button v-for="series in chartSeries" :key="series.name" @click="toggleVisible(series.name)">
      {{ series.name }} {{ series.visible ? 'Visible' : 'Hidden' }}
    </button>
    <button @click="toggleDataLabel">Enable Data Labels</button>
</div>
</template>

<script setup>
/* IMPORTS */
import { ref, inject, computed, watch } from "vue";

/* PROPS */
const props = defineProps({
    targets: Array
});

/* - THEME - INJECT */
const theme = inject("currentTheme");
const textColor = ref(theme.value === "dark" ? "white" : "black");
const foregroundColor = ref(theme.value === "dark" ? "black" : "white");
const backgroundColor = ref(theme.value === "dark" ? "white" : "black");
const borderColor = ref(theme.value === "dark" ? "#222222" : "white");
const accentColor = ref(theme.value === "dark" ? "#59FFAC" : "#0250C6");

/* VARIABLES */

const payouts = ref([2, 3, 5, 50]);

const visibleSeries = ref({
  2: true,
  3: true,
  5: true,
  50: true,
});

const isDataLabel = ref(false);

/* METHODS */


function toggleVisible(name) {
  visibleSeries.value[name] = !visibleSeries.value[name];
};

function toggleDataLabel() {
  isDataLabel.value = !isDataLabel.value;
};

/* COMPUTED */

const chartSeries = computed(() => {
  const chartData = [];
  payouts.value.forEach((series, i) => {
    const seriesData = [];
    props.targets.forEach((target, j) => {
      const yValue = target.result === series ? (series === 2 ? 2 : series === 3 ? 3 : series === 5 ? 5 : series === 50 ? 10 : 0) : 0;
      seriesData.push({
        x: target.nonce,
        y: yValue
      });
    });
    chartData.push({
      name: series,
      data: seriesData,
      visible: visibleSeries.value[series],
      color: i === 0 ? theme.value === "dark" ? "White" : "#808080" : i === 1 ? "#FF3030" : i === 2 ? "#30A1FF" : "#FFD930",
      originalColor: i === 0 ? theme.value === "dark" ? "White" : "#808080" : i === 1 ? "#FF3030" : i === 2 ? "#30A1FF" : "#FFD930"
    });
  });
  return chartData;
});

const chartOptions = computed(() => {
  return {
    chart: { 
      type: "area",
      toolbar: { show: false },
      foreColor: textColor.value,
      zoom: {
        enabled: true,
        type: 'xy'
      }
    },
    dataLabels: {
      enabled: isDataLabel.value,
      formatter: function (val, opts) {
        return val === 0 ? '' : val;
      },
      style: {
        fontSize: '5px',
        fontWeight: 'bold',
        colors: [foregroundColor.value],
      },
      background: {
        enabled: true,
        foreColor: backgroundColor.value,
        borderColor: borderColor.value,
        opacity: 0.5,
      },
    },
    title: { 
      text: "Crash Results",
      style: { color: accentColor.value },
      align: "center"
    },
    xaxis: {
      range: props.targets.length-1 >= 200 ? 200 : props.targets.length-1,
      title: {
        text: "Nonce",
        style: {
          color: accentColor.value,
          fontWeight: 600,
        },
        position: 'bottom',
      },
      tickAmount: 20,
      labels: {
        style: {
          colors: "#008FFB",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#008FFB",
        },
      },
      axisTicks: {
        show: true,
      },
      axisBorder: {
          show: true,
          color: "#008FFB"
        },
      title: {
        text: 'Payout (x)',
        style: {
          color: accentColor.value,
          fontWeight: 600,
        },
      },
      tooltip: {
        enabled: true
      }
    },
    grid: { borderColor: accentColor.value },
    tooltip: { theme: theme.value },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40
    },
    responsive: [{
      breakpoint: 750,
      options: {
        xaxis: {
          tickAmount: 10,
        },
      },
    }],
    colors: chartSeries.value.filter((series) => series.visible).map((series) => series.color), // use visible series colors only
    series: chartSeries.value.filter((series) => series.visible)
      .map((series) => { 
        return{ name: series.name, data: series.data, visible: series.visible, color: series.originalColor } 
      }),
  };
});

/* WATCHERS */
watch(() => theme.value,() => {
  if (theme.value === "dark") {
    textColor.value = "white";
    foregroundColor.value = "#59FFAC";
    backgroundColor.value = "white";
    borderColor.value = "#222222";
    accentColor.value = "#59FFAC";
  } else {
    textColor.value = "black";
    foregroundColor.value = "#0250C6";
    backgroundColor.value = "black";
    borderColor.value = "white";
    accentColor.value = "#0250C6";
  }
});

</script>