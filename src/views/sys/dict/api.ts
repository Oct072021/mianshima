import { Http } from '@/network/request'
import { ListVO, SubmitDTO, DictListVO, SubmitDictDTO } from './data.d'
import { i18n } from '@/i18n'

const { t } = i18n.global

// 数据字典详情
export const dictInfo = (data: Pick<SubmitDTO, 'tcmNum'>) => {
  return Http.post<typeof data, ListVO>('/system-service/tpConfigMain/info', data)
}
// 新增数据字典
export const dictAdd = (data: Omit<SubmitDTO, 'tcmId'>) => {
  return Http.post<typeof data, null>('/system-service/tpConfigMain/save', data, { typeStr: t('add') + t('dict.dict') })
}
// 修改数据字典
export const dictUpdate = (data: SubmitDTO) => {
  return Http.post<typeof data, null>('/system-service/tpConfigMain/update', data, {
    typeStr: t('edit') + t('dict.dict'),
  })
}

// 数据字典值详情
export const valueInfo = (data: Pick<SubmitDictDTO, 'tcmId' | 'tableName' | 'valueNum'>) => {
  return Http.post<typeof data, DictListVO>('/system-service/tpConfig/info', data)
}
// 新增数据字典值
export const valueAdd = (data: Omit<SubmitDictDTO, 'id'>) => {
  return Http.post<typeof data, null>('/system-service/tpConfig/save', data, { typeStr: t('add') + t('dict.setting') })
}
// 修改数据字典值
export const valueUpdate = (data: SubmitDictDTO) => {
  return Http.post<typeof data, null>('/system-service/tpConfig/update', data, {
    typeStr: t('edit') + t('dict.setting'),
  })
}
