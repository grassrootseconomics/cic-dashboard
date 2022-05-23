<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-card elevation="0">
          <v-card-title>Tokens</v-card-title>
          <v-data-table
            :footer-props="{
              disableItemsPerPage: true,
            }"
            :loading="loading"
            :headers="headers"
            :items="tokenData"
            :server-items-length="tokensCount.count"
            class="elevation-0"
            @update:page="handlePageChange($event)"
          >
            <template #[`item.token_name`]="{ item }">
              <b
                ><n-link :to="`tokens/${item.token_addres}`">
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
  name: 'TokensIndexPage',
  async asyncData({ $axios }) {
    const [tokensReq, tokensCount] = await Promise.all([
      $axios.get(`/public/tokens?per_page=10&forward=true`),
      $axios.get(`/public/tokens-count`),
    ])

    return {
      tokenData: tokensReq.data,
      tokensCount: tokensCount.data,
    }
  },
  data() {
    return {
      tokenData: [],
      tokensCount: 0,
      currentPage: 1,
      loading: false,
      headers: [
        {
          text: 'Token Name',
          sortable: false,
          align: 'start',
          value: 'token_name',
        },
        {
          text: 'Token Symbol',
          sortable: false,
          value: 'token_symbol',
        },
        {
          text: 'Token Address',
          sortable: false,
          value: 'token_addres',
        },
      ],
    }
  },
  methods: {
    async handlePageChange($event) {
      this.loading = true
      if ($event > this.currentPage) {
        const offset = this.tokenData[this.tokenData.length - 1].id
        const data = await this.$axios.$get(
          `/public/tokens?per_page=10&forward=true&cursor=${offset}`
        )
        this.tokenData = data
        this.currentPage = $event
      }

      if ($event < this.currentPage) {
        const offset = this.tokenData[0].id
        const data = await this.$axios.$get(
          `/public/tokens?per_page=10&forward=false&cursor=${offset}`
        )
        this.tokenData = data
        this.currentPage = $event
      }
      this.loading = false
    },
  },
}
</script>
