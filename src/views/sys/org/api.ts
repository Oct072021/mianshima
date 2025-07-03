import { Http } from '@/network/request'
import { ListVO, SubmitDTO, MemberDTO, AuthDTO, AuthDTO2 } from './data.d'
import { i18n } from '@/i18n'

const { t } = i18n.global

// 详情
export const info = (data: Pick<ListVO, 'stationCode'>) => {
  return Http.post<typeof data, ListVO>('/system-service/station/info', data)
}
// 新增
export const add = (data: Omit<SubmitDTO, 'stationGuid'>) => {
  return Http.post<typeof data, null>('/system-service/station/save', data, {
    typeStr: t('add') + t('station.station'),
  })
}
// 修改
export const update = (data: SubmitDTO) => {
  return Http.post<typeof data, null>('/system-service/station/update', data, {
    typeStr: t('edit') + t('station.station'),
  })
}

// 新增岗位成员
export const userSave = (data: MemberDTO[]) => {
  return Http.post<typeof data, null>('/system-service/station/user/save', data, {
    typeStr: t('add') + t('station.member'),
  })
}
// 删除岗位成员
export const userDelete = (data: MemberDTO[]) => {
  return Http.post<typeof data, null>('/system-service/station/user/delete', data, {
    typeStr: t('edit') + t('station.member'),
  })
}

// 获取岗位权限列表
export const authList = (data: Pick<AuthDTO, 'stationGuid'>) => {
  return Http.post<typeof data, AuthDTO2[]>('/system-service/station/rights/list', data)
}
// 保存岗位权限
export const authSave = (data: AuthDTO) => {
  return Http.post<typeof data, null>('/system-service/station/rights/save', data)
}
