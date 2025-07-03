<template>
  <el-card>
    <el-space>
      <el-space>
        <el-button v-auth="'sys:menu:save'" icon="Plus" type="primary" @click="addOrUpdateHandle(false)">
          {{ $t('add') }}
        </el-button>
      </el-space>
      <el-space>
        <el-button plain @click="toggleExpandAll()">
          <template v-if="!isExpandAll">
            {{ $t('expandAll') }}&nbsp;<el-icon><ArrowDown /></el-icon>
          </template>
          <template v-else>
            {{ $t('foldAll') }}&nbsp;<el-icon><ArrowUp /></el-icon>
          </template>
        </el-button>
      </el-space>
    </el-space>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :default-expand-all="isExpandAll"
      :data="appStore.appList"
      show-overflow-tooltip
      row-key="code"
      border
      class="layout-table"
      :tree-props="{
        children: 'subFunctionList',
      }"
    >
      <el-table-column prop="name" :label="$t('menu.name')" min-width="150" />
      <el-table-column prop="icon" :label="$t('menu.icon')" align="center" width="120">
        <template #default="{ row }">
          <ma-icon :icon="row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="type" :label="$t('menu.type')" align="center" width="150">
        <template #default="{ row }">
          <el-tag :type="typeMap[(row as App).type].type">{{ typeMap[(row as App).type].value }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="openStyle" label="打开方式" align="center">
        <template #default="{ row }">
          <span v-if="row.type !== 0"></span>
          <el-tag v-else-if="row.openStyle === 0">内部打开</el-tag>
          <el-tag v-else type="info">外部打开</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="url" :label="$t('menu.url')" align="center" width="150" />
      <el-table-column prop="pluginName" :label="$t('menu.component')" align="center" width="100" />
      <el-table-column prop="authority" :label="$t('menu.auth')" align="center" />
      <el-table-column prop="comments" :label="$t('menu.remarks')" align="center" />
      <el-table-column :label="$t('handle')" fixed="right" align="center" width="160">
        <template #default="{ row }">
          <el-button
            v-if="row.type !== '3'"
            v-auth="'sys:menu:save'"
            type="primary"
            link
            @click="addOrUpdateHandle(false, row as App)"
          >
            {{ $t('add') }}
          </el-button>
          <template v-if="row.type !== '99'">
            <el-button v-auth="'sys:menu:update'" type="primary" link @click="addOrUpdateHandle(true, row as App)">
              {{ $t('edit') }}
            </el-button>
            <el-button v-auth="'sys:menu:delete'" type="primary" link @click="deleteHandle(row as App)">
              {{ $t('delete') }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <AddOrUpdate ref="addOrUpdateRef" @refresh-data-list="getDataList" />
  </el-card>
</template>

<script setup lang="ts" name="SysMenuIndex">
import { reactive, ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useAppStore } from '@/store/modules/app'

import AddOrUpdate from './components/AddOrUpdate.vue'

import { useMap } from './hooks/useMap'

import { App } from './data.d'

import { funcRemove, buttonRemove } from './service'

const { t } = useI18n()

const appStore = useAppStore()

const { typeMap } = useMap()

const loading = ref(false)

const addOrUpdateRef = ref()
const addOrUpdateHandle = (isUpdate: boolean, row?: App) => {
  addOrUpdateRef.value.init(isUpdate, row)
}

const getDataList = (type: string) => {
  loading.value = true
  ;(type === '3' ? appStore.getBtnList() : appStore.getFuncList()).then(() => {
    getData()
  })
}

const deleteHandle = ({ type, guid }: App) => {
  ElMessageBox.confirm(t('tip.del'), t('tip.tip'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  }).then(() => {
    loading.value = true
    if (type === '3') {
      buttonRemove(guid).then((res) => {
        if (res) {
          appStore.getBtnList().then(() => {
            getData()
          })
        }
      })
    } else {
      funcRemove(guid).then((res) => {
        if (res) {
          appStore.getFuncList().then(() => {
            getData()
          })
        }
      })
    }
  })
}
const getData = () => {
  appStore.getAppListAction()
  loading.value = false
}

// 是否展开，默认全部折叠
const isExpandAll = ref(false)
// 是否重新渲染表格状态
const refreshTable = ref(true)

// 切换 展开和折叠
const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}
</script>
