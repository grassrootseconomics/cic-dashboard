<template>
  <v-container>
    <h1>users</h1>
  </v-container>
</template>

<script>
export default {
  name: 'UsersPage',
  middleware: 'auth',
}
</script>
