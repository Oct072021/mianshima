<template>
  <div class="navbar-right">
    <Online v-if="userStore.user.superAdmin !== 0" />
    <Lang />
    <!-- <ComponentSize /> -->
    <Search />
    <Fullscreen />
    <User />
    <ThemeSettings />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'

import Online from './components/Online.vue'
import Lang from './components/Lang.vue'
import Search from './components/Search.vue'
import ComponentSize from './components/ComponentSize.vue'
import Fullscreen from './components/Fullscreen.vue'
import User from './components/User.vue'
import ThemeSettings from './components/ThemeSettings.vue'

const userStore = useUserStore()
</script>

<style lang="scss" scoped>
.navbar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &-link {
    height: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;
    &-photo {
      width: 25px;
      height: 25px;
      border-radius: 100%;
    }
  }
}
</style>
