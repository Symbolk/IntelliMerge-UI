<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <MergeView></MergeView>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import MergeView from './components/MergeView.vue'

export default {
  name: 'app',
  components: {
    MergeView
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 20px; */
}

.v-sidebar-menu .collapse-btn {
  order: -1;
}

/* disable scroll bar */
/* body {
  overflow-x: hidden;
} */

::-webkit-scrollbar {
  display: none;
}
</style>
