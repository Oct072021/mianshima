export interface ITheme {
  // 侧栏风格 [light、dark]
  sidebarStyle: string
  // 顶栏风格 [light、theme]
  headerStyle: string
  // 主题颜色
  primaryColor: string
  // 布局风格 [vertical、columns、transverse]
  layout: string
  // 侧栏排他展开(只保持一个子菜单展开)
  uniqueOpened: boolean
  // 开启LOGO
  isLogo: boolean
  // 开启面包屑
  isBreadcrumb: boolean
  // 开启标签页
  isTabsView: boolean
  // 开启标签页缓存
  isTabsCache: boolean
  // 标签页风格 [style-1、style-2]
  tabsStyle: string
}

export interface App {
  guid: string
  code: string
  name: string
  type: string //-1应用系统 0菜单 1组件 2功能 3按钮
  icon?: string
  pluginGuid?: string
  pluginName?: string
  url?: string
  comments?: string
  applicationGuid?: string
  functionGuid?: string
  authority?: string
  pid: string | null
  subFunctionList?: App[]
}

export interface AppState {
  sidebarOpened: boolean
  language: string
  componentSize: string
  dictList: any[]
  appList: App[]
  theme: ITheme
  temp: {
    appList: AppDTO[] | null
    funcList: FuncDTO[][] | null
    buttonList: BtnDTO[] | null
  }
}

export interface AppDTO {
  applicationGuid: string
  applicationCode: string
  applicationName: string
  applicationFullName: string
  applicationIcon?: string
  comments?: string
  applicationUrl?: string
}
export interface FuncDTO {
  functionCode: string
  functionGuid: string
  functionName: string
  functionIcon?: string
  functionType: string // 0菜单 1组件 2功能 3按钮
  functionUrl?: string
  pluginGuid?: string
  pluginName?: string
  comments?: string
  applicationGuid: string
  parentFunctionGuid: string | null
  subFunctionList?: FuncDTO[]
}

export interface BtnDTO {
  functionButtonId: string
  functionGuid: string
  buttonId: string
  authority?: string
}
