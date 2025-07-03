<template>
  <el-card class="layout-query">
    <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item prop="paramKey">
        <el-input v-model="state.queryForm.pluginName" :placeholder="$t('plugin.name')" />
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="RefreshRight" @click="reset(queryRef)">{{ $t('reset') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card>
    <el-space>
      <el-space>
        <el-button v-auth="'sys:plugin:add'" icon="Plus" type="primary" @click="addOrUpdateHandle()">
          {{ $t('add') }}
        </el-button>
      </el-space>
      <el-space>
        <el-button v-auth="'sys:plugin:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">
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
      <el-table-column prop="pluginName" :label="$t('plugin.name')" align="center" />
      <el-table-column prop="pluginUrl" :label="$t('plugin.url')" align="center" />
      <el-table-column prop="comments" :label="$t('plugin.remark')" align="center" />
      <el-table-column prop="createTime" :label="$t('plugin.createTime')" align="center" />
      <el-table-column :label="$t('handle')" fixed="right" align="center" width="150">
        <template #default="{ row }">
          <el-button v-auth="'sys:plugin:update'" type="primary" link @click="addOrUpdateHandle(row as ListVO)">
            {{ $t('edit') }}
          </el-button>
          <el-button
            v-auth="'sys:plugin:delete'"
            type="primary"
            link
            @click="deleteBatchHandle((row as ListVO).pluginGuid)"
          >
            {{ $t('delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="state.page"
      :page-sizes="state.pageSizes"
      :page-size="state.limit"
      :total="state.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    >
    </el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate ref="addOrUpdateRef" @refresh-data-list="getDataList" />
  </el-card>
</template>

<script setup lang="ts" name="SysParamsIndex">
import { reactive, ref } from 'vue'

import AddOrUpdate from './components/AddOrUpdate.vue'

import { useCrud } from '@/hooks/useCrud'

import { SearchDTO, ListVO } from './data.d'
import { IHooksOptions } from '@/hooks/useCrud/data.d'

const state: IHooksOptions<SearchDTO, ListVO> = reactive({
  dataListUrl: '/system-service/plugin/page',
  deleteUrl: '/system-service/plugin/delete',
  primaryKey: 'pluginGuid',
  queryForm: {
    pluginName: '',
  },
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: ListVO) => {
  addOrUpdateRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud<
  SearchDTO,
  ListVO
>(state)
</script>
