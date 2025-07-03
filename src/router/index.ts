import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { useRouterStore } from '@/store/modules/router'
import { isExternalLink, pathToCamel } from '@/utils/tool'
import constant from '@/utils/constant'
import { i18n } from '@/i18n'
import cache from '@/utils/cache'
import { MyRoute } from '@/store/modules/router/data.d'

NProgress.configure({ showSpinner: false })

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: i18n.global.t('router.dashboard'), icon: 'icon-home', affix: true, breadcrumb: [] },
      },
    ],
  },
  {
    path: '/redirect',
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('../layout/components/Router/Redirect.vue'),
      },
    ],
  },
  {
    path: '/iframe/:query?',
    component: () => import('../layout/components/Router/Iframe.vue'),
  },
  {
    path: '/login',
    component: () => import('../views/login/index.vue'),
  },
  {
    path: '/404',
    component: () => import('../views/404.vue'),
  },
]

const asyncRoutes: RouteRecordRaw = {
  path: '/',
  component: () => import('../layout/index.vue'),
  redirect: '/dashboard/index',
  children: [
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/profile/index.vue'),
      meta: {
        title: i18n.global.t('router.profile'),
        cache: true,
        breadcrumb: [],
      },
    },
    {
      path: '/online',
      name: 'SysOnlineIndex',
      component: () => import('@/views/online/index.vue'),
      meta: {
        title: i18n.global.t('onlineUser'),
        cache: true,
        breadcrumb: [],
      },
    },
  ],
}

export const configRoutes: RouteRecordRaw = {
  path: '/',
  component: () => import('../layout/index.vue'),
  redirect: '/dashboard/index',
  children: [
    {
      path: '/sys/application/index',
      name: 'SysApplicationIndex',
      component: () => import('@/views/sys/application/index.vue'),
      children: [],
      meta: { title: '应用系统管理', openStyle: 0, icon: 'icon-appstore', functiontype: 1, breadcrumb: [] },
    },
    {
      path: '/sys/menu/index',
      name: 'SysMenuIndex',
      component: () => import('@/views/sys/menu/index.vue'),
      children: [],
      meta: { title: '功能菜单管理', openStyle: 0, icon: 'icon-appstore', functiontype: 1, breadcrumb: [] },
    },
    {
      path: '/sys/dict/index',
      name: 'SysDictIndex',
      component: () => import('@/views/sys/dict/index.vue'),
      children: [],
      meta: { title: '数据字典', openStyle: 0, icon: 'icon-appstore', functiontype: 1, breadcrumb: [] },
    },
    {
      path: '/sys/org/index',
      name: 'SysOrgIndex',
      component: () => import('@/views/sys/org/index.vue'),
      children: [],
      meta: { title: '组织机构', openStyle: 0, icon: 'icon-appstore', functiontype: 1, breadcrumb: [] },
    },
    {
      path: '/sys/role/index',
      name: 'SysRoleIndex',
      component: () => import('@/views/sys/role/index.vue'),
      children: [],
      meta: { title: '角色管理', openStyle: 0, icon: 'icon-appstore', functiontype: 1, breadcrumb: [] },
    },
    {
      path: '/sys/user/index',
      name: 'SysUserIndex',
      component: () => import('@/views/sys/user/index.vue'),
      children: [],
      meta: { title: '用户管理', openStyle: 0, icon: 'icon-appstore', functiontype: 1, breadcrumb: [] },
    },
    {
      path: '/sys/params/index',
      name: 'SysParamsIndex',
      component: () => import('@/views/sys/params/index.vue'),
      children: [],
      meta: { title: '参数管理', openStyle: 0, icon: 'icon-appstore', functiontype: 1, breadcrumb: [] },
    },
    {
      path: '/sys/config/index',
      name: 'SysConfigIndex',
      component: () => import('@/views/sys/config/index.vue'),
      children: [],
      meta: { title: '系统配置', openStyle: 0, icon: 'icon-appstore', functiontype: 1, breadcrumb: [] },
    },
    {
      path: '/sys/tenant/index',
      name: 'SysTenantIndex',
      component: () => import('@/views/sys/tenant/index.vue'),
      children: [],
      meta: { title: '租户管理', openStyle: 0, icon: 'icon-appstore', functiontype: 1, breadcrumb: [] },
    },
    {
      path: '/sys/log/login',
      name: 'SysLogLogin',
      component: () => import('@/views/sys/log/login.vue'),
      children: [],
      meta: { title: '登录日志', openStyle: 0, icon: 'icon-appstore', functiontype: 1, breadcrumb: [] },
    },
    {
      path: '/sys/log/operate',
      name: 'SysLogOperate',
      component: () => import('@/views/sys/log/operate.vue'),
      children: [],
      meta: { title: '操作日志', openStyle: 0, icon: 'icon-appstore', functiontype: 1, breadcrumb: [] },
    },
    {
      path: '/sys/plugin/index',
      name: 'SysPluginIndex',
      component: () => import('@/views/sys/plugin/index.vue'),
      children: [],
      meta: { title: '插件管理', openStyle: 0, icon: 'icon-appstore', functiontype: 1, breadcrumb: [] },
    },
  ],
}

