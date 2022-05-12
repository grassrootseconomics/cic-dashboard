<template>
  <client-only>
    <v-card elevation="0" outlined>
      <v-card-text>
        <v-card-subtitle class="black--text">
          {{ chartTitle }}
        </v-card-subtitle>
        <ApexChart
          height="250"
          width="100%"
          type="area"
          :options="chartOptions"
          :series="seriesData"
        ></ApexChart>
      </v-card-text>
    </v-card>
  </client-only>
</template>

<script>
export default {
  props: {
    chartData: {
      type: Array,
      required: true,
    },
    chartTitle: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chartOptions: {
        tooltip: {
          y: {
            title: {
              formatter: () => 'count',
            },
          },
        },
        chart: {
          toolbar: {
            show: false,
          },
          type: 'line',
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: true,
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5,
          },
        },
        xaxis: {
          type: 'datetime',
        },
      },

      seriesData: [
        {
          data: this.chartData,
        },
      ],
    }
  },
}
</script>
