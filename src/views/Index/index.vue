<template>
  <div class="index">
    <Header/>
    <div class="indexBody">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import Header from "./components/Header.vue"
</script>
<style scoped lang="scss">
.index {
  height: 100vh;
}
</style>