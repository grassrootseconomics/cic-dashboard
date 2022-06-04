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
    <v-card elevation="1" class="mx-auto" max-width="450" outlined>
      <v-card-title>Staff Log in</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="logIn()">
          <v-text-field
            v-model="username"
            color="primary"
            label="Username"
            outlined
            dense
            required
          />
          <v-text-field
            v-model="password"
            color="primary"
            label="Password"
            type="password"
            outlined
            dense
            required
          />
          <v-btn type="submit" block dark color="primary" depressed large>
            Log in
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'StaffPage',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isError: false,
      loading: false,
    }
  },
  methods: {
    async logIn() {
      this.loading = true
      try {
        await this.$axios.$post('auth/login', {
          username: this.username,
          password: this.password,
        })
        await this.$store.commit('setAuth', {
          loggedIn: true,
        })
        this.loading = false
        await this.$router.push('/users')
      } catch (error) {
        this.loading = false
        this.errorMessage = error.response.data
        this.isError = true
      }
    },
  },
}
</script>
