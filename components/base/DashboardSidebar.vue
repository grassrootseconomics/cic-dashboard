<template>
  <div>
    <v-app-bar dark height="50" flat color="secondary" app>
      <v-app-bar-nav-icon
        color="primary"
        class="hidden-lg-and-up"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <div></div>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      dark
      floating
      class="elevation-4"
      color="primary"
      width="200"
    >
      <div class="d-flex flex-column align-center">
        <div class="pa-3">
          <v-img :src="require('@/assets/gecon_logo.png')" max-width="65px" />
        </div>
      </div>

      <v-list class="overline" dense>
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/vouchers">
          <v-list-item-icon>
            <v-icon>mdi-cash-multiple</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Vouchers</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item disabled to="/accounts">
          <v-list-item-icon>
            <v-icon>mdi-wallet</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Accounts</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item disabled to="/transactions">
          <v-list-item-icon>
            <v-icon>mdi-tray-full</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Transactions</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item disabled to="/social-network">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Social Network</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-show="isAuthenticated" to="/users">
          <v-list-item-icon>
            <v-icon color="success">mdi-clipboard-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="success--text">Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-show="isAuthenticated" to="/locked-pins">
          <v-list-item-icon>
            <v-icon color="success">mdi-lock-reset</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="success--text"
              >Locked Pins</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-show="isAuthenticated" @click="logout()">
          <v-list-item-icon>
            <v-icon color="warning">mdi-exit-to-app</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="warning--text">Log out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template #append>
        <div class="pa-2 text-center">
          <v-chip to="/staff" color="success" small label>
            <b>Grassroots Economics</b>
          </v-chip>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      drawer: null,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    async logout() {
      await this.$axios.post('auth/logout')
      await this.$store.commit('setAuth', { loggedIn: false })
      await this.$router.push('/')
    },
  },
}
</script>
