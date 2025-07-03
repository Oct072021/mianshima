<template>
  <el-sub-menu v-if="menu.children.length > 0" :index="menu.path">
    <template #title>
      <ma-icon v-if="showIcon" :icon="menu.meta.icon" />
      <span>{{ menu.meta.title }}</span>
    </template>
    <MenuItem v-for="sub in menu.children" :key="sub.path" :menu="sub" />
  </el-sub-menu>
  <el-menu-item v-else :index="menu.path" @click="handleClickMenu(menu)">
    <ma-icon v-if="showIcon" :icon="menu.meta.icon" />
    <template #title>
      {{ menu.meta.title }}
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { RouteRecordRaw, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'

import { isExternalLink, replaceLinkParam } from '@/utils/tool'

const appStore = useAppStore()

// 显示icon图标
const showIcon = computed(() => {
  return appStore.theme.layout !== 'columns'
})

defineProps({
  menu: {
    type: Object as PropType<any>,
    required: true,
  },
})

const router = useRouter()

// 菜单点击事件
const handleClickMenu = (menu: RouteRecordRaw) => {
  // 不是新开页面，则直接切换路由
  if (!menu.meta?.newOpen) {
    router.push(menu.path)
    return
  }

  // 新开页面逻辑
  if (isExternalLink(menu.meta?.url as string)) {
    // 外链
    window.open(replaceLinkParam(menu.meta?.url as string), '_blank')
  } else {
    // 内部组件
    window.open('#' + menu.meta.url, '_blank')
  }
}
</script>
