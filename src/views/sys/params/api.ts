import { Http } from '@/network/request'
import { ListVO, SubmitDTO } from './data.d'
import { i18n } from '@/i18n'

const { t } = i18n.global

// 详情
export const info = (data: Pick<ListVO, 'paramKey'>) => {
  return Http.post<typeof data, ListVO>('/system-service/params/info', data)
}
// 新增
export const add = (data: Omit<SubmitDTO, 'id'>) => {
  return Http.post<typeof data, null>('/system-service/params/save', data, { typeStr: t('add') + t('param.param') })
}
// 修改
export const update = (data: SubmitDTO) => {
  return Http.post<typeof data, null>('/system-service/params/update', data, { typeStr: t('edit') + t('param.param') })
}
