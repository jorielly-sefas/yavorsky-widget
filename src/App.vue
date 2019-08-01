<template>
  <div id="app">
    <div id="nav">
      <router-link
        to="{ name: 'jobs' }"
        v-if="this.$route.name === 'file'"
        class="btn btn-outline-primary margin-left"
        >Back</router-link
      >
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
.margin-left {
  margin-left: 15px;
}
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
</style>
