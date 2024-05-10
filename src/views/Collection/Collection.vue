<template>
  <div class="collection">
    <div class="main">
      <a-row :gutter="15">
        <a-col :xs="24" :sm="6" :md="4" class="a-col">
          <div class="Sidebar">
            <Sidebar :list="data" :activeId="activeId" @setActive="setActive" @resetData="getData" :Edit="Edit"/>
          </div>
        </a-col>
        <a-col :xs="24" :sm="18" :md="20" class="a-col">
          <div class="Content">
            <Content ref="content" @callBackId="getActiveId" @resetData="getData" :list="data" :Edit="Edit"/>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-float-button class="EditBtn" @click="Edit = !Edit">
      <template #icon>
        <FormOutlined class="btnIcon"/>
      </template>
    </a-float-button>
  </div>

</template>
<script setup>
import {getUserTableData} from '@/Untils/indexedDB.js'
import {ref} from "vue";
import {FormOutlined} from '@ant-design/icons-vue';
import Sidebar from "@/views/Collection/components/Sidebar.vue";
import Content from "@/views/Collection/components/Content.vue";

const data = ref([])
const getData = function () {
  getUserTableData().then(res => {
    data.value = res
  })
}
getData()
const activeId = ref(null)
const Edit = ref(false)

function getActiveId(id) {
  activeId.value = id
}

const content = ref(null);

function setActive(id) {
  content.value.scroll(id)
}


</script>

<style scoped lang="scss">
.a-col {
  transition: all .5s;
}

.EditBtn {
  right: 100px;
  bottom: 100px;
  width: 50px;
  height: 50px;

  .btnIcon {
    font-size: 22px;
  }
}
</style>