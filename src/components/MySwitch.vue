<template>
  <div class="switch"
       @click="handoff"
       :style="{
         backgroundColor: state? '#FBEDB6':'#CCCCCC',
         borderColor: state? '#A1A1AD':'#212121'
         }"
  >
    <div class="rotundity" :style="{left:state? '4px':'32px',backgroundColor:state?'white':'#212121'}"></div>
    <img :style="`opacity: ${state?0:1} `" src="@/assets/imgs/night.svg" alt="">
    <img :style="`opacity: ${state?1:0} `" src="@/assets/imgs/daytime.svg" alt="">
  </div>
</template>
<script setup>
import {ref} from "vue";

const emits = defineEmits(['change'])
const state = ref(true)
const handoff = () => {
  state.value = !state.value
  emits('change', state.value)
}


</script>
<style scoped lang="scss">
.switch {
  width: 64px;
  height: 34px;
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid;
  padding: 5px;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  transition: all .5s;

  .rotundity {
    width: 22px;
    height: 22px;
    top: 4px;
    left: 5px;
    position: absolute;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all .5s;
  }

  img {
    width: 50%;
    height: 100%;
    transition: all 0.3s;
  }
}
</style>