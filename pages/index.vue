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
        >
          <template v-slot:append-outer>
            <v-btn @click="reloadChartWithRange" small dark color="blue"
              >Filter by date range</v-btn
            >
          </template>
        </v-text-field>
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
        <skeleton-loader v-if="$fetchState.pending" h="250px"></skeleton-loader>
        <line-chart
          :key="reload"
          v-else
          chart-title="New Registrations"
          :chart-data="regCount"
        />
      </v-col>
      <v-col cols="12" md="6" lg="6">
        <skeleton-loader v-if="$fetchState.pending" h="250px"></skeleton-loader>

        <line-chart
          :key="reload"
          v-else
          chart-title="Transactions Count"
          :chart-data="txCount"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SkeletonLoader from '~/components/SkeletonLoader.vue'
import LineChart from '~/components/charts/LineChart.vue'

export default {
  name: 'IndexPage',
  components: {
    SkeletonLoader,
    LineChart,
  },
  async fetch() {
    const dateToday = new Date()
    const dateStart = new Date(dateToday.getFullYear(), dateToday.getMonth(), 1)

    const start = dateStart.toISOString().split('T')[0]
    const end = dateToday.toISOString().split('T')[0]

    const [regCount, txCount] = await Promise.all([
      this.$axios.get(`/dashboard/new-registrations?from=${start}&to=${end}`),
      this.$axios.get(`/dashboard/transactions-count?from=${start}&to=${end}`),
    ])

    this.regCount = regCount.data
    this.txCount = txCount.data
    this.dates = [start, end]
  },
  fetchOnServer: false,
  data() {
    return {
      regCount: 0,
      txCount: 0,
      dates: [],
      menu: false,
      reload: false,
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
    async reloadChartWithRange() {
      const [start, end] = this.dates

      if (end < start || !start || !end) {
        return
      }

      const [regCount, txCount] = await Promise.all([
        this.$axios.get(`/dashboard/new-registrations?from=${start}&to=${end}`),
        this.$axios.get(
          `/dashboard/transactions-count?from=${start}&to=${end}`
        ),
      ])

      this.regCount = regCount.data
      this.txCount = txCount.data
      this.reload = !this.reload
    },
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
