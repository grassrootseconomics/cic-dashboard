<template>
  <v-container>
    <v-alert
      v-show="isError"
      max-width="450"
      class="mx-auto"
      elevation="1"
      border="left"
      color="error"
      dark
      >{{ errorMessage }}
    </v-alert>
    <v-card elevation="1" class="mx-auto mb-4" outlined max-width="800">
      <v-card-title>Lookup User Details</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="lookup()">
          <v-radio-group v-model="byPhone" row>
            <v-radio label="By Phone" value="true"></v-radio>
            <v-radio label="By Address" value="false"></v-radio>
          </v-radio-group>
          <v-text-field
            v-model="identifier"
            color="primary"
            label="Identifier"
            type="text"
            hint="Phone number (+254...) or address (a1b2...)"
            outlined
            dense
            required
          />
          <v-btn :loading="loading" type="submit" dark color="primary" depressed
            >Get</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
    <v-card
      v-show="showMetaCard"
      elevation="1"
      class="mx-auto"
      outlined
      max-width="800"
    >
      <v-card-title>User Details</v-card-title>
      <v-card-text class="black--text">
        <p>
          <b>Balances: </b>
          <v-chip-group column>
            <v-chip
              v-for="n in balances"
              :key="n"
              small
              active-class="white--text"
              dark
              color="indigo"
              >{{ n.symbol }}: {{ n.balance / 1000000 }}</v-chip
            >
          </v-chip-group>
        </p>
        <p><b>Name: </b> {{ metaData.name }}</p>
        <p>
          <b>Registred on: </b>
          {{ dateRegistered }}
        </p>
        <p><b>Gender: </b> {{ metaData.person.gender }}</p>
        <p><b>Year Of Birth: </b> {{ metaData.person.date_of_birth.year }}</p>
        <p><b>Phone: </b>{{ phone }}</p>
        <p><b>Blockchain address: </b>{{ address }}</p>
        <p><b>Location: </b>{{ metaData.person.location.area_name }}</p>
        <p>
          <b>Products: </b>
          <v-chip-group column>
            <v-chip
              v-for="n in metaData.person.products"
              :key="n"
              small
              color="info"
              >{{ n }}</v-chip
            >
          </v-chip-group>
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'UsersPage',
  middleware: 'auth',
  data() {
    return {
      showMetaCard: false,
      identifier: '',
      address: '',
      phone: '',
      byPhone: 'true',
      errorMessage: '',
      isError: false,
      loading: false,
      metaData: {
        name: '',
        person: {
          gender: '',
          date_registered: '',
          products: [],
          date_of_birth: {
            year: '',
          },
          location: {
            area_name: '',
          },
        },
      },
      balances: [],
    }
  },
  computed: {
    dateRegistered() {
      return new Date(
        this.metaData.person.date_registered * 1000
      ).toLocaleDateString()
    },
  },
  methods: {
    async lookup() {
      this.showMetaCard = false
      this.loading = true
      this.isError = false

      if (this.byPhone === 'true') {
        try {
          const phoneLookup = await this.$axios.get(
            `admin/phone-2-address/${this.identifier}`
          )
          this.address = phoneLookup.data
          this.phone = this.identifier
        } catch (error) {
          this.loading = false
          this.errorMessage = error.response.data
          this.isError = true
        }
      } else if (this.byPhone === 'false') {
        try {
          const phoneLookup = await this.$axios.get(
            `admin/address-2-phone/${this.identifier}`
          )
          this.phone = phoneLookup.data
          this.address = this.identifier
        } catch (error) {
          this.loading = false
          this.errorMessage = error.response.data
          this.isError = true
        }
      }

      try {
        const [metaLookup, balances] = await Promise.all([
          this.$axios.get(`admin/meta-proxy/${this.address}`),
          this.$axios.get(`public/balances/${this.address}`),
        ])
        this.metaData = metaLookup.data
        this.balances = balances.data
        this.loading = false
        this.showMetaCard = true
      } catch (error) {
        this.loading = false
        this.errorMessage = error.response.data
        this.isError = true
      }
    },
  },
}
</script>
