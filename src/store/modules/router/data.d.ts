export interface RouteVO {
  nav: MyRoute
}

export interface MyRoute {
  Code: string
  Caption: string // 名称
  RunClassName: string // 原始名称
  Icon: string
  RunUrl: string
  affix: string
  FunctionType: number
  Description: string
  SubNodes: MyRoute[]
}

export interface RouterState {
  originalRoutes: RouteRecordRaw[]
  menuRoutes: RouteRecordRaw[]
  searchMenu: RouteRecordRaw[]
  routes: RouteRecordRaw[]
}
