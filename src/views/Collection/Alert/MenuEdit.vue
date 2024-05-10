<template>
  <div class="MenuEdit">
    <a-modal
        v-model:open="open"
        title="修改"
        @ok="handleOk"
        ok-text="确认"
        cancel-text="取消"
        :destroyOnClose="true"
        style="top: 200px"
    >
      <a-form
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          :model="data.value"
          ref="formRef"
      >
        <a-form-item
            label="分类名称"
            name="title"
            :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]"
        >
          <a-input type="text" autocomplete="off" v-model:value="data.value.title"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup>
import {ref, defineEmits, reactive, defineExpose} from "vue"
import {setTableData} from '@/Untils/indexedDB.js'

import XEUtils from 'xe-utils'
import {message} from "ant-design-vue";

const open = ref(false)
const data = reactive({})
const emits = defineEmits(['resetData'])

const edit = function (parent) {
  open.value = true
  data.value = XEUtils.clone(parent)
}
const formRef = ref()

const handleOk = function () {
  formRef.value.validate().then(() => {
    let id = data.value.id
    delete data.value.children
    setTableData(id, data.value).then(() => {
      message.success('修改成功！')
      emits('resetData')
      open.value = false
    })
  }).catch((e) => {
    message.error(e.errorFields?.at(0).errors.at(0) || '未知错误！')
  })
}
defineExpose({
  edit
})

</script>

<style scoped lang="scss">


</style>