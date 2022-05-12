<template>
  <v-app>
    <Sidebar />
    <v-main class="secondary">
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from '~/components/base/DashboardSidebar.vue'
export default {
  name: 'DefaultLayout',
  components: {
    Sidebar,
  },
}
</script>
