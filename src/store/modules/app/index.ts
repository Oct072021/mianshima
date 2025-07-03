import { defineStore } from 'pinia'
import cache from '@/utils/cache'

import { AppState, ITheme, App, FuncDTO, BtnDTO } from './data.d'
import { Response } from '@/network/data.d'

import { getAppList, getButtonList, getFuncList } from './api'

const recurse = (data: FuncDTO[], applicationGuid: string, pid: string, buttons: BtnDTO[]) => {
  const res: App[] = []
  data?.forEach((d) => {
    const temp2: App = {
      guid: d.functionGuid,
      code: d.functionCode,
      name: d.functionName,
      type: d.functionType,
      icon: d.functionIcon,
      pluginGuid: d.pluginGuid,
      pluginName: d.pluginName,
      url: d.functionUrl,
      comments: d.comments,
      applicationGuid,
      pid,
      subFunctionList: [],
    }
    if (d.subFunctionList?.length) {
      temp2.subFunctionList = recurse(d.subFunctionList, applicationGuid, d.functionGuid, buttons)
    } else {
      temp2.subFunctionList = buttons
        .filter((r) => r.functionGuid === d.functionGuid)
        .map((r) => ({
          name: r.buttonId,
          guid: r.functionButtonId,
          code: r.functionButtonId,
          functionGuid: r.functionGuid,
          authority: r.authority,
          applicationGuid,
          pid: d.functionGuid,
          type: '3',
        }))
    }
    res.push(temp2)
  })
  return res
}

export const useAppStore = defineStore('appStore', {
  state: (): AppState => ({
    // sidebar 是否展开
    sidebarOpened: cache.getSidebarOpened(),
    // 国际化
    language: cache.getLanguage(),
    // 组件大小
    componentSize: cache.getComponentSize(),
    // 字典列表
    dictList: [],
    // 应用(系统)列表
    appList: [],
    // 主题
    theme: cache.getTheme(),
    temp: {
      appList: null,
      funcList: null,
      buttonList: null,
    },
  }),
  actions: {
    setSidebarOpened() {
      this.sidebarOpened = !this.sidebarOpened
      cache.setSidebarOpened(this.sidebarOpened)
    },
    setSidebarStatus(status: boolean) {
      this.sidebarOpened = status
      cache.setSidebarOpened(this.sidebarOpened)
    },
    setLanguage(locale: string) {
      this.language = locale
      cache.setLanguage(locale)
    },
    setComponentSize(size: string) {
      this.componentSize = size
      cache.setComponentSize(size)
    },
    // async getDictListAction() {
    //   const { data } = await useDictTypeAllApi()
    //   this.dictList = data || []
    // },
    setTheme(theme: ITheme) {
      this.theme = theme
      cache.setTheme(theme)
    },
    async getAppList() {
      const res = await getAppList()
      this.temp.appList = res.data
    },
    async getBtnList() {
      const res = await getButtonList()
      this.temp.buttonList = res.data
    },
    async getFuncList() {
      if (!this.temp.appList) {
        setTimeout(() => {
          this.getFuncList()
        }, 100)

        return
      }
      const taskList = [] as Promise<Response<FuncDTO[]>>[]
      this.temp.appList.forEach(({ applicationGuid }) => {
        taskList.push(getFuncList({ applicationGuid }))
      })
      const res = (await Promise.all(taskList)).map(({ data }) => data)
      this.temp.funcList = res
    },
    getAppListAction() {
      if (!this.temp.appList || !this.temp.funcList || !this.temp.buttonList) {
        setTimeout(() => {
          this.getAppListAction()
        }, 100)
        return
      }
      this.appList = []

      this.temp.appList.forEach((item, i) => {
        const temp: App = {
          guid: item.applicationGuid,
          code: item.applicationCode,
          name: item.applicationName,
          type: '99',
          icon: item.applicationIcon,
          url: item.applicationUrl,
          comments: item.comments,
          pid: null,
          subFunctionList: [],
        }

        temp.subFunctionList = recurse(this.temp.funcList![i], item.applicationGuid, '', this.temp.buttonList!)

        this.appList.push(temp)
      })
    },
  },
})
