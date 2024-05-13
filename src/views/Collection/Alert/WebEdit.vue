<template>
  <div class="webEdit">
    <a-modal v-model:open="open" title="修改" @ok="handleOk" @cancel="handleClose" ok-text="确认" cancel-text="取消"
             :destroyOnClose="true">
      <a-spin :spinning="load" tip="获取网页图标中.....">
        <div class="model" ref="model">
          <div class="modelHeader">
            <a-tooltip placement="top" :open="tipsShow" :getPopupContainer="getPopupContainer">
              <template #title>
                <span>{{ data.value.synopsis }}</span>
              </template>
              <div class="webBox">
                <div class="webImg">
                  <img :src="data.value?.imgUrl ? data.value.imgUrl : emptyImg" ref="myImg" alt="">
                </div>
                <div class="webName">{{ data.value.webName }}</div>
              </div>
            </a-tooltip>
          </div>
          <a-divider/>
          <a-form
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              :model="data.value"
              :rules="rules"
              ref="formRef"
          >
            <a-form-item
                label="分类"
                name="parentId"
            >
              <a-select v-model:value="data.value.parentId" :options="selectOptions">
              </a-select>
            </a-form-item>
            <a-form-item
                label="网站名称"
                name="webName"
            >
              <a-input type="text" autocomplete="off" v-model:value="data.value.webName"/>
            </a-form-item>
            <a-form-item
                label="简介"
                name="synopsis"
            >
              <a-input autocomplete="off" v-model:value="data.value.synopsis"/>
            </a-form-item>
            <a-form-item
                label="网页地址"
                name="url"
                has-feedback
            >
              <a-input-group compact>
                <a-input v-model:value="data.value.url" autocomplete="off" :allowClear="true"
                         style="width: calc(100% - 120px)"/>
                <a-button style="width: 120px" type="primary" @click="getAWebIcon">获取网页图标</a-button>
              </a-input-group>
            </a-form-item>
            <a-form-item
                label="网页图标地址"
                name="imgUrl"
                has-feedback
            >
              <a-input :allowClear="true" autocomplete="off" v-model:value="data.value.imgUrl"/>
            </a-form-item>
          </a-form>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>
<script setup>
import emptyImg from '@/assets/imgs/empty.svg'
import {reactive, ref, watch} from "vue"
import {addTableData, setTableData} from '@/Untils/indexedDB.js'
import {message} from 'ant-design-vue';
import XEUtils from 'xe-utils'

const model = ref()
const getPopupContainer = () => {
  return model.value;
};
const emit = defineEmits(['resetData'])
const open = ref(false)
// 表单数据
const data = reactive({})
// 下拉框数据
const selectOptions = ref([])
// 提示
const tipsShow = ref(false)

let state = null
watch(() => [data.value?.synopsis], () => {
  setTimeout(() => {
    tipsShow.value = !!data.value.synopsis;
  }, 300)
})
const edit = function (child, options, type) {
  state = type
  open.value = true
  selectOptions.value = XEUtils.clone(options)
  setTimeout(() => {
    if (child.synopsis) tipsShow.value = true
  }, 300)
  if (state === 'edit') {
    data.value = XEUtils.clone(child)
    if (data.value.imgUrl === emptyImg) {
      data.value.imgUrl = ''
    }
  }
  if (state === 'add') {
    data.value = {
      parentId: child,
      webName: '',
      synopsis: '',
      url: '',
      imgUrl: ''
    }
  }
}

// 表单验证
const formRef = ref();
const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/;

const validateUrl = async (Rule, value) => {
  if (value === '') return Promise.reject('请输入网页地址')
  if (!urlPattern.test(value)) return Promise.reject('请输入正确的网页地址')
  return Promise.resolve()
}
const validateImgUrl = async (Rule, value) => {
  if (value === '') return Promise.resolve()
  if (!urlPattern.test(value)) return Promise.reject('请输入正确的网页图标地址')
  return Promise.resolve()
}
const rules = {
  webName: [{required: true, message: '请输入网站名称'}],
  url: [{required: true, target: 'change', validator: validateUrl}],
  imgUrl: [{target: 'change', validator: validateImgUrl}]
}

const handleOk = function () {
  if (load.value) {
    message.warning('请等待图标加载完成哦')
    return
  }
  formRef.value.validate().then(() => {
    if (!data.value.imgUrl) data.value.imgUrl = emptyImg
    if (state === 'edit') {
      delete data.value.children
      let id = data.value.id
      setTableData(id, data.value).then(() => {
        message.success('修改成功！')
        open.value = false
        tipsShow.value = false
        emit('resetData')
      })
    }
    if (state === 'add') {
      let addData = XEUtils.clone(data.value)
      addTableData(addData).then(() => {
        message.success('新增成功！')
        open.value = false
        tipsShow.value = false
        emit('resetData')
      })
    }
  }).catch((e) => {
    message.error(e.errorFields?.at(0).errors.at(0) || '未知错误！')
  })
}

const handleClose = function () {
  tipsShow.value = false
}
const myImg = ref(null)
const load = ref(false)

const getAWebIcon = () => {
  const imgUrl = `https://api.iowen.cn/favicon/${XEUtils.parseUrl(data.value.url).hostname}.png`;
  if (imgUrl === data.value.imgUrl) return;
  load.value = true;
  data.value.imgUrl = imgUrl;
  const onLoad = () => handleImageLoad(true, '图标获取成功！');
  const onError = () => handleImageLoad(false, '图标获取失败！');
  myImg.value.addEventListener('load', onLoad);
  myImg.value.addEventListener('error', onError);

  const handleImageLoad = (success, tip) => {
    load.value = false;
    data.value.imgUrl = success ? imgUrl : '';
    message[success ? 'success' : 'error'](tip);
    myImg.value.removeEventListener('load', onLoad);
    myImg.value.removeEventListener('error', onError);
  };
};

defineExpose({
  edit,
})
</script>
<style lang="scss" scoped>
.model {
  .modelHeader {
    padding-top: 50px;

    .webBox {
      display: flex;
      width: 200px;
      align-items: center;
      background-color: white;
      padding: 10px;
      cursor: pointer;
      border-radius: 5px;
      transition: all .5s;
      position: relative;
      margin: 0 auto;
      box-shadow: 0 15px 30px rgba(0, 0, 0, .1);
      transform: translate3d(0, -2px, 0);

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
  }
}

</style>