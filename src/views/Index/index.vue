<template>
  <div class="index">
    <Header/>
    <div class="indexBody">
      <router-view v-slot="{ Component }">
        <transition name="scale" mode="out-in">
          <keep-alive>
            <component :is="Component"/>
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script setup>
import Header from "./components/Header.vue"
</script>
<style scoped lang="scss">
.index {
  height: 100vh;
  @include useTheme {
    background-color: getVar('PageBackground');
  }
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}


.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>