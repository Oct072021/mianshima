<template>
  <el-card class="layout-query">
    <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item prop="realName">
        <el-input v-model="state.queryForm.realName" :placeholder="$t('log.name')" />
      </el-form-item>
      <el-form-item prop="module">
        <el-input v-model="state.queryForm.module" :placeholder="$t('log.module')" />
      </el-form-item>
      <el-form-item prop="reqUri">
        <el-input v-model="state.queryForm.reqUri" :placeholder="$t('log.url')" />
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="state.queryForm.status" :placeholder="$t('log.operateStatus')">
          <el-option
            v-for="key in Object.keys(operateLogStatusMap)"
            :key="key"
            :label="operateLogStatusMap[+key].label"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="temp"
          type="daterange"
          :range-separator="$t('to')"
          :start-placeholder="$t('startDate')"
          :end-placeholder="$t('endDate')"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :clearable="false"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="RefreshRight" @click="handleReset">{{ $t('reset') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card>
    <el-space>
      <el-button icon="Download" @click="downloadHandle('/system-service/log/operate/export')">
        {{ $t('export') }}
      </el-button>
    </el-space>

    <el-table
      v-loading="state.dataListLoading"
      show-overflow-tooltip
      :data="state.dataList"
      border
      class="layout-table"
    >
      <el-table-column type="index" :label="$t('index')" align="center" width="70" />
      <el-table-column prop="realName" :label="$t('log.name')" align="center" />
      <el-table-column prop="module" :label="$t('log.module')" align="center" />
      <el-table-column prop="reqUri" :label="$t('log.url')" align="center" />
      <el-table-column prop="reqMethod" :label="$t('log.method')" align="center" />
      <el-table-column prop="address" :label="$t('log.addr')" align="center" />
      <el-table-column prop="duration" :label="$t('log.duration')" align="center">
        <template #default="{ row }"> {{ row.duration }}ms </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('log.operateStatus')" align="center">
        <template #default="{ row }">
          <el-tag :type="operateLogStatusMap[row.status]?.type"> {{ operateLogStatusMap[row.status]?.label }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('log.createTime')" align="center" />
      <el-table-column :label="$t('handle')" fixed="right" align="center" width="80">
        <template #default="{ row }">
          <el-button type="primary" link @click="detailHandle(row as OperateLogListVO)">{{ $t('detail') }}</el-button>
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

    <!-- 详情 -->
    <OperateDetail ref="detailRef" />
  </el-card>
</template>

<script setup lang="ts" name="SysLogOperate">
import { reactive, ref } from 'vue'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { OperateLogSearchDTO, OperateLogListVO } from './data.d'
import type { FormInstance } from 'element-plus'

import OperateDetail from './components/OperateDetail.vue'

import { useCrud } from '@/hooks/useCrud'
import { useMap } from './hooks/useMap'
import dayjs from 'dayjs'


const { operateLogStatusMap } = useMap()

const temp = ref<string[]>([dayjs().subtract(1, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')])
const changeDate = (val: string[]) => {
  state.queryForm.startDate = val ? val[0] : ''
  state.queryForm.endDate = val ? val[1] : ''
}

const state: IHooksOptions<OperateLogSearchDTO, OperateLogListVO> = reactive({
  dataListUrl: '/system-service/log/operate/page',
  queryForm: {
    realName: '',
    module: '',
    reqUri: '',
    status: '',
    startDate: temp.value[0],
    endDate: temp.value[1],
  },
})

const queryRef = ref<FormInstance>()
const detailRef = ref()
const detailHandle = (row: OperateLogListVO) => {
  detailRef.value.init(row)
}

const { getDataList, sizeChangeHandle, currentChangeHandle, downloadHandle, reset } = useCrud<
  OperateLogSearchDTO,
  OperateLogListVO
>(state)

const handleReset = () => {
  temp.value = [dayjs().subtract(1, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
  state.queryForm.startDate = temp.value[0]
  state.queryForm.endDate = temp.value[1]
  reset(queryRef.value!)
}
</script>
