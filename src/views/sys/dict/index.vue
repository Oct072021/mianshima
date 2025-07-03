<template>
  <el-card class="layout-query">
    <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
      <el-form-item prop="tcmName">
        <el-input v-model="state.queryForm.tcmName" :placeholder="$t('dict.name')" />
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
        <el-button v-auth="'sys:dict:add'" icon="Plus" type="primary" @click="addOrUpdateHandle()">
          {{ $t('add') }}
        </el-button>
      </el-space>
      <el-space>
        <el-button v-auth="'sys:dict:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">
          {{ $t('batchDel') }}
        </el-button>
      </el-space>
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
      <el-table-column prop="tcmNum" :label="$t('dict.code')" align="center" />
      <el-table-column prop="tcmName" :label="$t('dict.name')" align="center" />
      <el-table-column prop="remark" :label="$t('dict.remarks')" align="center" />
      <el-table-column prop="isSys" :label="$t('dict.isSys')" align="center">
        <template #default="{ row }">
          {{ enableMap[(row as ListVO).isSys] }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('dict.createTime')" align="center" width="180" />
      <el-table-column :label="$t('handle')" fixed="right" align="center" width="200">
        <template #default="{ row }">
          <el-button v-auth="'sys:dict:setting'" type="primary" link @click="showDictDataHandle(row)">
            {{ $t('dict.setting') }}
          </el-button>
          <el-button v-auth="'sys:dict:update'" type="primary" link @click="addOrUpdateHandle(row as ListVO)">
            {{ $t('edit') }}
          </el-button>
          <el-button v-auth="'sys:dict:delete'" type="primary" link @click="deleteBatchHandle((row as ListVO).tcmId)">
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
    <!-- 新增 / 修改 -->
    <AddOrUpdate ref="addOrUpdateRef" @refresh-data-list="getDataList" />

    <!-- 字典配置 -->
    <el-drawer
      v-if="dictDataVisible"
      v-model="dictDataVisible"
      :title="dictDataTitle"
      :size="900"
      :close-on-press-escape="false"
    >
      <DictData :tcm-id="tcmId" />
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts" name="SysDictIndex">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AddOrUpdate from './components/TypeAddOrUpdate.vue'
import DictData from './components/Data.vue'

import { useCrud } from '@/hooks/useCrud'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { SearchDTO, ListVO } from './data.d'

import { useMap } from '@/hooks/useMap'

const { enableMap } = useMap()

const { t } = useI18n()

const state: IHooksOptions<SearchDTO, ListVO> = reactive({
  dataListUrl: '/system-service/tpConfigMain/page',
  deleteUrl: '/system-service/tpConfigMain/delete',
  primaryKey: 'tcmId',
  queryForm: {
    tcmName: '',
  },
})

const dictDataVisible = ref(false)
const dictDataTitle = ref()
const tcmId = ref()
const showDictDataHandle = (row: ListVO) => {
  tcmId.value = row.tcmId
  dictDataTitle.value = t('dict.setting') + ' - ' + row.tcmNum
  dictDataVisible.value = true
}

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: ListVO) => {
  addOrUpdateRef.value.init(row)
}

const {
  getDataList,
  sizeChangeHandle,
  selectionChangeHandle,
  sortChangeHandle,
  currentChangeHandle,
  deleteBatchHandle,
  reset,
} = useCrud<SearchDTO, ListVO>(state)
</script>
