<template>
  <div id="app">
    <p>hogehgoe</p>
    <img alt="Vue logo" src="/img/test.png" />
    <hr />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <hr />
    <SandboxStage1></SandboxStage1>
    <hr />
    <SandboxStage2></SandboxStage2>
  </div>
</template>

<script lang="ts">
import HelloWorld from '~/components/HelloWorld.vue';
import ImagePreview from '~/components/ImagePreview.vue';
import SandboxStage1 from '~/components/SandboxStage1.vue';
import SandboxStage2 from '~/components/SandboxStage2.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    ImagePreview,
    SandboxStage1,
    SandboxStage2,
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
