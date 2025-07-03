import { Http } from '@/network/request'
import { ListVO } from './data.d'

// 在线用户
export const online = () => {
  return Http.post<{}, ListVO[]>('/system-service/auth/online', {})
}