export const errorRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)',
  redirect: '/404',
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE),
  routes: constantRoutes,
})

// 白名单列表
const whiteList = ['/login']

// 路由跳转前
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const appStore = useAppStore()
  const userStore = useUserStore()
  const routerStore = useRouterStore()
  // token存在的情况
  if (userStore.ticket) {
    if (to.path === '/login') {
      // next(constant.loginPage)
      next({ path: '/' })
      NProgress.done()
    } else {
      // 用户信息不存在，则重新拉取
      if (!userStore.user.id) {
        try {
          await userStore.getUserInfo()
          await userStore.getIsFirstLogin()
          await userStore.getComplexConfig()
          // await userStore.getAuthorityListAction()
          // await appStore.getDictListAction()
        } catch (error) {
          // 请求异常，则跳转到登录页
          cache.removeTicket()
          // next('/login')
          return Promise.reject(error)
        }

        if (userStore.user.superAdmin === 1) {
          appStore.getAppList()
          appStore.getBtnList()
          appStore.getFuncList()
          appStore.getAppListAction()
        }

        // 动态菜单+常量菜单
        const menuRoutes = await routerStore.getMenuRoutes()

        // 获取扁平化路由，将多级路由转换成一级路由
        const keepAliveRoutes = getKeepAliveRoutes(menuRoutes, [])
        console.log(keepAliveRoutes)

        // 添加菜单路由
        asyncRoutes.children?.push(...keepAliveRoutes)

        router.addRoute(asyncRoutes)

        // 错误路由
        router.addRoute(errorRoute)

        // 保存路由数据
        routerStore.setRoutes(constantRoutes.concat(asyncRoutes))

        // 搜索菜单需要使用
        routerStore.setSearchMenu(keepAliveRoutes)

        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    // 没有token的情况下，可以进入白名单
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      if (to.fullPath === '/') {
        next('/login')
      } else {
        next(`/login?redirect=dashboard`)
      }
    }
  }
})

// 路由加载后
router.afterEach(() => {
  NProgress.done()
})

// 获取扁平化路由，将多级路由转换成一级路由
export const getKeepAliveRoutes = (rs: RouteRecordRaw[], breadcrumb: string[]): RouteRecordRaw[] => {
  const routerList: RouteRecordRaw[] = []

  rs.forEach((item: any) => {
    if (item.meta.title) {
      breadcrumb.push(item.meta.title)
    }

    if (item.children && item.children.length > 0) {
      routerList.push(...getKeepAliveRoutes(item.children, breadcrumb))
    } else {
      item.meta.breadcrumb.push(...breadcrumb)
      routerList.push(item)
    }

    breadcrumb.pop()
  })
  return routerList
}

