import { Http } from '@/network/request'
import { UpdatePwd, PwdComplex, UserInfo, FirstLogin } from './data.d'
import { i18n } from '@/i18n'

const { t } = i18n.global

// 登录
export const login = (xSecCode: string, xSecVector: string, data?: string) => {
  return Http.post<string, string>('/system-service/auth/login', data, {
    typeStr: '登录',
    encrypt: false,
    headers: {
      'X-Sec-Code': xSecCode,
      'X-Sec-Vector': xSecVector,
      'X-Sec-Request': 'script',
    },
  })
}
// 用户信息
export const userInfo = () => {
  return Http.post<null, UserInfo>('/system-service/auth/loginUserInfo')
}
// 退出登录
export const logout = () => {
  return Http.post('/system-service/auth/logout')
}
// 是否首次登录
export const isFirstLogin = () => {
  return Http.post<null, FirstLogin>('/system-service/auth/reqPswdChg')
}
// 首次登录修改密码
export const firstLoginUpdatePwd = (data: Omit<UpdatePwd, 'captcha' | 'oldPassword'>) => {
  return Http.post<typeof data, null>('/system-service/auth/firstLoginUpdatePwd', data, {
    typeStr: t('user.changePwd') + ',' + t('tip.relogin'),
  })
}
// 密码复杂度配置
export const pwdComplexityValidConfig = () => {
  return Http.post<null, PwdComplex>('/system-service/auth/pwdComplexityValidConfig')
}
// 修改密码
export const loginUserUpdatePwd = (data: UpdatePwd) => {
  return Http.post<typeof data, null>('/system-service/auth/loginUserUpdatePwd', data, {
    typeStr: t('user.changePwd') + ',' + t('tip.relogin'),
  })
}
