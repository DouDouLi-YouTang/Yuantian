<template>
  <div class="header">
    <div class="main" :class="`${active === '/Navs'? '':'holdItUp'}`">
      <div class="topBar">
        <div class="logo">元天导航</div>
        <div class="time">{{ time }}<span class="second">:{{ second }}</span></div>
        <div class="date">{{ date }} {{ week }}</div>
      </div>
      <div class="navigationBar">
        <div :class="`item ${active === '/Navs'? 'active' :''}`" @click="jump('/Navs')">
          <span class="title">我的收藏</span>
        </div>
        <!--        <div :class="`item ${active === '/Found' ? 'active': ''}`" @click="jump('/Found')">-->
        <!--          <span class="title">发现</span>-->
        <!--        </div>-->
        <div :class="`item ${active === '/ChangeLog' ? 'active': ''}`" @click="jump('/ChangeLog')">
          <span class="title">更新日志</span>
        </div>
        <div class="item">
          <MySwitch @change="themeSwitching"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {useStore} from "vuex";
import {ref, watch} from "vue";
import XEUtils from "xe-utils";
import MySwitch from "@/components/MySwitch.vue";
import {useRouter, useRoute} from 'vue-router';

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
const router = useRouter();
const route = useRoute();
const active = ref(route.path)
watch(route, (val) => {

  setTimeout(() => {
    active.value = val.path
  }, 200)
})

const jump = (path) => {
  if (path === '/Found') {
    window.open('/#/Found', '_blank')
  } else {
    router.push(path)
  }
}
</script>
<style scoped lang="scss">
.header {
  height: 60px;
  border-bottom: 1px solid;
  position: relative;
  @include useTheme {
    background-color: getVar('BaseBackground');
    border-color: getVar('borderColor');
    transition: all getVar('transition');
    color: getVar('textColor');
  }

  .holdItUp {
    max-width: 100%;
    padding: 0 50px;
  }

  .main {
    height: 100%;
    display: flex;
    justify-content: space-between;
    @include useTheme {
      transition: all getVar('transition');
    }

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
        font-size: 14px;
      }

      .date {
        font-size: 14px;
      }
    }

    .navigationBar {
      display: flex;
      gap: 20px;
      height: 100%;

      .item {
        height: 100%;
        display: flex;
        align-items: center;
        border-bottom: 2px solid transparent;
        cursor: pointer;

        .title {

          padding: 0 20px;
          font-size: 14px;
        }

        &:hover:not(:last-child) {
          @include useTheme {
            background-color: getVar('SidebarHoverColor');
          }
        }
      }

      .active {
        height: 100%;
        @include useTheme {
          color: getVar('SidebarActiveColor');
        }
        border-color: #409eff;
      }
    }
  }

}
</style>