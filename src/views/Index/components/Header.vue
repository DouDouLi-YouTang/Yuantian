<template>
  <div class="header">
    <div class="main">
      <div class="topBar">
        <div class="logo">元天导航</div>
        <div class="time">{{ time }}<span class="second">:{{ second }}</span></div>
        <div class="date">{{ date }} {{ week }}</div>
      </div>
      <div class="navigationBar">
        <div class="item">
          <MySwitch @change="themeSwitching"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {useStore} from "vuex";
import {ref} from "vue";
import XEUtils from "xe-utils";
import MySwitch from "@/components/MySwitch.vue";

const store = useStore()
const time = ref('00')
const second = ref('00')
const date = ref()
const week = ref()
let dayOfTheWeekInChinese = ['日', '一', '二', '三', '四', '五', '六']
const theme = ref(0)

const timer = setInterval(() => {
  time.value = XEUtils.toDateString(new Date(), 'HH:mm')
  second.value = XEUtils.toDateString(new Date(), 'ss')
  date.value = XEUtils.toDateString(new Date(), 'MM月dd日')
  let weekDay = XEUtils.toDateString(new Date(), 'E')
  week.value = `星期${dayOfTheWeekInChinese[weekDay]}`
}, 1000)

const themeSwitching = (item) => {
  if (item) {
    store.state.theme = 'light'
  } else {
    store.state.theme = 'dark'
  }
}

</script>
<style scoped lang="scss">


.header {
  height: 60px;
  border-bottom: 1px solid;
  position: relative;
  @include useTheme {
    background-color: getVar('PageBackground');
    border-color: getVar('borderColor');
    transition: all getVar('transition');
    color: getVar('textColor');
  }

  .main {
    height: 100%;
    display: flex;
    justify-content: space-between;

    .topBar {
      display: flex;
      height: 100%;
      align-items: center;
      gap: 20px;

      .logo {
        font-size: 28px;
        font-weight: 700;
      }

      .time {
        width: 62px;
      }
    }

    .navigationBar {
      display: flex;
      align-items: center;
      gap: 20px;
      height: 100%;

      .item {


      }
    }
  }

}
</style>