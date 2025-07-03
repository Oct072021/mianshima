import { defineStore } from 'pinia'

import { menuRoutes } from './api'

import { generateRoutes, configRoutes } from '@/router'

import { RouterState } from './data.d'
import type { RouteRecordRaw } from 'vue-router'

export const useRouterStore = defineStore('routerStore', {
  state: (): RouterState => ({
    originalRoutes: [],
    menuRoutes: [],
    searchMenu: [],
    routes: [],
  }),
  actions: {
    async getMenuRoutes() {
      const { data } = await menuRoutes()
      console.log(data)

      const routes = generateRoutes(data.nav.SubNodes)

      if (routes.length > 0) {
        // 后端菜单
        this.menuRoutes.push(...routes[0].children!)
        this.originalRoutes.push(...routes)
      }

      // this.menuRoutes.push(...configRoutes.children!)
      // this.originalRoutes.push(...configRoutes.children!)
      // console.log(this.menuRoutes)

      return this.originalRoutes as RouteRecordRaw[]
    },
    setSearchMenu(routers: RouteRecordRaw[]) {
      this.searchMenu = routers
    },
    setRoutes(routers: RouteRecordRaw[]) {
      this.routes = routers
    },
    setMenuRoute(route: RouteRecordRaw) {
      this.menuRoutes = route.children!
    },
  },
})
