import { Http } from '@/network/request'
import { ListVO, SubmitDTO, StationVO, RoleVO, SessionListVO, Pwd } from './data.d'
import { i18n } from '@/i18n'

const { t } = i18n.global

// 详情
export const info = (data: Pick<ListVO, 'userCode'>) => {
  return Http.post<typeof data, SubmitDTO>('/system-service/user/info', data)
}
// 新增
export const add = (data: Omit<SubmitDTO, 'userGuid'>) => {
  return Http.post<typeof data, null>('/system-service/user/save', data, { typeStr: t('add') + t('userManage.user') })
}
// 修改
export const update = (data: SubmitDTO) => {
  return Http.post<typeof data, null>('/system-service/user/update', data, {
    typeStr: t('edit') + t('userManage.user'),
  })
}

// 岗位
export const station = (data: { buGuid: string }) => {
  return Http.post<typeof data, StationVO[]>('/system-service/station/list', data)
}
// 角色
export const role = () => {
  return Http.post<{}, RoleVO[]>('/system-service/role/list', {})
}

// 下线
export const kickout = (data: { accessToken: string }) => {
  return Http.post<typeof data, null>('/system-service/auth/kickout/token', data, { typeStr: t('userManage.kick') })
}
// 下线
export const kickoutAll = (data: Pick<SessionListVO, 'userGuid'>) => {
  return Http.post<typeof data, null>('/system-service/auth/kickout', data, { typeStr: t('userManage.kick') })
}

// 修改密码
export const userUpdatePwd = (data: Pwd) => {
  return Http.post<typeof data, null>('/system-service/user/userUpdatePwd', data, { typeStr: t('user.changePwd') })
}
