<template>
<div class="heatmapContainer">
  <apexchart class="heatmap" type="heatmap"  height="400" :options="chartOptions" :series="chartSeries"></apexchart>
  <span class="informationChart">The <span class="bold">y-axis</span> represents <span class="bold">the amount of payouts of a certain x-axis value that appear within a certain bet range</span> so, for example, the first y-axis value (1) for the first x-axis value (2) is based on the number of appearances of a value greater than X (2) in the last "X * Y * 5" bets(2 * 1 * 5, so in the last 10 bets). The same is true for the second y-axis value (2), with an x-value of (2), it will look for the number of payouts higher that X (2) in the range "X * Y * 5" (2 * 2 * 5, starting from the ending of the last range, 10, up to the previous 20 results).</span>
</div>
</template>
    
<script setup>
/* IMPORTS */

import { ref, computed, watch, inject, onMounted, onUnmounted } from "vue";
  
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
  for (let i = 1; i <= maxRows; i++) {
    const name = i;
    const data = [];
    for (let j = 2; j <= maxColumns; j++) {
      data.push({
        x: String(j),
        y: null
      });
    }
    series.push({
      name: name,
      data: data
    });
  }
  return series;
};

const chartSeries = ref(initializeChartSeries());

  
/* METHODS */

function updateChartSeries(targets) {
  chartSeries.value.forEach((series, i) => {
    series.data.forEach((data, j) => {
      let x = Number(data.x);
      let value = 0;
      for (let k = 0 + i*5*x; k < targets.length && k < (i+1)*5*x; k++) {
        if (targets[k] >= x) {
          value++;
        }
      }
      // console.log('Found: ' + value + ' values above ' + x + ' in the range [' + (i*10*x) + ' - ' + ((i+1)*10*x)  + ']. Targets length: ' + targets.length + '.');
      if (Number(x) === x) {
        data.y = value;
      }
    });
  });
}

/* COMPUTED */

const chartOptions = computed(() => {
  return {
  chart: { 
    type: "heatmap",
    toolbar: { show: false },
    foreColor: theme.value === "dark" ? "white" : "black",
    zoom: {
      enabled: true,
      type: 'xy'
    }
  },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      colorScale: {
        ranges: [
          {
            from: 0,
            to: 2,
            name: '0-2',
            color: '#6430B4',
          },
          {
            from: 2,
            to: 4,
            name: '2-4',
            color: '#3C30B4',
          },
          {
            from: 4,
            to: 6,
            name: '4-6',
            color: '#3056B4',
          },
          {
            from: 6,
            to: 8,
            name: '6-8',
            color: '#3096B4',
          },
          {
            from: 8,
            to: 15,
            name: '8-10',
            color: '#30B492',
          },
          {
            from: 15,
            to: 25,
            name: '10-12',
            color: '#30B456',
          },
          {
            from: 25,
            to: 50,
            name: '12-15',
            color: '#4AB430',
          },
          {
            from: 50,
            to: 100,
            name: '15-20',
            color: '#C5E03B',
          },
          {
            from: 100,
            to: 200,
            name: '20-50',
            color: '#E0863B',
          },
          {
            from: 200,
            to: 400,
            name: '50-100',
            color: '#E03B3B',
          },
        ],
      },
    },
  },
  dataLabels: {
    enabled: false,
    formatter: function (val, opts) {
      return val === 0 ? '' : val;
    },
    style: {
      fontSize: '5px',
      fontWeight: 'bold',
      colors: ['white'],
    },
  },
  stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
  title: { 
    text: "Crash Heatmap",
    style: { color: theme.value === "dark" ? "#59FFAC" : "#0250C6" },
    align: "center"
  },
  xaxis: {
    title: {
      text: "Payout (x)",
      offsetX: 0,
      offsetY: -20,
      style: {
        color: theme.value === "dark" ? "#59FFAC" : "#0250C6",
        fontWeight: 600,
      },
      position: 'bottom',
    },
    tickAmount: 50,
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
    title: {
      text: 'Appearance rate',
      offsetX: 10,
      offsetY: 0,
      style: {
        color: theme.value === "dark" ? "#59FFAC" : "#0250C6",
        fontWeight: 600,
      },
    },
  },
  tooltip: {
    enabled: false,
  },
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