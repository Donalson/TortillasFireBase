import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Loading:{
      Titulo: '',
      Estado: false,
      Color: 'green',
    },
  },
  mutations: {
    MostrarLoading(state, payload){
      state.Loading.Titulo = payload.Titulo
      state.Loading.Color = payload.Color
      state.Loading.Estado = true
    },

    OcultarLoading(state){
      state.Loading.Estado = false
    },
  },
  actions: {
  },
  modules: {
  }
})
