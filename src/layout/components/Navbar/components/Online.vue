<template>
  <el-badge :value="onlineStore.onlineUser.length" :offset="[0, 10]">
    <ma-icon icon="icon-user" @click="router.push('/online')">
      {{ $t('onlineUser') }}
    </ma-icon>
  </el-badge>
</template>

<script setup lang="ts">
import { useOnlineStore } from '@/store/modules/online'
import { useRouter } from 'vue-router'

const router = useRouter()

const onlineStore = useOnlineStore()
onlineStore.getOnlineUser()
</script>
