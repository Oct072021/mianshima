<template>
  <el-card>
    <el-table show-overflow-tooltip :data="onlineStore.onlineUser" border class="layout-table">
      <el-table-column type="index" :label="$t('index')" align="center" width="70" />
      <el-table-column prop="userName" :label="$t('online.name')" align="center" />
      <el-table-column prop="userCode" :label="$t('online.code')" align="center" />
      <el-table-column prop="loginLocation" :label="$t('online.addr')" align="center" />
      <el-table-column prop="ipAddr" :label="$t('online.ip')" align="center" />
      <el-table-column prop="loginTime" :label="$t('online.loginTime')" align="center">
        <template #default="{ row }">
          {{ dayjs(row.loginTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts" name="SysOnlineIndex">
import { reactive, ref } from 'vue'
import { useOnlineStore } from '@/store/modules/online'
import dayjs from 'dayjs'

const onlineStore = useOnlineStore()
</script>
