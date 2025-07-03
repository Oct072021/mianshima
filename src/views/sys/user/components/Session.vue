<template>
  <el-form :inline="true" :model="state.queryForm">
    <el-form-item>
      <el-button icon="Delete" plain type="danger" @click="handleOfflineAll()">{{ $t('offlineAll') }}</el-button>
    </el-form-item>
  </el-form>

  <el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
    <el-table-column type="index" :label="$t('index')" align="center" width="70" />
    <el-table-column prop="ipAddr" :label="$t('online.ip')" align="center" />
    <el-table-column prop="loginLocation" :label="$t('online.addr')" align="center" />
    <el-table-column prop="loginTime" :label="$t('online.loginTime')" align="center">
      <template #default="{ row }">
        {{ dayjs((row as SessionListVO).loginTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('handle')" fixed="right" align="center" width="150">
      <template #default="{ row }">
        <el-button type="primary" link @click="handleOffline(row as SessionListVO)">
          {{ t('offline') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCrud } from '@/hooks/useCrud'
import dayjs from 'dayjs'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { ListVO, SessionListVO, SearchDTO } from '../data.d'

import { offline, offlineAll } from '../service'

const { t } = useI18n()

const props = defineProps<{
  user: ListVO
}>()

const state: IHooksOptions<Pick<SearchDTO, 'userName'>, SessionListVO> = reactive({
  dataListUrl: '/system-service/auth/online/session',
  isPage: false,
  queryForm: {
    userName: props.user.userCode,
  },
})
const { getDataList } = useCrud<Pick<SearchDTO, 'userName'>, SessionListVO>(state)

const handleOfflineAll = async () => {
  const res = await offlineAll(props.user.userGuid)
  if (res) getDataList()
}
const handleOffline = async (row: SessionListVO) => {
  const res = await offline(row.ticket)
  if (res) getDataList()
}
</script>
