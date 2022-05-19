<template>
  <v-container>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="100px"
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="dateRangeText"
          label="Date Range"
          persistent-hint
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="dates"
        range
        no-title
        @input="menu = false"
      ></v-date-picker>
    </v-menu>
    <v-row class="d-flex justify-space-beetween">
      <v-col cols="12" md="6" lg="6">
        <line-chart chart-title="New Registrations" :chart-data="regCount" />
      </v-col>
      <v-col cols="12" md="6" lg="6">
        <line-chart chart-title="Transactions Count" :chart-data="txCount" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LineChart from '~/components/charts/LineChart.vue'

export default {
  name: 'IndexPage',
  components: {
    LineChart,
  },
  async asyncData({ $axios }) {
    const dateToday = new Date()
    const dateStart = new Date(dateToday.getFullYear(), dateToday.getMonth(), 1)

    const start = dateStart.toISOString().split('T')[0]
    const end = dateToday.toISOString().split('T')[0]

    const [regCount, txCount] = await Promise.all([
      $axios.get(`/dashboard/new-registrations?from=${start}&to=${end}`),
      $axios.get(`/dashboard/transactions-count?from=${start}&to=${end}`),
    ])

    return {
      regCount: regCount.data,
      txCount: txCount.data,
      dates: [start, end],
    }
  },
  data() {
    return {
      menu: false,
    }
  },
  computed: {
    dateRangeText() {
      return this.dates.join(' ~ ')
    },
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date)
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
  },
}
</script>
