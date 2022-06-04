import colors from 'vuetify/es5/util/colors'

export default {
  target: 'static',
  head: {
    titleTemplate: '%s - cic-dashboard',
    title: 'Sarafu Network Dashboard',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon-32x32.png' }],
  },
  css: [],
  plugins: [{ src: '~/plugins/apexcharts.js', ssr: false }],
  components: true,
  buildModules: [['@nuxtjs/eslint-module', { fix: true }], '@nuxtjs/vuetify'],
  modules: ['nuxt-client-init-module', '@nuxtjs/axios'],

  axios: {
    baseURL: 'https://data-warehouse.sarafu.network',
    credentials: true,
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#222731',
          secondary: '#e1e5ea',
          accent: colors.grey.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  build: {},
}
