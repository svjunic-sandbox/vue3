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
    //increment({ commit }, payload) {
    //  commit('increment', payload);
    //},
    //decrement({ commit }, payload) {
    //  commit('decrement', payload);
    //},
    increment({ commit }) {
      commit('increment');
    },
    decrement({ commit }) {
      commit('decrement');
    },
  },
  mutations: {
    //increment(state, payload) {
    //  if (typeof payload !== 'number') return;
    //  console.log(state.count);
    //  state.count += payload;
    //},
    //decrement(state, payload) {
    //  if (typeof payload !== 'number') return;
    //  state.count -= payload;
    //},
    increment(state) {
      state.count += 1;
    },
    decrement(state) {
      state.count -= 1;
    },
  },
});
