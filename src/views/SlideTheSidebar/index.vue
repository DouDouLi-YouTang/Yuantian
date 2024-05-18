<template>
  <div class="side">
    <div class="icon">
      <CaretLeftOutlined/>
    </div>
    <div class="subject">
      <div class="head">
        <template v-if="active === 0">
          <div class="title">
            首页设置
          </div>
          <div class="tip">
            这里是设置
          </div>
        </template>
        <template v-if="active === 1">
          <div class="title">
            备份与恢复
          </div>
          <div class="tip">
            可以在这里备份或恢复您的配置
          </div>
        </template>
      </div>
      <div class="body">
        <div class="sidebar">
          <div class="slider" :style="{transform:`translateY(${40*active}px)`}"></div>
          <div class="options" :class="active === 0 ? 'active':''" @click="handleActive(0)">
            <div class="menu-icon">
              <BgColorsOutlined/>
            </div>
            <div class="text">样式</div>
          </div>
          <div class="options" :class="active === 1 ? 'active':''" @click="handleActive(1)">
            <div class="menu-icon">
              <FileProtectOutlined/>
            </div>
            <div class="text">备份与恢复</div>
          </div>
        </div>
        <div class="tab">
          <div class="setTheContent" v-if="active === 0">
            开发中
          </div>
          <div class="setTheContent" v-if="active === 1">
            <div class="title">
              将配置以文件形式保存在您的设备上
            </div>
            <div class="btn" @click="backup">
              导出
            </div>
            <div class="title">
              还原之前的备份
            </div>
            <div class="btn" @click="upload.openModal">
              还原
            </div>
            <div class="title">
              重置之后页面数据将与<span style="color: #409eff">发现</span>页面保持同步
            </div>
            <div class="btn" style="color: #f56c6c" @click="reSetData">
              重置所有数据
            </div>
          </div>
        </div>
      </div>
    </div>
    <Upload ref="upload"/>
  </div>
</template>

<script setup>
import {CaretLeftOutlined} from '@ant-design/icons-vue';
import {BgColorsOutlined, FileProtectOutlined, ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {ref, createVNode} from "vue";
import {message, Modal} from "ant-design-vue";
import {resetTableData} from '@/Untils/indexedDB'
import {toDateString} from 'xe-utils'
import {db} from "@/Untils/indexedDB";
import Upload from "@/views/SlideTheSidebar/components/Upload.vue";

const active = ref(0)
const handleActive = (index) => {
  active.value = index
}
const emit = defineEmits(['reset'])
const reSetData = () => {
  Modal.confirm({
    title: '你确定要重置所有数据吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', {style: 'color:red;'}, '此操作将删除你本地的全部数据，请谨慎使用！'),
    okType: 'danger',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      resetTableData('UserNavs').then(() => {
        message.success('数据重置成功！')
        emit('reset')
      })
    },
    onCancel() {
      console.log('Cancel');
    },
  })
}
const backup = async () => {
  const UserNavs = await db.table('UserNavs').toArray() || []
  const jsonString = JSON.stringify(UserNavs)
  const blob = new Blob([jsonString], {type: 'text/plain'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const day = toDateString(new Date(), 'yyyy年MM月dd日')
  a.download = day + '备份.txt'
  a.click();
  URL.revokeObjectURL(url)
}
const upload = ref(null)
</script>
<style scoped lang="scss">
.side {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 20px;
  overflow: hidden;
  transition: all .5s;
  z-index: 10;

  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    opacity: 1;
    transition: all .5s;
    @include useTheme {
      color: getVar('textColor');
    }
  }

  .subject {
    height: 100%;
    margin-left: 20px;
    @include useTheme {
      background-color: getVar('BaseBackground');
      transition: all getVar('transition');
      color: getVar('textColor');
    }
    width: 450px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 12px rgba(0, 0, 0, .12);

    .head {
      height: 80px;
      @include useTheme {
        background-color: getVar('BaseBackground');
        color: getVar('textColor');
        border-color: getVar('bgRegular', ('elementColor'));
      }
      border-bottom: 1px solid;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .title {
        font-size: 20px;
        line-height: 30px;
        @include useTheme {
          color: getVar('textColor');
        }
      }

      .tip {
        font-size: 14px;
        color: getVar('Placeholder', ('elementColor'));
      }
    }

    .body {
      display: flex;
      padding: 10px 10px 10px 0;
      flex: 1;

      .sidebar {
        flex-shrink: 0;
        width: 140px;
        padding: 40px 0;
        position: relative;

        .slider {
          height: 40px;
          width: 2px;
          background-color: #409eff;
          position: absolute;
          right: 0;
          transition: all .3s;
        }

        .options {
          height: 40px;
          display: flex;
          gap: 5px;
          align-items: center;
          user-select: none;
          cursor: pointer;
          padding: 0 15px;
          transition: all .5s;

          &:hover {
            @include useTheme {
              background-color: getVar('SidebarHoverColor');
              color: getVar('SidebarActiveColor');
            }
          }

          .text {
            font-size: 14px;
          }
        }

        .active {
          @include useTheme {
            color: getVar('SidebarActiveColor');
          }
        }
      }

      .tab {
        flex: 1;
        padding: 10px;
        border-radius: 10px;
        @include useTheme {
          //background-color: getVar('bgPrimary', ('elementColor'));
          background-color: getVar('PageBackground');
        }

        .title {
          width: 100%;
          padding: 10px 15px 5px;
          font-size: 14px;
          word-wrap: break-word;
          @include useTheme {
            color: getVar('textColor');
          }

        }

        .btn {
          border-radius: 5px;
          padding: 10px 15px;
          font-size: 14px;
          margin-bottom: 20px;
          text-align: center;
          cursor: pointer;
          @include useTheme {
            background-color: getVar('BaseBackground');
            transition: all getVar('transition');
            color: getVar('SidebarActiveColor');
          }
        }
      }
    }
  }

  &:hover {
    width: 460px;

    .icon {
      //left: -20px;
      opacity: 0;
    }

    .subject {
      margin-left: 10px;
    }
  }
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>