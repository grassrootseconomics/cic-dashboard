<template>
  <v-container>
    <skeleton-loader v-if="loading" h="100px"></skeleton-loader>
    <v-card v-else elevation="0" class="mb-1">
      <v-card-title
        >{{ voucherInfo.token_name }} ({{
          voucherInfo.token_symbol
        }})</v-card-title
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
              :sub-title="`${voucherInfo.token_total_supply.toLocaleString()} ${
                voucherInfo.token_symbol
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
    <v-card outlined class="mb-4">
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
              :chart-data="voucherTxCount"
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
              :chart-data="voucherVolume"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card elevation="0" class="mt-4">
      <v-row justify="center">
        <v-col cols="12">
          <v-card-title>Latest Transactions</v-card-title>
          <v-data-table
            :loading="loading"
            :headers="txHeaders"
            :items="txData"
            class="elevation-0"
          >
            <template #[`item.success`]="{ item }">
              <v-chip small :color="item.success ? 'green' : 'red'" dark>
                {{ item.success ? 'Yes' : 'No' }}
              </v-chip>
            </template>
            <template #[`item.time`]="{ item }">
              <span>{{ new Date(item.time).toLocaleString() }}</span>
            </template>
            <template #[`item.tx_value`]="{ item }">
              <span>{{ item.tx_value / 1000000 }}</span>
            </template>
            <template #[`item.tx_hash`]="{ item }">
              <span class="truncate">{{ item.tx_hash }}</span>
            </template>
            <template #no-data>No transactions since yesterday</template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import InfoCard from '~/components/InfoCard.vue'
import LineChart from '~/components/charts/LineChart.vue'
import SkeletonLoader from '~/components/SkeletonLoader.vue'

export default {
  name: 'VoucherInfoPage',
  components: {
    SkeletonLoader,
    InfoCard,
    LineChart,
  },
  data() {
    return {
      loading: false,
      txData: [],
      voucherVolume: 0,
      voucherTxCount: 0,
      uniqueHolders: 0,
      allTransactionsCount: 0,
      voucherInfo: {},
      dates: [],
      menu: false,
      reload: false,
      currentPage: 0,
      nextPage: 0,
      previousPage: 0,
      txHeaders: [
        {
          text: 'Successful',
          value: 'success',
        },
        {
          text: 'Time',
          value: 'time',
        },
        {
          text: 'Value',
          value: 'tx_value',
        },
        {
          text: 'Block',
          value: 'block',
        },

        {
          text: 'Tx Hash',
          value: 'tx_hash',
        },
        {
          text: 'From',
          value: 'from',
        },
        {
          text: 'To',
          value: 'to',
        },
      ],
    }
  },
  async fetch() {
    this.loading = true
    const dateToday = new Date()
    const dateStart = new Date(dateToday.getFullYear(), dateToday.getMonth(), 1)

    const start = dateStart.toISOString().split('T')[0]
    const end = dateToday.toISOString().split('T')[0]

    const [voucherVolume, voucherTxCount, voucherInfo, voucherSummary, txData] =
      await Promise.all([
        this.$axios.get(
          `/dashboard/token-volume/${this.$route.params.voucher}?from=${start}&to=${end}`
        ),
        this.$axios.get(
          `/dashboard/token-transactions-count/${this.$route.params.voucher}?from=${start}&to=${end}`
        ),
        this.$axios.get(`/public/token/${this.$route.params.voucher}`),
        this.$axios.get(`/public/token-summary/${this.$route.params.voucher}`),
        this.$axios.get(
          `/dashboard/latest-token-transactions/${this.$route.params.voucher}`
        ),
      ])

    this.voucherVolume = voucherVolume.data
    this.voucherTxCount = voucherTxCount.data
    this.uniqueHolders = voucherSummary.data?.token_holders
    this.allTransactionsCount = voucherSummary.data?.token_transactions
    this.voucherInfo = voucherInfo.data
    this.dates = [start, end]
    this.txData = txData.data

    this.loading = false
  },
  computed: {
    dateRangeText() {
      return this.dates.join(' ~ ')
    },
  },
  watch: {
    date() {
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

      const [voucherVolume, voucherTxCount] = await Promise.all([
        this.$axios.get(
          `/dashboard/token-volume/${this.$route.params.voucher}?from=${start}&to=${end}`
        ),
        this.$axios.get(
          `/dashboard/token-transactions-count/${this.$route.params.voucher}?from=${start}&to=${end}`
        ),
      ])

      this.voucherVolume = voucherVolume.data
      this.voucherTxCount = voucherTxCount.data
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

<style>
.truncate {
  display: inline-block;
  width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
