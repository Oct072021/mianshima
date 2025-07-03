import { config } from './api'

// 获取系统默认设置
export const getConfig = async () => {
  const res = await config()
  return res.data
}
