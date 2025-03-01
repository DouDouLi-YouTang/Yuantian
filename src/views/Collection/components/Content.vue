<template>
  <div class="content">
    <simplebar class="simplebar" id="webSite" ref="scrollContainer">
      <div :class="`nav ${AnimationId === 'Nav'+item.id ? 'border':''}` " :id="`Nav${item.id}`" v-for="item in data"
           :key="item.id">
        <h1 class="title">{{ item.title }}</h1>
        <VueDraggable
            ref="el"
            v-model="item.children"
            @end="onEnd(item.id)"
            target=".ant-row"
            :animation="150"
            :filter="'.Add'"
            :disabled="!props.Edit"
            ghostClass="ghost"
        >
          <a-row style="width: 100%;padding: 0 10px" :gutter="[20,15]">
            <TransitionGroup
                type="transition"
                name="fade"
            >
              <a-col class="a-col" v-for="child in item.children" :key="child.id">
                <div class="sort">
                  <a-tooltip placement="top" :open="props.Edit ? false:undefined">
                    <template #title v-if="child.synopsis">
                      <span>{{ child.synopsis }}</span>
                    </template>
                    <div :class="`webBox ${props.Edit? 'sort':''}`" @click="Jump(child.id,child)">
                      <div class="webImg">
                        <img :src="child.imgUrl" alt="">
                      </div>
                      <div class="webName">{{ child.webName }}</div>
                      <div class="Edit">
                        <a-dropdown>
                          <a class="ant-dropdown-link">
                            <EllipsisOutlined @click.stop class="EditIcon"/>
                          </a>
                          <template #overlay>
                            <a-menu>
                              <a-menu-item @click="openModal(child,'edit')">
                                <EditOutlined/>
                                <span style="padding-left: 5px">编辑</span>
                              </a-menu-item>
                              <a-menu-item @click="remove(child)">
                                <DeleteOutlined style="color: red"/>
                                <span style="padding-left: 5px;color: red">删除</span>
                              </a-menu-item>
                            </a-menu>
                          </template>
                        </a-dropdown>
                      </div>
                    </div>
                  </a-tooltip>
                </div>
              </a-col>
            </TransitionGroup>
            <transition name="bounce">
              <a-col class="a-col" v-if="props.Edit">
                <div>
                  <a-tooltip placement="top">
                    <template #title>
                      <span>点击新增</span>
                    </template>
                    <div class="webBox Add" @click="openModal(item.id,'add')">
                      <PlusOutlined/>
                    </div>
                  </a-tooltip>
                </div>
              </a-col>
            </transition>
          </a-row>
        </VueDraggable>

      </div>

    </simplebar>
    <WebEdit ref="webData" @resetData="resetData"/>
  </div>
</template>
<script setup>
import {ref, watch, onMounted, createVNode} from "vue"
import {setTableData, removeTableData, updateInBlock} from '@/Untils/indexedDB.js'
import simplebar from "simplebar-vue";
import {message, Modal} from 'ant-design-vue';
import {debounce} from "@/Untils/Global";
import {
  EllipsisOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons-vue";
import WebEdit from "@/views/Collection/Alert/WebEdit.vue";
import {clone} from "xe-utils";
import {VueDraggable} from "vue-draggable-plus";

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  Edit: {
    type: Boolean,
    default: false
  }
})
const data = ref([])
watch(() => props.list, (value) => {
  data.value = value
})
const emit = defineEmits(['callBackId', 'resetData'])
const resetData = () => {
  emit('resetData')
}

// region 页面动态效果区
function getCurrentElementInView() {
  let children = RollingElement.children[0].children;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const rect = child.getBoundingClientRect();
    // const Height = (0 - rect.height) / 4 // 当元素距离顶端多少时才切换
    // 检查子元素是否在视口中

    if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
      return child;
    }
  }
}

const AnimationId = ref(null)

const clear = debounce(function () {
  AnimationId.value = null;
}, 3000)

const scroll = (id) => {
  let target = RollingElement.children[0].children[id];
  RollingElement.scrollTo({top: target.offsetTop - 40, behavior: 'smooth'})
  AnimationId.value = id;
  clear()
}
defineExpose({
  scroll
})

const scrollContainer = ref(null);
let RollingElement // 滚动元素
onMounted(() => {
  RollingElement = document.getElementById('webSite').getElementsByClassName('simplebar-content-wrapper')[0]
  RollingElement.addEventListener('scroll', debounce(function () {
    const currentElement = getCurrentElementInView()
    if (currentElement) {
      emit('callBackId', currentElement.id)
    }
  }, 30))
})
// endregion

