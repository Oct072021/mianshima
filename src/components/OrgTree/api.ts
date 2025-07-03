import { Http } from '@/network/request'
import { TreeVO, OrgDTO } from './data.d'
import { i18n } from '@/i18n'

const { t } = i18n.global

// 组织数据--tree
export const tree = () => {
  return Http.post<{}, TreeVO[]>('/system-service/businessUnit/tree', {})
}
// 组织信息
export const info = (data: Pick<TreeVO, 'buCode'>) => {
  return Http.post<typeof data, TreeVO>('/system-service/businessUnit/info', data)
}
// 添加组织
export const add = (data: Omit<OrgDTO, 'buGuid'>) => {
  return Http.post<typeof data, null>('/system-service/businessUnit/save', data, { typeStr: t('add') + t('org.org') })
}
// 更新组织
export const update = (data: OrgDTO) => {
  return Http.post<typeof data, null>('/system-service/businessUnit/update', data, {
    typeStr: t('edit') + t('org.org'),
  })
}
// 删除组织
export const remove = (data: OrgDTO['buGuid'][]) => {
  return Http.post<typeof data, null>('/system-service/businessUnit/delete', data, {
    typeStr: t('delete') + t('org.org'),
  })
}
