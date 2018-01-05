import Api from '@/services/Api'
const FormData = require('form-data')

export default {
  state: {
    loadedBoulders: [],
    baseServerImageUrl: `http://localhost:7777/public/uploads/`
  },
  mutations: {
    setLoadedBoulders (state, payload) {
      state.loadedBoulders = payload
    },
    createBoulder (state, payload) {
      state.loadedBoulders.push(payload)
    },
    deleteBoulder (state, payload) {
      state.loadedBoulders.splice(state.loadedBoulders.indexOf(payload), 1)
    },
    updateBoulder (state, payload) {
      const boulder = state.loadedBoulders.find(boulder => {
        return boulder.id === payload.id
      })
      if (payload.name) {
        boulder.name = payload.name
      }
      if (payload.description) {
        boulder.description = payload.description
      }
      if (payload.grade) {
        boulder.grade = payload.grade
      }
    }
  },
  actions: {
    async loadBoulders ({commit}) {
      commit('setLoading', true)
      try {
        const data = (await Api().get('boulders/')).data
        commit('setLoadedBoulders', data)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    },
    async createBoulder ({commit, getters}, payload) {
      commit('setLoading', true)
      const boulder = {
        name: payload.name,
        grade: payload.grade,
        description: payload.description,
        creatorId: getters.user.id
      }
      try {
        const form = new FormData()
        form.append('image', payload.image)
        form.append('name', boulder.name)
        form.append('grade', boulder.grade)
        form.append('creatorId', boulder.creatorId)
        form.append('description', boulder.description)
        const data = (await Api().post('boulders/', form)).data
        if (data.success) {
          console.log(data)
          boulder._id = data.boulderId
          boulder.image = data.boulderImage
          commit('createBoulder', boulder)
          commit('setLoading', false)
        } else {
          console.log(data)
        }
      } catch (error) {
        console.log(error)
        commit('setLoading', false)
        commit('setError', error.response.data.message)
      }
    },
    async deleteBoulder ({commit}, payload) {
      commit('setLoading', true)
      try {
        await Api().delete(`boulders/${payload._id}`)
        commit('deleteBoulder', payload)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    },
    async updateBoulder ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.grade) {
        updateObj.grade = payload.grade
      }
      try {
        await Api().patch(`boulders/${payload._id}`, updateObj)
        commit('updateBoulder', payload)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.response.data.message)
        console.log(error.response.data.message)
      }
    }
  },
  getters: {
    loadedBoulders (state) {
      return state.loadedBoulders.sort((boulderA, boulderB) => {
        return boulderA.grade > boulderB.grade
      })
    },
    loadedBoulder (state) {
      return (boulderId) => {
        return state.loadedBoulders.find((boulder) => {
          return boulder._id === boulderId
        })
      }
    },
    featuredBoulders (state, getters) {
      return getters.loadedBoulders.slice(0, 5)
    },
    baseServerImageUrl (state) {
      return state.baseServerImageUrl
    }
  }
}