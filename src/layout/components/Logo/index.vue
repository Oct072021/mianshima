<template>
  <div v-if="appStore.sidebarOpened" class="sidebar-logo">
    <el-avatar :src="info.logo"></el-avatar>
    <span class="logo-title"> {{ info.title }}</span>
  </div>
  <div v-else class="sidebar-logo sidebar-logo-expend">
    <span>{{ $t('app.miniLogoText') }}</span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import cache from '@/utils/cache'
const appStore = useAppStore()
const userStore = useUserStore()

let title = ''
if (userStore.user.superAdmin === -1) {
  title = cache.getConfigData()?.tenantManageTitle
} else if (userStore.user.superAdmin === 1) {
  title = cache.getConfigData()?.manageTitle
} else if (userStore.user.superAdmin === 0) {
  title = cache.getConfigData()?.systemTitle
}

const info = reactive({
  title: title,
  logo: cache.getConfigData() ? import.meta.env.VITE_APP_BASE + cache.getConfigData().loginLogo : '',
})
</script>

<style lang="scss" scoped>
.sidebar-logo {
  width: 230px !important;
  height: var(--theme-header-height);
  // line-height: var(--theme-header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: rgb(0 21 41 / 2%) 0 1px 4px;
  color: var(--theme-logo-text-color);
  font-size: 17px;
  padding: 10px 0;

  //overflow: hidden;
  // white-space: nowrap;
  text-overflow: ellipsis;

  .el-avatar {
    width: 25px;
    height: 25px;
  }
  .logo-title {
    margin-left: 10px;
    width: 150px;
  }
}
.sidebar-logo-expend {
  width: 100% !important;
}
</style>
