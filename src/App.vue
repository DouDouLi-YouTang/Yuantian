<template>
  <a-config-provider
      :theme="{
        algorithm: systemTheme,
      }"
  >
    <router-view/>
  </a-config-provider>
</template>
<script setup>
import {computed, ref, watch} from "vue";
import {useStore} from "vuex";
import {theme} from 'ant-design-vue';

const systemTheme = ref(theme.darkAlgorithm)
let store = useStore()
const htmlElement = document.documentElement

const currentTheme = computed(() => {
  return store.state.theme
})
watch(currentTheme, (newValue) => {
  htmlElement.setAttribute("data-theme", newValue)
  if (newValue === "light") {
    systemTheme.value = theme.defaultAlgorithm
  } else {
    systemTheme.value = theme.darkAlgorithm
  }
})
store.state.theme = 'light' // 默认主题


</script>
<style lang="scss">

</style>
