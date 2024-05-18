<script setup>
import {createVNode, ref, watch} from "vue";
import {ExclamationCircleOutlined, InboxOutlined} from '@ant-design/icons-vue';
import {todo, resetTableData} from "@/Untils/indexedDB";
import {message, Modal, notification} from "ant-design-vue";

const open = ref(false)
const file = ref([])
const openModal = () => {
  open.value = true
  file.value = []

}
defineExpose({openModal})

const previewFile = async function (file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let userdata = JSON.parse(e.target.result)
        Modal.confirm({
          title: '你确定要还原吗？',
          icon: createVNode(ExclamationCircleOutlined),
          content: createVNode('div', {style: 'color:red;'}, '此操作将覆盖你当前的全部数据，请谨慎使用！'),
          okType: 'danger',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            resetTableData('UserNavs').then(() => {
              todo.bulkPut(userdata).then(() => {
                notification.success({
                  message: '导入成功，即将刷新页面',
                  duration: 3
                })
                setTimeout(() => {
                  window.location.reload()
                }, 3000)
                resolve()
              }).catch(() => {
                notification.error({
                  message: '喔吼，导入失败了，怎么办，联系网站作者吧',
                  duration: null
                })
                reject()
              })
            })
          },
          onCancel() {

          },
        })
      } catch {
        notification.error({
          message: '喔吼，导入失败了，怎么办，联系网站作者吧',
          duration: null
        })
      }
    }
    reader.readAsText(file, 'UTF-8')
  })
}
</script>

<template>
  <div>
    <a-modal title="文件上传" v-model:open="open">
      <a-upload-dragger
          v-model:fileList="file"
          :before-upload="()=> false"
          list-type="picture"
          :maxCount="1"
          accept=".txt"
          :preview-file="previewFile"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">单击或拖动文件到此区域进行上传</p>
        <p class="ant-upload-hint">
          仅支持单个文件上传，请不要上传多个文件。
        </p>
      </a-upload-dragger>
    </a-modal>
  </div>
</template>

<style scoped lang="scss">

</style>