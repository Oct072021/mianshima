export interface UserInfo {
  id: string | null
  username: string
  realName: string
  superAdmin: number // -1:租户  0:普通用户  1:后台管理员
  authoritySet: string[]
  roleSet: string[]
  stationSet: string[]
  dataScopeList: string[]
  buguid: string
  buName: string
}

export interface UserState {
  user: UserInfo
  ticket: string
  publicKey: string
  firstLogin: number
  updateFirstPwdKey: string
  pwdComplex: PwdComplex
  pwdTips: string
}
// 修改密码Form
export interface UpdatePwd {
  key: string
  captcha: string
  userName: string
  oldPassword: string
  newPassword: string
}
// 密码复杂度
export interface PwdComplex {
  characters: string
  lockTime: number
  specialCharacters: boolean
  digits: boolean
  maxRetryCount: number
  maxiNumLength: number
  miniNumLength: number
  mixedCase: boolean
}
export interface FirstLogin {
  isPwChgNeeded: boolean
  firstLogin: number // 0:正常  1:首次登录  2:超过180天
  updateFirstPwdKey: string
}
