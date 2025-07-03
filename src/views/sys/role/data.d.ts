export interface SearchDTO {
  roleName: string
}

export interface SearchUserDTO {
  userName: string
  mobile: string
  deptGuid: string
  roleGuid: string
}

export interface SubmitDTO {
  roleName: string
  roleGuid: string
  remarks: string
}

export interface MemberDTO {
  userGuid: string
  roleGuid: string
}

export interface AuthDTO {
  roleGuid: string
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
  roleGuid: string
  buttonCode?: string
}

export interface ListVO {
  roleName: string
  createTime: string
  roleGuid: string
  remarks: string
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
}
