import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

export interface State {
  count: number;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
  state: {
    count: 0,
  },
  getters: {
    hoge(state): number {
      return state.count;
    },
  },
  actions: {
    increment({ commit }) {
      commit('increment');
    },
    decrement({ commit }) {
      commit('decrement');
    },
  },
  mutations: {
    increment(state) {
      state.count += 1;
    },
    decrement(state) {
      state.count -= 1;
    },
  },
});

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
