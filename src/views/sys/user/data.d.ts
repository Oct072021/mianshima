import { UpdatePwd } from '@/store/modules/user/data.d'
export interface SearchDTO {
  userName: string
  deptGuid: string
}

export interface FormData {
  userGuid: string
  userCode: string
  userName: string
  jobNumber?: string
  password: string
  isDisabled: number
  deptGuid: string
  deptName: string
  buGuid: string
  buName: string
  email?: string
  mobile: string
  gender?: number
  station: StationVO | null
  roles: RoleVO[]
  isAdmin: number
}

export interface SubmitDTO extends Omit<FormData, 'station'> {
  defaultStationGuid: string
  defaultStationName: string
  roles: Pick<RoleVO, 'roleGuid' | 'roleName'>[]
}

export interface ListVO {
  deptName: string
  mobile: string
  userGuid: string
  userName: string
  userCode: string
  createTime: string
  isDisabled: number
  email: string
}

export interface StationVO {
  stationCode: string
  memo: string
  stationName: string
  createTime: string
  stationGuid: string
}
export interface RoleVO {
  roleName: string
  createTime: string
  roleGuid: string
  remarks: string
}

export interface SessionListVO {
  ticket: string
  userGuid: string
  ipAddr: string
  loginTime: number
  loginLocation: string
}

export interface Pwd extends Omit<UpdatePwd, 'oldPassword'> {
  confirmPassword: string
}
