import { Http } from '@/network/request'
import { SearchDTO, ListVO, SubmitDTO, MemberDTO, AuthDTO, AuthDTO2 } from './data.d'
import { i18n } from '@/i18n'

const { t } = i18n.global

// 详情
export const info = (data: SearchDTO) => {
  return Http.post<typeof data, ListVO>('/system-service/role/info', data)
}
// 新增
export const add = (data: Omit<SubmitDTO, 'roleGuid'>) => {
  return Http.post<typeof data, null>('/system-service/role/save', data, { typeStr: t('add') + t('role.role') })
}
// 修改
export const update = (data: SubmitDTO) => {
  return Http.post<typeof data, null>('/system-service/role/update', data, { typeStr: t('edit') + t('role.role') })
}

// 新增角色成员
export const userSave = (data: MemberDTO[]) => {
  return Http.post<typeof data, null>('/system-service/role/user/save', data, { typeStr: t('add') + t('role.member') })
}
// 删除角色成员
export const userDelete = (data: MemberDTO[]) => {
  return Http.post<typeof data, null>('/system-service/role/user/delete', data, {
    typeStr: t('edit') + t('role.member'),
  })
}

// 获取角色权限列表
export const authList = (data: Pick<AuthDTO, 'roleGuid'>) => {
  return Http.post<typeof data, AuthDTO2[]>('/system-service/role/rights/list', data)
}
// 保存角色权限
export const authSave = (data: AuthDTO) => {
  return Http.post<typeof data, null>('/system-service/role/rights/save', data)
}
