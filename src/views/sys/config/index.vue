<template>
  <el-card>
    <el-space>
      <el-space>
        <el-button v-auth="'sys:config:add'" icon="Plus" type="primary" @click="addOrUpdateHandle()">
          {{ $t('add') }}
        </el-button>
      </el-space>
      <el-space>
        <el-button v-auth="'sys:config:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">
          {{ $t('batchDel') }}
        </el-button>
      </el-space>
    </el-space>

    <el-table
      v-loading="state.dataListLoading"
      show-overflow-tooltip
      :data="state.dataList"
      border
      class="layout-table"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column type="index" :label="$t('index')" align="center" width="70" />
      <el-table-column prop="value" :label="$t('config.name')" align="center" />
      <el-table-column prop="valueNum" :label="$t('config.value')" align="center" />
      <el-table-column prop="recordDate" :label="$t('config.date')" align="center" />
      <el-table-column prop="memo" :label="$t('config.remark')" align="center" />
      <el-table-column :label="$t('handle')" fixed="right" align="center" width="150">
        <template #default="{ row }">
          <el-button v-auth="'sys:config:update'" type="primary" link @click="addOrUpdateHandle(row as ListVO)">
            {{ $t('edit') }}
          </el-button>
          <el-button v-auth="'sys:config:delete'" type="primary" link @click="deleteBatchHandle((row as ListVO).id)">
            {{ $t('delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate ref="addOrUpdateRef" @refresh-data-list="getDataList" />
  </el-card>
</template>

<script setup lang="ts" name="SysConfigIndex">
import { reactive, ref } from 'vue'

import { useCrud } from '@/hooks/useCrud'

import AddOrUpdate from './components/AddOrUpdate.vue'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { ListVO } from './data.d'

const state: IHooksOptions<{}, ListVO> = reactive({
  dataListUrl: '/system-service/tenant/setting/list',
  deleteUrl: '/system-service/tenant/setting/delete',
  isPage: false,
  queryForm: {},
})

const { getDataList, selectionChangeHandle, deleteBatchHandle } = useCrud<{}, ListVO>(state)

const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: ListVO) => {
  addOrUpdateRef.value.init(row)
}
</script>
