import { Http } from '@/network/request'
import { RouteVO } from './data.d'

// menuRoutes
export const menuRoutes = () => {
  return Http.post<null, RouteVO>('/system-service/auth/getSysFunctionConfig')
}
