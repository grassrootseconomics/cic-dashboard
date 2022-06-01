export const state = () => {
  return {
    auth: {},
  }
}

export const mutations = {
  setAuth(state, auth) {
    state.auth = auth
  },
}

export const actions = {
  async nuxtClientInit({ dispatch }) {
    await dispatch('authDispatch')
  },

  async authDispatch({ commit }) {
    try {
      await this.$axios.$get('admin/check')
      commit('setAuth', {
        loggedIn: true,
      })
    } catch (error) {
      commit('setAuth', {})
    }
  },
}

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },
}
