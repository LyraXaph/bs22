import Api from '@/services/Api'

export default {
  state: {
    user: null,
    token: null
  },
  mutations: {
    addRemoveBoulderToClimbed (state, payload) {
      const boulderIndex = state.user.climbedBoulders.findIndex(boulderId => boulderId === payload)
      if (boulderIndex > 0) {
        state.user.climbedBoulders.splice(boulderIndex, 1)
      } else {
        state.user.climbedBoulders.push(payload)
      }
    },
    setUser (state, payload) {
      state.user = payload
    },
    setToken (state, payload) {
      state.token = payload
    }
  },
  actions: {
    async addRemoveBoulderToClimbed ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      try {
        await Api().post(`users/${user.id}/climbedBoulders/${payload}`)
        commit('setLoading', false)
        commit('addRemoveBoulderToClimbed', payload)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    },
    async registerUser ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      try {
        const response = await Api().post('users/register', payload)
        const user = response.data.user
        commit('setLoading', false)
        const newUser = {
          id: user.id,
          climbedBoulders: [],
          gymId: user.gym
        }
        commit('setUser', newUser)
        commit('setToken', response.data.token)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        // console.log(error.response.data.message)
      }
    },
    async signInUser ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      try {
        const response = await Api().post('users/login', payload)
        const user = response.data.user
        commit('setLoading', false)
        const newUser = {
          id: user.id,
          climbedBoulders: user.climbedBoulders,
          gymId: user.gym
        }
        commit('setUser', newUser)
        commit('setToken', response.data.token)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        // console.log(error.response.data.message)
      }
    },
    logout ({commit}) {
      commit('setUser', null)
      commit('setToken', null)
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}