<template>
  <el-space>
    <el-form :inline="true" :model="state.queryForm">
      <el-form-item prop="value">
        <el-input v-model="state.queryForm.value" :placeholder="$t('dict.value')" />
      </el-form-item>
      <el-form-item prop="frontName">
        <el-input v-model="state.queryForm.frontName" :placeholder="$t('dict.frontName')" />
      </el-form-item>
      <el-form-item prop="frontOption">
        <el-input v-model="state.queryForm.frontOption" :placeholder="$t('dict.frontOption')" />
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
      </el-form-item>
    </el-form>
  </el-space>
  <el-space>
    <el-button icon="Plus" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
    <el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()">{{ $t('batchDel') }}</el-button>
  </el-space>
  <el-table
    v-loading="state.dataListLoading"
    :data="state.dataList"
    border
    show-overflow-tooltip
    class="layout-table"
    @selection-change="selectionChangeHandle"
    @sort-change="sortChangeHandle"
  >
    <el-table-column type="selection" align="center" width="50" />
    <el-table-column prop="value" :label="$t('dict.value')" align="center" />
    <el-table-column prop="name" :label="$t('dict.label')" align="center" />
    <el-table-column prop="frontName" :label="$t('dict.frontName')" align="center" />
    <el-table-column prop="frontOption" :label="$t('dict.frontOption')" align="center" />
    <el-table-column prop="isSys" :label="$t('dict.isSys')" align="center">
      <template #default="{ row }">
        {{ enableMap[(row as DictListVO).isSys] }}
      </template>
    </el-table-column>
    <el-table-column prop="inure" :label="$t('dict.inure')" align="center">
      <template #default="{ row }">
        {{ enableMap[(row as DictListVO).inure] }}
      </template>
    </el-table-column>
    <el-table-column prop="isDef" :label="$t('dict.isDef')" align="center">
      <template #default="{ row }">
        {{ enableMap[(row as DictListVO).isDef] }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('handle')" fixed="right" align="center" width="150">
      <template #default="{ row }">
        <el-button type="primary" link @click="addOrUpdateHandle(row as DictListVO)">{{ $t('edit') }}</el-button>
        <el-button type="primary" link @click="deleteBatchHandle((row as DictListVO).id)">{{ $t('delete') }}</el-button>
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
  />
  <!-- 新增 / 修改 -->
  <AddOrUpdate ref="addOrUpdateRef" @refresh-data-list="getDataList" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import AddOrUpdate from './DataAddOrUpdate.vue'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { SearchDictDTO, DictListVO } from '../data.d'

import { useCrud } from '@/hooks/useCrud'
import { useMap } from '@/hooks/useMap'

const { enableMap } = useMap()

const props = defineProps<{
  tcmId: string
}>()

const state: IHooksOptions<SearchDictDTO, DictListVO> = reactive({
  dataListUrl: '/system-service/tpConfig/page',
  deleteUrl: '/system-service/tpConfig/delete',
  primaryKey: 'id',
  queryForm: {
    tcmId: props.tcmId,
    value: '',
    frontName: '',
    frontOption: '',
  },
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: DictListVO) => {
  addOrUpdateRef.value.init(props.tcmId, row)
}

const {
  getDataList,
  sizeChangeHandle,
  selectionChangeHandle,
  sortChangeHandle,
  currentChangeHandle,
  deleteBatchHandle,
} = useCrud(state)
</script>
