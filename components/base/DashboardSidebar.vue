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

        <v-list-item disabled to="/tokens">
          <v-list-item-icon>
            <v-icon>mdi-cash-multiple</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Tokens</v-list-item-title>
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
      </v-list>

      <template #append>
        <div class="pa-2 text-center">
          <v-chip color="success" small label>
            <b>Grassroots Economics</b>
          </v-chip>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
    }
  },
}
</script>
