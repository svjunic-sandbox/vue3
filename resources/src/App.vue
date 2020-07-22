<template>
  <div id="app">
    <p>hogehgoe</p>
    <img alt="Vue logo" src="/img/test.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <SandboxStage1></SandboxStage1>
  </div>
</template>

<script lang="ts">
import HelloWorld from '~/components/HelloWorld.vue';
import ImagePreview from '~/components/ImagePreview.vue';
import SandboxStage1 from '~/components/SandboxStage1.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    ImagePreview,
    SandboxStage1,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
