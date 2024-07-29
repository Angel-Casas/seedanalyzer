<template>
<div class="lineChartContainer">
    <apexchart :key="chartSeries.length" class="lineChart" type="line" height="400" :options="chartOptions" :series="chartSeries" />
</div>
</template>

<script setup>
/* IMPORTS */
import { ref, watch, inject, computed, onMounted, onUnmounted } from "vue";

/* PROPS */
const props = defineProps({
    targets: Array
});

/* - THEME - INJECT */
const theme = inject("currentTheme");

/* VARIABLES */
const windowSize = ref(window.innerWidth);

const initializeChartSeries = () => {
  const series = [];
  const maxRows = windowSize.value > 750 ? 10 : 5;
  const maxColumns = windowSize.value > 750 ? 100 : 25;
  const name = "CrashResults";
  const data = [];
  let count = 0;
  for (let i = maxColumns; i >= 0; i--) {
    if (props.targets[props.targets.length-1]) {
      data.push({ x: props.targets.length - 1 -count, y: props.targets[props.targets.length-1-count] });
      count++;
    }
    if (count === 100) break;
  }
  series.push({
    name: name,
    data: data
  });
  return series;
};

const chartSeries = ref(initializeChartSeries());

/* METHODS */

function updateChartSeries(targets) {
  chartSeries.value.data = props.targets.map((val, index) => {
    return { x: index + 1, y: val }
  });
};

/* COMPUTED */

const chartOptions = computed(() => {
  return {
  chart: { 
    type: "line",
    toolbar: { show: false },
    foreColor: theme.value === "dark" ? "white" : "black",
    zoom: {
      enabled: true,
      type: 'xy'
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return val === 0 ? '' : val;
    },
    style: {
      fontSize: '5px',
      fontWeight: 'bold',
      colors: theme.value === "dark" ? ["#222222"] : ["white"],
    },
    background: {
      enabled: true,
      foreColor: theme.value === "dark" ? "#59FFAC" : "#0250C6",
      borderColor: theme.value === "dark" ? "#222222" : "white",
      opacity: 0.5,
    },
  },
  title: { 
    text: "Crash Results",
    style: { color: theme.value === "dark" ? "#59FFAC" : "#0250C6" },
    align: "center"
  },
  xaxis: {
    title: {
      text: "Nonce",
      style: {
        color: theme.value === "dark" ? "#59FFAC" : "#0250C6",
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
        color: theme.value === "dark" ? "#59FFAC" : "#0250C6",
        fontWeight: 600,
      },
    },
    tooltip: {
      enabled: true
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: ['#FDD835'],
      shadeIntensity: 1,
      type: 'vertical',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: '#FF0000' // red for low y-axis values
        },
        {
          offset: 25,
          color: '#FFFF00' // yellow for mid-range y-axis values
        },
        {
          offset: 1000,
          color: '#00FF00' // green for high y-axis values
        }
      ]
    }
  },
  grid: { borderColor: theme.value === "dark" ? "#59FFAC" : "#0250C6"},
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
  }]
  }
});

/* MOUNTED */
onMounted(() => {
    window.addEventListener('resize', () => {
      windowSize.value = window.innerWidth;
      chartSeries.value = initializeChartSeries();
      updateChartSeries(props.targets);
    });
});

onUnmounted(() => {
    window.removeEventListener('resize', () => {windowSize.value = window.innerWidth})
});

/* WATCHERS */

watch(props.targets, (newTargets, oldTargets) => {
  chartSeries.value = initializeChartSeries();
  updateChartSeries(newTargets);
});
</script>