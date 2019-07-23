<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Jobs</router-link> |
      <router-link to="{ path: '/file/PPQA_003410_O02_0', params: { id: 'PPQA_003410_O02_0', job: { jobId: '003410' } }">File</router-link>
    </div>
    <router-view/>
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
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
