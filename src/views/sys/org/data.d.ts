export interface SearchDTO {
  buGuid: string
  stationName: string
}

export interface SearchUserDTO {
  userName: string
  deptGuid: string
  mobile?: string
  stationGuid: string
}

export interface SubmitDTO {
  stationGuid: string
  stationName: string
  memo: string
  buGuid: string
  companyGuid: string
}

export interface MemberDTO {
  userGuid: string
  stationGuid: string
}

export interface AuthDTO {
  stationGuid: string
  applicationGuid: string
  rights?: Right[]
}
export interface Right {
  functionCode: string | null
  buttons: string[] | null
}

export interface AuthDTO2 {
  actionCode?: string
  application: string
  objectType: string
  stationGuid: string
  buttonCode?: string
}

export interface ListVO {
  stationCode: string
  memo: string
  stationName: string
  createTime: string
  stationGuid: string
}

export interface UserListVO {
  deptGuid: string
  mobile: string
  userGuid: string
  userName: string
  userCode: string
  buGuid: string
  isLocked: number
  isDisabled: number
  email: string
  defaultStationGuid: string
}
