import { Http } from '@/network/request'
import { AdminListVO, ListVO, SubmitDTO, SubmitAdminDTO, RemoveAdminDTO } from './data.d'
import { i18n } from '@/i18n'

const { t } = i18n.global

// 详情
export const tenantInfo = (data: Pick<ListVO, 'tenementCode'>) => {
  return Http.post<typeof data, ListVO>('/system-service/tenant/info', data)
}
// 新增租户
export const tenantAdd = (data: Omit<SubmitDTO, 'tenementGuid'>) => {
  return Http.post<typeof data, null>('/system-service/tenant/save', data, { typeStr: t('add') + t('tenant.tenant') })
}
// 更新租户
export const tenantUpdate = (data: SubmitDTO) => {
  return Http.post<typeof data, null>('/system-service/tenant/update', data, {
    typeStr: t('edit') + t('tenant.tenant'),
  })
}

// 详情
export const adminInfo = (data: Pick<AdminListVO, 'tenementGuid' | 'userGuid'>) => {
  return Http.post<typeof data, ListVO>('/system-service/tenant/user/info', data)
}
// 新增租户管理员
export const adminAdd = (data: Omit<SubmitAdminDTO, 'userGuid'>) => {
  return Http.post<typeof data, null>('/system-service/tenant/user/save', data, {
    typeStr: t('add') + t('tenant.admin'),
  })
}
// 更新租户管理员
export const adminUpdate = (data: SubmitAdminDTO) => {
  return Http.post<typeof data, null>('/system-service/tenant/user/update', data, {
    typeStr: t('edit') + t('tenant.admin'),
  })
}
// 移除租户管理员
export const adminRemove = (data: RemoveAdminDTO) => {
  return Http.post<typeof data, null>('/system-service/tenant/user/delete', data, {
    typeStr: t('delete') + t('tenant.admin'),
  })
}
