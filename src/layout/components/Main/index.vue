<template>
  <el-scrollbar>
    <el-main class="layout-main">
      <el-scrollbar class="layout-scrollbar">
        <div class="layout-card" :style="layoutMainHeight">
          <template v-for="iframeView in iframeViews" :key="iframeView.name">
            <Iframe v-show="route.name === iframeView.name" />
          </template>

          <router-view v-slot="{ Component, route }">
            <keep-alive v-if="theme.isTabsCache" :include="[...tabsStore.cachedViews]">
              <component :is="!isIframe ? Component : null" :key="route.name" />
            </keep-alive>
            <component :is="!isIframe ? Component : null" v-else :key="route.name" />
          </router-view>
          <!-- <router-view v-slot="{ Component, route }">
            <keep-alive v-if="theme.isTabsCache" :include="[...tabsStore.cachedViews]">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
            <component :is="Component" v-else :key="route.name" />
          </router-view> -->
        </div>
      </el-scrollbar>
    </el-main>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

import { useAppStore } from '@/store/modules/app'
import { useTabsStore } from '@/store/modules/tabs'

import Iframe from '../Router/Iframe.vue'

const route = useRoute()

const appStore = useAppStore()
const tabsStore = useTabsStore()
const theme = computed(() => appStore.theme)
const layoutMainHeight = computed(() => {
  if (!theme.value.isTabsView) {
    return 'height: calc(100vh - (var(--theme-main-padding) * 2) - var(--theme-header-height)) !important'
  } else {
    return ''
  }
})

const iframeViews = computed(() => tabsStore.visitedViews.filter((item) => item.meta?.functiontype === 2))
const isIframe = computed(() => route.meta?.functiontype === 2)
</script>