const Jump = function (id, child) {
  setTableData(id, {ClickTimes: child.ClickTimes ? ++child.ClickTimes : 1}).then(() => {
    resetData()
    window.open(child.url, '_blank');
  }).catch(err => {
    message.error(err);
  })
}

// 编辑
const webData = ref(null);
const openModal = (child, type) => {
  let options = data.value.map(item => {
    return {
      label: item.title,
      value: item.id
    }
  })
  webData.value.edit(child, options, type)
}

// 删除
const remove = (child) => {
  let webName = child.webName
  Modal.confirm({
    title: '警告！',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('span', null, [
      '你确定要 ',
      createVNode('span', {style: "color:red;"}, '删除 '),
      `#${webName}`,
      ' 吗？'
    ],),
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      removeTableData(child.id).then(() => {
        message.success('删除成功')
        resetData()
      }).catch(() => {
        message.error('未知错误，删除失败！')
      })
    },
    onCancel() {

    },
  });
}

const onEnd = function (id) {
  let child = data.value.find(item => item.id === id);
  const afterSorting = child.children.reduce((arr, item, index) => {
    let data = clone(item)
    delete data.children
    arr.push({
      ...data,
      sort: index
    })
    return arr
  }, [])
  updateInBlock(afterSorting).then(() => {
    message.success('修改成功！')
    resetData()
  }).catch(() => [
    message.error('未知错误，修改失败！')
  ])
}
</script>
<style scoped lang="scss">
$MainHeight: calc(100vh - 60px);
.simplebar {
  max-height: $MainHeight;
  width: 100%;
  padding-right: 15px;
  padding-bottom: 40px;

}

.content {
  max-height: $MainHeight;

  .nav {
    padding-top: 20px;
    padding-bottom: 10px;
    padding-left: 15px;
    border: 2px solid transparent;
    border-radius: 10px;
    transition: all 0.5s;

    &:first-child {
      margin-top: 40px;
    }

    .title {
      font-size: 20px;
      transition: all .3s;
      user-select: none;
      position: relative;
      width: fit-content;
      margin-bottom: 10px;
      @include useTheme {
        color: getVar('titleColor', ('Content'));
      }

      &::after {
        content: "";
        height: 2px;
        width: 0;
        background-color: #0072ea;
        position: absolute;
        bottom: -2px;
        left: 0;
        transition: all .5s;
      }

      &:hover {
        color: rgb(0, 114, 234) !important;

        &::after {
          width: calc(100% + 10px);
        }
      }
    }

    .webBox {
      display: flex;
      width: 100%;
      align-items: center;
      background-color: white;
      padding: 10px;
      cursor: pointer;
      border-radius: 5px;
      transition: all .5s;
      position: relative;
      border: 1px solid transparent;
      @include useTheme {
        background-color: getVar('BaseBackground');
        transition: all getVar('transition');
        color: getVar('textColor');
      }

      &:hover {
        box-shadow: 0 15px 30px rgba(0, 0, 0, .1);
        transform: translate3d(0, -2px, 0);

        .Edit {
          display: block;
        }
      }

      .Edit {
        position: absolute;
        right: 10px;
        bottom: 0;
        display: none;

        .EditIcon {
          transition: all 0.5s;
          font-size: 20px;
          @include useTheme {
            color: getVar('textColor');
          }

          &:hover {
            transform: scale(1.2);
            color: #409eff;
          }
        }
      }


      .webImg {
        width: 20px;
        height: 20px;


        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .webName {
        width: calc(100% - 20px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 15px;
        padding-left: 10px;
      }
    }

    .sort {
      cursor: move;
      user-select: none;

      &:hover {
        transform: translate3d(0, 0, 0)
      }

      &:active {
        border-color: #409eff;
      }
    }

    .Add {
      width: 100%;
      justify-content: center;
      font-size: 18px;
      height: 40px;

    }
  }

  .border {
    border-color: #409eff;
  }
}

.a-col {
  transition: all .5s;
  width: 20%;
}

.ghost {
  opacity: 0.5;
}

// 组件过渡动画
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}

@media screen and (max-width: 992px) {
  .a-col {
    width: 33.333333333333%;
  }
}

@media screen and (max-width: 768px) {
  .a-col {
    width: 50%;
  }
}
</style>

<style lang="scss">

</style>