<template>
  <el-card class="layout-query">
    <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item prop="userName">
        <el-input v-model="state.queryForm.userName" :placeholder="$t('log.name')" />
      </el-form-item>
      <el-form-item prop="address">
        <el-input v-model="state.queryForm.address" :placeholder="$t('log.addr')" />
      </el-form-item>
      <el-form-item prop="statusLabel">
        <el-select v-model="state.queryForm.statusLabel" :placeholder="$t('log.loginStatus')">
          <el-option
            v-for="key in Object.keys(loginStatusMap)"
            :key="key"
            :label="loginStatusMap[key].label"
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
      <el-button icon="Download" @click="downloadHandle('/system-service/log/login/export')">
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
      <el-table-column prop="userName" :label="$t('log.name')" align="center" />
      <el-table-column prop="ipAddress" :label="$t('log.ip')" align="center" />
      <el-table-column prop="address" :label="$t('log.addr')" align="center" />
      <el-table-column prop="userAgent" :label="$t('log.agent')" align="center" />
      <el-table-column prop="statusLabel" :label="$t('log.loginStatus')" align="center">
        <template #default="{ row }">
          <el-tag :type="loginStatusMap[row.statusLabel]?.type">{{ loginStatusMap[row.statusLabel]?.label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operationLabel" :label="$t('log.operation')" align="center">
        <template #default="{ row }">
          <el-tag :type="operateStatusMap[row.operationLabel]?.type">
            {{ operateStatusMap[row.operationLabel]?.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('log.createTime')" align="center" width="165" />
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
  </el-card>
</template>

<script setup lang="ts" name="SysLogLogin">
import { reactive, ref } from 'vue'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { LoginLogSearchDTO, LoginLogListVO } from './data.d'
import type { FormInstance } from 'element-plus'

import { useCrud } from '@/hooks/useCrud/index'
import { useMap } from './hooks/useMap'
import dayjs from 'dayjs'

const { loginStatusMap, operateStatusMap } = useMap()

const temp = ref<string[]>([dayjs().subtract(1, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')])
const changeDate = (val: string[]) => {
  state.queryForm.startDate = val ? val[0] : ''
  state.queryForm.endDate = val ? val[1] : ''
}

const state: IHooksOptions<LoginLogSearchDTO, LoginLogListVO> = reactive({
  dataListUrl: '/system-service/log/login/page',
  queryForm: {
    userName: '',
    address: '',
    statusLabel: '',
    startDate: temp.value[0],
    endDate: temp.value[1],
  },
})

const queryRef = ref<FormInstance>()

const { getDataList, sizeChangeHandle, currentChangeHandle, downloadHandle, reset } = useCrud<
  LoginLogSearchDTO,
  LoginLogListVO
>(state)

const handleReset = () => {
  temp.value = [dayjs().subtract(1, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
  state.queryForm.startDate = temp.value[0]
  state.queryForm.endDate = temp.value[1]
  reset(queryRef.value!)
}
</script>
