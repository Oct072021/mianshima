import { Http } from '@/network/request'
import { Info } from './data.d'

// 获取系统默认设置
export const config = () => {
  return Http.post<null, Info>('/system-service/auth/config', null, { encrypt: false })
}

