<template>
  <el-card v-loading="loading">
    <iframe :src="url" class="iframe-body" :style="layoutMainHeight" @load="load"></iframe>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { replaceLinkParam } from '@/utils/tool'
import { useAppStore } from '@/store/modules/app'

const route = useRoute()
const url = ref('')
const loading = ref(false)
const appStore = useAppStore()
const theme = computed(() => appStore.theme)

watch(
  () => route,
  (value) => {
    if (value.path === '/iframe') {
      initUrl(value)
    }
  },
  { deep: true }
)

onMounted(() => {
  initUrl(route)
})
const initUrl = (route: RouteLocationNormalizedLoaded): void => {
  loading.value = true

  const { meta, query } = route
  if (query.url) {
    url.value = query.url as string
  } else {
    url.value = replaceLinkParam(meta.url as string)
  }
}
const load = () => {
  loading.value = false
}

const layoutMainHeight = computed(() => {
  if (!theme.value.isTabsView) {
    return 'height: calc(100vh - (var(--theme-main-padding) * 2) - var(--theme-header-height) - 2px) !important'
  } else {
    return ''
  }
})
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
  padding: 0;
}
.iframe-body {
  min-height: calc(100vh - (var(--theme-main-padding) * 2) - var(--theme-tabs-height) - var(--theme-header-height) - 2px);
  width: 100%;
  border: 0;
}
</style>
