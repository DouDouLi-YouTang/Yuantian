<template>
  <div class="sidebar" v-show="navs.length">
    <Simplebar class="simplebar">
      <VueDraggable ref="el" v-model="navs" @end="onEnd" :animation="150" :filter="'.add'" :disabled="!props.Edit"
                    ghostClass="ghost">
        <TransitionGroup type="transition" name="fade">
          <div
              :class="`box ${activeId === 'Nav'+ item.id ? 'active':''} ${props.Edit? 'sort':''}`"
              v-for="item in navs"
              :key="item.id"
              @click="setActive('Nav'+ item.id)"
          >
            {{ item.title }}
            <div class="Edit" v-if="props.Edit">
              <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                  <EllipsisOutlined class="EditIcon"/>
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="openModal(item,'edit')">
                      <span>编辑</span>
                    </a-menu-item>
                    <a-menu-item @click="remove(item)">
                      <span>删除</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </TransitionGroup>
        <transition name="bounce">
          <div class="box add" v-if="props.Edit" @click="openModal({},'add')">
            <PlusOutlined/>
          </div>
        </transition>
      </VueDraggable>
    </Simplebar>
    <MenuEdit ref="menuEdit" @resetData="resetData"/>
  </div>
</template>
<script setup>
import {EllipsisOutlined, ExclamationCircleOutlined, PlusOutlined} from '@ant-design/icons-vue';
import 'simplebar-vue/dist/simplebar.min.css';
import Simplebar from "simplebar-vue";
import MenuEdit from "@/views/Collection/Alert/MenuEdit.vue";
import {ref, watch, createVNode, computed} from "vue"
import {message, Modal} from 'ant-design-vue';
import {deleteInBulk, updateInBlock} from '@/Untils/indexedDB.js'
import {VueDraggable} from 'vue-draggable-plus'
import {clone} from "xe-utils";

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  Edit: {
    type: Boolean,
    default: false
  },
  activeId: {
    type: String,
    default: 'Nav1'
  }
})
const activeId = computed(() => {
  return props.activeId ?? `Nav${navs.value.at(0).id}`;
})
const navs = ref([])
watch((() => props.list), (value) => {
  navs.value = value
})

const emits = defineEmits(['setActive', 'resetData'])

function setActive(Id) {
  activeId.value = Id
  emits('setActive', Id)
}

const menuEdit = ref(null)
const openModal = function (parent, type) {
  menuEdit.value.edit(parent, type)
}
const resetData = function () {
  emits('resetData')
}
const remove = function (data) {
  const numberOfLists = props.list.length
  const currentSubscript = props.list.findIndex(item => item.id === data.id) + 1
  let ids = [data.id,]
  data.children.forEach(item => ids.push(item.id))
  if (numberOfLists !== 1) {
    Modal.confirm({
      title: '警告！',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('span', null, [
        '你确定要 ',
        createVNode('span', {style: "color:#FF4D4F;"}, '删除 '),
        `#${data.title} 吗？该分类下有 `,
        createVNode('b', {style: "color:#1677FF;"}, data.children.length),
        ' 个子分类，删除后将无法恢复！',
      ],),
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteInBulk(ids).then(() => {
          message.success('删除成功')
          resetData()
          activeId.value = 'Nav' + props.list.at(currentSubscript).id
        }).catch(() => {
          message.error('未知错误，删除失败！')
        })
      },
      onCancel() {

      },
    });
  } else {
    message.warning('至少保留一个分类！')
  }
}

// 拖拽结束后
const onEnd = (e) => {
  const afterSorting = navs.value.reduce((arr, item, index) => {
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
$MainHeight: calc(100vh - 140px);
.simplebar {
  max-height: calc(100vh - 160px);
}

.sidebar {
  margin: 40px 0;
  @include useTheme {
    background-color: getVar('BaseBackground');
    transition: all getVar('transition');
    color: getVar('textColor');
  }
  padding: 10px 10px 10px 20px;
  width: 100%;
  height: 100%;
  max-height: $MainHeight;
  border-radius: 10px;

  .box {
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    transition: all 0.5s;
    border-radius: 5px;
    position: relative;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 5px 0;

    &:hover {
      padding-left: 20px;
      @include useTheme {
        background-color: getVar('SidebarHoverColor');
        color: getVar('SidebarActiveColor');
      }
      //color: #409eff;
      //background-color: #ecf5ff;

      .Edit {
        display: block;
      }
    }

    .Edit {
      position: absolute;
      right: 10px;
      z-index: 10;
      bottom: -10px;
      display: none;

      .EditIcon {
        transition: all 0.5s;
        color: rgb(96, 98, 102);
        font-size: 20px;
      }

      &:hover {
        .EditIcon {
          transform: scale(1.2);
          color: #409eff;
        }
      }
    }
  }

  .sort {
    cursor: move;
    user-select: none;

    &:active {
      border: 1px solid #409eff;

    }
  }

  .active {
    padding-left: 20px;
    color: #409eff;
    @include useTheme {
      background-color: getVar('SidebarHoverColor');
      color: getVar('SidebarActiveColor');
    }
  }

  .add {
    text-align: center;
    font-size: 20px;
    border: 1.5px dashed #ecf5ff;

    &:hover {
      padding-left: 0;
    }
  }
}

.ghost {
  opacity: 0.5;
  margin: 10px 0;
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

</style>

<style lang="scss">

</style>