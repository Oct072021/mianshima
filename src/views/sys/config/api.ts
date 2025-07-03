import { Http } from '@/network/request'
import { SubmitDTO } from './data.d'
import { i18n } from '@/i18n'

const { t } = i18n.global

// 新增
export const add = (data: Omit<SubmitDTO, 'id'>) => {
  return Http.post<typeof data, null>('/system-service/tenant/setting/save', data, {
    typeStr: t('add') + t('config.config'),
  })
}
// 修改
export const update = (data: SubmitDTO) => {
  return Http.post<typeof data, null>('/system-service/tenant/setting/update', data, {
    typeStr: t('edit') + t('config.config'),
  })
}
