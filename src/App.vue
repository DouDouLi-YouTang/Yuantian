<template>
  <router-view/>
</template>
<script setup>
import {computed, watch} from "vue";
import {useStore} from "vuex";

let store = useStore()
const htmlElement = document.documentElement

const currentTheme = computed(() => {
  return store.state.theme
})
watch(currentTheme, (newValue) => {
  htmlElement.setAttribute("data-theme", newValue)
})
store.state.theme = 'light' // 默认主题


</script>
<style lang="scss">

</style>
