<template>
  <el-card class="layout-query">
    <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item prop="paramKey">
        <el-input v-model="state.queryForm.paramKey" :placeholder="$t('param.key')" />
      </el-form-item>
      <el-form-item prop="paramValue">
        <el-input v-model="state.queryForm.paramValue" :placeholder="$t('param.value')" />
      </el-form-item>
      <el-form-item prop="paramType">
        <el-select v-model="state.queryForm.paramType" :placeholder="$t('param.type')" clearable>
          <el-option v-for="key in Object.keys(enableMap)" :key="key" :label="enableMap[+key]" :value="+key" />
        </el-select>
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
        <el-button v-auth="'sys:param:add'" icon="Plus" type="primary" @click="addOrUpdateHandle()">
          {{ $t('add') }}
        </el-button>
      </el-space>
      <el-space>
        <el-button v-auth="'sys:param:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">
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
      <el-table-column prop="paramName" :label="$t('param.name')" align="center" />
      <el-table-column prop="paramKey" :label="$t('param.key')" align="center" />
      <el-table-column prop="paramValue" :label="$t('param.value')" align="center" />
      <el-table-column prop="paramType" :label="$t('param.type')" align="center">
        <template #default="{ row }">
          <el-tag :type="row.paramType ? 'success' : 'danger'">{{ enableMap[(row as ListVO).paramType] }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('param.remark')" align="center" />
      <el-table-column prop="createTime" :label="$t('param.createTime')" align="center" />
      <el-table-column :label="$t('handle')" fixed="right" align="center" width="150">
        <template #default="{ row }">
          <el-button v-auth="'sys:param:update'" type="primary" link @click="addOrUpdateHandle(row as ListVO)">
            {{ $t('edit') }}
          </el-button>
          <el-button
            v-auth="'sys:param:delete'"
            type="primary"
            link
            @click="deleteBatchHandle((row as ListVO).id)"
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

import { useMap } from '@/hooks/useMap'
import { useCrud } from '@/hooks/useCrud'

import { SearchDTO, ListVO } from './data.d'
import { IHooksOptions } from '@/hooks/useCrud/data.d'

const { enableMap } = useMap()

const state: IHooksOptions<SearchDTO, ListVO> = reactive({
  dataListUrl: '/system-service/params/page',
  deleteUrl: '/system-service/params/delete',
  queryForm: {
    paramType: '',
    paramKey: '',
    paramValue: '',
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
