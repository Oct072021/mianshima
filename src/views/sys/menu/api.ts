import { Http } from '@/network/request'
import { FuncDTO, BtnDTO, PluginDTO } from './data.d'
import { i18n } from '@/i18n'

const { t } = i18n.global

// 添加 功能(页面)
export const addFunc = (data: Omit<FuncDTO, 'functionGuid' | 'functionCode'>) => {
  return Http.post<typeof data, null>('/system-service/function/save', data, { typeStr: t('add') + t('menu.menu') })
}
// 更新 功能(页面)
export const updateFunc = (data: Omit<FuncDTO, 'functionCode'>) => {
  return Http.post<typeof data, null>('/system-service/function/update', data, { typeStr: t('edit') + t('menu.menu') })
}
// 删除 功能(页面)
export const removeFunc = (data: FuncDTO['functionGuid'][]) => {
  return Http.post<typeof data, null>('/system-service/function/delete', data, {
    typeStr: t('delete') + t('menu.menu'),
  })
}

// 添加button
export const addButton = (data: Omit<BtnDTO, 'functionButtonId'>) => {
  return Http.post<typeof data, null>('/system-service/function/button/save', data, {
    typeStr: t('add') + t('menu.btn'),
  })
}
// 更新button
export const updateButton = (data: BtnDTO) => {
  return Http.post<typeof data, null>('/system-service/function/button/update', data, {
    typeStr: t('edit') + t('menu.btn'),
  })
}
// 删除button
export const removeButton = (data: BtnDTO['functionButtonId'][]) => {
  return Http.post<typeof data, null>('/system-service/function/button/delete', data, {
    typeStr: t('delete') + t('menu.btn'),
  })
}

// 插件列表
export const pluginList = () => {
  return Http.post<{}, PluginDTO[]>('/system-service/plugin/list', {})
}
