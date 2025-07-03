import { Http } from '@/network/request'
import { AppDTO } from './data.d'
import { i18n } from '@/i18n'

const { t } = i18n.global

// 查询 应用(系统) 详情
export const info = (data: Pick<AppDTO, 'applicationCode'>) => {
  return Http.post<typeof data, AppDTO>('/system-service/application/info', data)
}
// 添加 应用(系统)
export const add = (data: Omit<AppDTO, 'applicationCode' | 'applicationGuid'>) => {
  return Http.post<typeof data, null>('/system-service/application/save', data, {
    typeStr: t('add') + t('application.application'),
  })
}
// 更新 应用(系统)
export const update = (data: Omit<AppDTO, 'applicationCode'>) => {
  return Http.post<typeof data, null>('/system-service/application/update', data, {
    typeStr: t('edit') + t('application.application'),
  })
}
// 删除 应用(系统)
export const remove = (data: AppDTO['applicationGuid'][]) => {
  return Http.post<typeof data, null>('/system-service/application/delete', data, {
    typeStr: t('delete') + t('application.application'),
  })
}
