import { Http } from '@/network/request'
import { ListVO, SubmitDTO } from './data.d'
import { i18n } from '@/i18n'

const { t } = i18n.global

// 详情
export const info = (data: Pick<ListVO, 'pluginName'>) => {
  return Http.post<typeof data, ListVO>('/system-service/plugin/info', data)
}
// 新增
export const add = (data: Omit<SubmitDTO, 'pluginGuid'>) => {
  return Http.post<typeof data, null>('/system-service/plugin/save', data, { typeStr: t('add') + t('plugin.plugin') })
}
// 修改
export const update = (data: SubmitDTO) => {
  return Http.post<typeof data, null>('/system-service/plugin/update', data, { typeStr: t('edit') + t('plugin.plugin') })
}
