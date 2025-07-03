import { Http } from '@/network/request'
import { Captcha } from './data.d'

// 获取验证码
export const captcha = () => {
  return Http.post<null, Captcha>('/system-service/auth/captcha', null, { encrypt: false })
}