// 加载vue组件
export interface ModuleMap {
  [key: string]: any
}

export const layoutModules = () => {
  return import.meta.glob('/src/views/**/*.vue')
}

// 根据路径，动态获取vue组件
const getDynamicComponent = (path: string): any => {
  const modules: ModuleMap = layoutModules()
  return modules[`/src/views/${path}.vue`]
}

// 根据菜单列表，生成路由数据
// export const generateRoutes = (menuList: any): RouteRecordRaw[] => {
//   const routerList: RouteRecordRaw[] = []
//   menuList.forEach((menu: any) => {
//     let component
//     let path
//     if (menu.children && menu.children.length > 0) {
//       component = () => import('@/layout/index.vue')
//       path = '/p/' + menu.id
//     } else {
//       // 判断是否iframe
//       if (isIframeUrl(menu)) {
//         component = () => import('@/layout/components/Router/Iframe.vue')
//         path = '/iframe/' + menu.id
//       } else {
//         component = getDynamicComponent(menu.url)
//         path = '/' + menu.url
//       }
//     }
//     const route: RouteRecordRaw = {
//       path: path,
//       name: pathToCamel(path),
//       component: component,
//       children: [],
//       meta: {
//         title: menu.name,
//         icon: menu.icon,
//         id: '' + menu.id,
//         url: menu.url,
//         cache: true,
//         newOpen: menu.openStyle === 1,
//         affix: menu.affix,
//         breadcrumb: [],
//         functiontype: menu.functiontype,
//       },
//     }

//     // 有子菜单的情况
//     if (menu.children && menu.children.length > 0) {
//       route.children?.push(...generateRoutes(menu.children))
//     }

//     routerList.push(route)
//   })

//   return routerList
// }
// 根据菜单列表，生成路由数据
export const generateRoutes = (menuList: MyRoute[]): RouteRecordRaw[] => {
  const routerList: RouteRecordRaw[] = []
  menuList.forEach((menu) => {
    let component, path
    if (menu.SubNodes && menu.SubNodes.length > 0) {
      component = () => import('@/layout/index.vue')
      if (menu.RunUrl?.length) {
        path = '/iframe/' + menu.Code
        asyncRoutes.children.push({
          path: path,
          name: pathToCamel('/iframe/' + menu.Code),
          component: () => import('@/layout/components/Router/Iframe.vue'),
          children: [],
          meta: {
            title: menu.Caption,
            icon: menu.Icon,
            desc: menu.Description,
            id: '' + menu.Code,
            url: menu.RunUrl,
            cache: true,
            affix: menu.affix,
            breadcrumb: [],
            functiontype: 2,
          },
        })
      }else{
        path = '/p/' + menu.Code
      }
    } else {
      // 判断是否iframe
      if (menu.FunctionType === 2) {
        component = () => import('@/layout/components/Router/Iframe.vue')
        path = '/iframe/' + menu.Code
      } else {
        const target = configRoutes.children.find((route) => route.meta?.title === menu.RunClassName)
        // if (!target) return
        component = target?.component
        path = target?.path || '/'
      }
    }

    const route: RouteRecordRaw = {
      path: path,
      name: pathToCamel(path),
      component: component,
      children: [],
      meta: {
        title: menu.Caption,
        icon: menu.Icon,
        desc: menu.Description,
        id: '' + menu.Code,
        url: menu.RunUrl,
        cache: true,
        affix: menu.affix,
        breadcrumb: [],
        functiontype: menu.FunctionType,
      },
    }

    // 有子菜单的情况
    if (menu.SubNodes && menu.SubNodes.length > 0) {
      route.children?.push(...generateRoutes(menu.SubNodes))
    }

    routerList.push(route)
  })

  return routerList
}

// 判断是否iframe
const isIframeUrl = (menu: any): boolean => {
  // 如果是新页面打开，则不用iframe
  if (menu.openStyle === 1) {
    return false
  }
  // 是否外部链接
  return isExternalLink(menu.url)
}
