<template>
  <dl class="stage">
    <dt class="stage-title">count</dt>
    <dd class="stage-detail">{{ count }}</dd>
  </dl>
  <button @click="increment">+1</button>
  <button @click="decrement">-1</button>
</template>

<script lang="ts">
import { reactive, computed } from 'vue';
//import { useStore } from 'vuex';
import { useStore } from '~/store/index';

export default {
  setup() {
    const store = useStore();

    const count = computed(() => store.state.count);

    const increment = () => {
      store.dispatch('increment');
    };

    const decrement = () => {
      store.dispatch('decrement');
    };

    return {
      count,
      increment,
      decrement,
    };
  },
};
</script>

<style lang="scss">
.stage {
  display: flex;
  justify-content: center;

  &-title {
    font-weight: bold;
  }

  &-detail {
    color: #333;
  }
}
</style>
