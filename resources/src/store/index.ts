import { createStore } from 'vuex';

export default createStore({
  state: {
    count: 0,
  },
  getters: {
    hoge(state) {
      return state.count;
    },
  },
  actions: {
    increment({ commit }, payload) {
      commit('increment', payload);
    },
    decrement({ commit }, payload) {
      commit('decrement', payload);
    },
  },
  mutations: {
    increment(state, payload) {
      if (typeof payload !== 'number') return;
      console.log(state.count);
      state.count += payload;
    },
    decrement(state, payload) {
      if (typeof payload !== 'number') return;
      state.count -= payload;
    },
  },
});
