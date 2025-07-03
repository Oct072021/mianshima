<template>
  <el-card class="layout-query">
    <el-form ref="queryRef" :inline="true" :model="queryForm" @keyup.enter="getDataList()">
      <el-form-item prop="name">
        <el-input v-model="queryForm.name" :placeholder="$t('application.name')" />
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="RefreshRight" @click="reset()">{{ $t('reset') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card>
    <el-space>
      <el-space>
        <el-button v-auth="'sys:application:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">
          {{ $t('add') }}
        </el-button>
      </el-space>
    </el-space>

    <el-table v-loading="loading" :data="tableData" show-overflow-tooltip border class="layout-table">
      <el-table-column type="index" :label="$t('index')" width="60" align="center" />
      <el-table-column prop="name" :label="$t('application.name')" align="center" />
      <el-table-column prop="code" :label="$t('application.code')" align="center" />
      <el-table-column prop="icon" :label="$t('application.icon')" align="center" width="120">
        <template #default="{ row }">
          <ma-icon :icon="(row as App).icon" />
        </template>
      </el-table-column>
      <el-table-column prop="comments" :label="$t('application.remarks')" align="center" />
      <el-table-column :label="$t('handle')" fixed="right" align="center" width="160">
        <template #default="{ row }">
          <el-button
            v-auth="'sys:application:update'"
            type="primary"
            link
            @click="addOrUpdateHandle((row as App).code)"
          >
            {{ $t('edit') }}
          </el-button>
          <el-button v-auth="'sys:application:delete'" type="danger" link @click="remove((row as App).guid)">
            {{ $t('delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddOrUpdate ref="addOrUpdateRef" @refresh-data-list="getDataList" />
  </el-card>
</template>

<script setup lang="ts" name="SysApplicationIndex">
import { reactive, ref, nextTick, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from 'vue-i18n'

import AddOrUpdate from './components/AddOrUpdate.vue'

import { App } from './data.d'
import { ElMessageBox, FormInstance } from 'element-plus'

import { removeApp } from './service'

const { t } = useI18n()

const appStore = useAppStore()

const addOrUpdateRef = ref()
const addOrUpdateHandle = (code?: string) => {
  addOrUpdateRef.value.init(code)
}

const loading = ref(false)

const remove = (guid: string) => {
  ElMessageBox.confirm(t('tip.del'), t('tip.tip'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  }).then(() => {
    loading.value = true
    removeApp(guid).then((res) => {
      if (res)
        appStore.getAppList().then(() => {
          getData()
        })
    })
  })
}

const getDataList = () => {
  loading.value = true
  appStore.getAppList().then(() => {
    getData()
  })
}
const getData = () => {
  appStore.getAppListAction()
  loading.value = false
}

const tableData = computed(() => {
  return appStore.appList.filter(({ name }) => {
    if (queryForm.name.length) {
      return name === queryForm.name
    } else {
      return true
    }
  })
})
const queryRef = ref<FormInstance>()
const queryForm = reactive<Pick<App, 'name'>>({
  name: '',
})
const reset = () => {
  queryRef.value?.resetFields()
  getDataList()
}
</script>
