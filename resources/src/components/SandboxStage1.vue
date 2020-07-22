<template>
  <dl class="stage">
    <dt class="stage-title">count</dt>
    <dd class="stage-detail">{{ state.count }}</dd>
  </dl>
  <button @click="increment">+1</button>
  <button @click="decrement">-1</button>
</template>

<script lang="ts">
import { reactive, computed } from 'vue';

export default {
  setup() {
    const state = reactive<{ count: number }>({
      count: 0,
    });

    function increment() {
      state.count++;
    }

    function decrement() {
      state.count--;
    }

    return {
      state,
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
