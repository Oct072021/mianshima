import { Http } from '@/network/request'
import { App, BtnDTO, FuncDTO, AppDTO } from './data.d'

// 应用(系统)列表
export const getAppList = () => {
  return Http.post<{}, AppDTO[]>('/system-service/application/list', {})
}

// 功能(页面)列表
export const getFuncList = (data: Pick<FuncDTO, 'applicationGuid'>) => {
  return Http.post<typeof data, FuncDTO[]>('/system-service/function/tree', data)
}

// button列表
export const getButtonList = () => {
  return Http.post<{}, BtnDTO[]>('/system-service/function/button/list', {})
}
