<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="7">
        <v-card elevation="0">
          <v-card-title>Vouchers</v-card-title>
          <v-data-table
            :footer-props="{
              disableItemsPerPage: true,
            }"
            :loading="loading"
            :headers="headers"
            :items="voucherData"
            :server-items-length="vouchersCount.count"
            class="elevation-0"
            @update:page="handlePageChange($event)"
          >
            <template #[`item.token_name`]="{ item }">
              <b
                ><n-link :to="`vouchers/${item.token_addres}`">
                  {{ item.token_name }}
                </n-link></b
              >
            </template>
            <template #no-data> No results </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'VouchersIndexPage',
  async asyncData({ $axios }) {
    const [vouchersReq, vouchersCount] = await Promise.all([
      $axios.get(`/public/tokens?per_page=10&forward=true`),
      $axios.get(`/public/tokens-count`),
    ])

    return {
      voucherData: vouchersReq.data,
      vouchersCount: vouchersCount.data,
    }
  },
  data() {
    return {
      voucherData: [],
      vouchersCount: 0,
      currentPage: 1,
      loading: false,
    }
  },
  computed: {
    headers() {
      const headers = [
        {
          text: 'Voucher Name',
          sortable: false,
          align: 'start',
          value: 'token_name',
        },
        {
          text: 'Voucher Symbol',
          sortable: false,
          value: 'token_symbol',
        },
        {
          text: 'Voucher Address',
          sortable: false,
          value: 'token_addres',
        },
      ]

      if (this.$vuetify.breakpoint.smAndDown) {
        headers.pop()
      }

      return headers
    },
  },
  methods: {
    async handlePageChange($event) {
      this.loading = true
      if ($event > this.currentPage) {
        const offset = this.voucherData[this.voucherData.length - 1].id
        const data = await this.$axios.$get(
          `/public/tokens?per_page=10&forward=true&cursor=${offset}`
        )
        this.voucherData = data
        this.currentPage = $event
      }

      if ($event < this.currentPage) {
        const offset = this.voucherData[0].id
        const data = await this.$axios.$get(
          `/public/tokens?per_page=10&forward=false&cursor=${offset}`
        )
        this.voucherData = data
        this.currentPage = $event
      }
      this.loading = false
    },
  },
}
</script>
