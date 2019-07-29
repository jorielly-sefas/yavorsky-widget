<template>
  <div id="app">
    <div id="nav">
      <router-link
        to="/"
        v-if="this.$route.name === 'file'"
        class="btn btn-outline-primary"
        >Back</router-link
      >
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
</style>
