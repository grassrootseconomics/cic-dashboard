<template>
  <v-container>
    <skeleton-loader v-if="reload" h="100px"></skeleton-loader>
    <v-card v-else shaped elevation="0" class="mb-4">
      <v-card-title
        >{{ tokenInfo.token_name }} ({{ tokenInfo.token_symbol }})</v-card-title
      >
      <v-card-text>
        <v-row class="d-flex justify-space-beetween">
          <v-col cols="12" sm="6" lg="4">
            <info-card
              icon="mdi-pound"
              title="All-time Transactions"
              :sub-title="allTransactionsCount.toLocaleString()"
              color="blue"
            >
            </info-card>
          </v-col>
          <v-col cols="12" sm="6" lg="4">
            <info-card
              icon="mdi-pickaxe"
              title="Total Supply"
              :sub-title="`${tokenInfo.token_total_supply.toLocaleString()} ${
                tokenInfo.token_symbol
              }`"
              color="red"
            >
            </info-card>
          </v-col>
          <v-col cols="12" sm="6" lg="4">
            <info-card
              icon="mdi-wallet"
              title="Holders"
              :sub-title="uniqueHolders.toLocaleString()"
              color="green"
            >
            </info-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card outlined>
      <v-card-text>
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
              <template #append-outer>
                <v-btn small dark color="blue" @click="reloadChartWithRange"
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
            <skeleton-loader
              v-if="$fetchState.pending"
              h="250px"
            ></skeleton-loader>
            <line-chart
              v-else
              :key="reload"
              chart-title="Transactions"
              :chart-data="tokenTxCount"
            />
          </v-col>
          <v-col cols="12" md="6" lg="6">
            <skeleton-loader
              v-if="$fetchState.pending"
              h="250px"
            ></skeleton-loader>

            <line-chart
              v-else
              :key="reload"
              chart-title="Volume (KES)"
              :chart-data="tokenVolume"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import InfoCard from '~/components/InfoCard.vue'
import LineChart from '~/components/charts/LineChart.vue'
import SkeletonLoader from '~/components/SkeletonLoader.vue'

export default {
  name: 'TokenInfoPage',
  components: {
    SkeletonLoader,
    InfoCard,
    LineChart,
  },
  data() {
    return {
      tokenVolume: 0,
      tokenTxCount: 0,
      uniqueHolders: 0,
      allTransactionsCount: 0,
      tokenInfo: {},
      dates: [],
      menu: false,
      reload: false,
    }
  },
  async fetch() {
    this.reload = true
    const dateToday = new Date()
    const dateStart = new Date(dateToday.getFullYear(), dateToday.getMonth(), 1)

    const start = dateStart.toISOString().split('T')[0]
    const end = dateToday.toISOString().split('T')[0]

    const [tokenVolume, tokenTxCount, tokenInfo, tokenSummary] =
      await Promise.all([
        this.$axios.get(
          `/dashboard/token-volume/${this.$route.params.token}?from=${start}&to=${end}`
        ),
        this.$axios.get(
          `/dashboard/token-transactions-count/${this.$route.params.token}?from=${start}&to=${end}`
        ),
        this.$axios.get(`/public/token/${this.$route.params.token}`),
        this.$axios.get(`/public/token-summary/${this.$route.params.token}`),
      ])

    this.tokenVolume = tokenVolume.data
    this.tokenTxCount = tokenTxCount.data
    this.uniqueHolders = tokenSummary.data?.token_holders
    this.allTransactionsCount = tokenSummary.data?.token_transactions
    this.tokenInfo = tokenInfo.data
    this.dates = [start, end]
    this.reload = false
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
  fetchOnServer: false,
  methods: {
    async reloadChartWithRange() {
      const [start, end] = this.dates

      if (end < start || !start || !end) {
        return
      }

      const [tokenVolume, tokenTxCount] = await Promise.all([
        this.$axios.get(
          `/dashboard/token-volume/${this.$route.params.token}?from=${start}&to=${end}`
        ),
        this.$axios.get(
          `/dashboard/token-transactions-count/${this.$route.params.token}?from=${start}&to=${end}`
        ),
      ])

      this.tokenVolume = tokenVolume.data
      this.tokenTxCount = tokenTxCount.data
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
