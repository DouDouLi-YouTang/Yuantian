<template>
  <div class="Home">
    <div class="HomeMain">
      <div class="Text">
        <h1>元天导航</h1>
        <div class="Scrolling">{{ title }}<b :style="`padding:0 2px; opacity:${show === true? '1':'0'}`">|</b></div>
        <button>进入</button>
        <div class="footer">
          <span class="QQ">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-QQ"></use>
            </svg>
          </span>
          <span class="WeiXin">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-weixin"></use>
            </svg>
          </span>
          <span class="github">
            <a href="https://github.com/DouDouLi-YouTang" target="_blank">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-github"></use>
              </svg>
            </a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, onUnmounted} from 'vue'

const textList = [
  '你总觉得别人不达标，是因为心里曾有个得过满分的',
  '这世界最好的事莫过于，你喜欢的人刚好也喜欢你',
  '我带着真诚与善良而来，该遗憾的不应该是我',
  '你联系我，我就听你说，你不联系我，我就顺其自然',
  '我连1/4的选择题都做不对，怎么有把握选对1/14亿的人',
  '所有的离开都是蓄谋已久，无一例外',
  '我见过很多人性和黑暗，但我依然单纯对你。我的意思是，你的那些伎俩，不该用在我身上',
  '月亮虽然遥远，但某一刻真的照亮过我',
]
// 定时器的启动与停止
let timeStart = 0

// 文字索引值
let titleIndex = 0

// 数组索引值
const index = Math.floor(Math.random() * textList.length)
let titleArrayIndex = index;
// 显示的文字
const title = ref('')
// 文字定时器
const time = setInterval(() => {
  if (timeStart === 0) {
    if (titleArrayIndex !== textList.length) {
      if (titleIndex !== textList[titleArrayIndex].length) {
        title.value += textList[titleArrayIndex][titleIndex]
        titleIndex += 1
      } else {
        titleArrayIndex += 1
        titleIndex = 0
        timeStart = 1
        // clearInterval(time)
        setTimeout(() => {
          title.value = ''
          timeStart = 0
        }, 10000)
      }
    } else {
      titleArrayIndex = 0
    }
  }
}, 100);

// 文字后面的的 | 定时器
const show = ref(true)
const time2 = setInterval(() => {
  show.value = !show.value
}, 500)

onUnmounted(() => {
  clearInterval(time)
  clearInterval(time2)
});
</script>


<style scoped lang="scss">
.Home {
  background-image: url("../assets/imgs/background.png");
  background-size: cover;
  background-position: center center;

  .HomeMain {
    background-color: rgba(0, 0, 0, 0.3);
    position: relative;
    width: 100%;
    height: 100vh;

    .Text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: white;

      h1 {
        font-size: 60px;
        font-weight: bold;
        margin-bottom: 40px;
        text-shadow: .1em .1em .2em #000;
        letter-spacing: 16px;
      }

      div {
        font-size: 18px;
        margin-bottom: 50px;
      }

      button {
        background-color: transparent;
        border: white 1px solid;
        width: 200px;
        line-height: 30px;
        border-radius: 20px;
        transition: background-color 1s;
        cursor: pointer;

        &:hover {
          background-color: #409eff;
        }
      }

      .footer {
        display: flex;
        margin-top: 40px;
        font-size: 26px;
        justify-content: center;

        span {
          padding: 0 10px;
          cursor: pointer;
          position: relative;
        }

        .QQ::after,
        .WeiXin::after {
          opacity: 0;
          content: '';
          width: 0;
          height: 0;
          display: block;
          background-repeat: no-repeat;
          background-size: cover;
          position: absolute;
          bottom: 35px;
          transform: translate(-50%);
          left: 50%;
          border-radius: 16px;
          background-color: white;
          overflow: hidden;
          box-sizing: border-box;
          border: 0 solid transparent;
          transition: all 0.5s;
        }

        .QQ,
        .WeiXin {
          &:hover {
            &::after {
              opacity: 1;
              width: 150px;
              height: 150px;
              border: 5px solid transparent;
            }
          }
        }

        .QQ::after {
          background-image: url("../assets/imgs/QQ.png")
        }

        .WeiXin::after {
          background-image: url("../assets/imgs/weixin.png");
        }
      }
    }
  }
}
</style>