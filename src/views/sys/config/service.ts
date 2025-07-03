import { add, update } from './api'
import { SubmitDTO } from './data.d'

// 添加系统配置
export const addConfig = async (data: SubmitDTO) => {
  const { value, valueNum, memo } = data

  const res = await add({ value, valueNum, memo })
  return res.code === 200
}
// 更新系统配置
export const updateConfig = async (data: SubmitDTO) => {
  const res = await update(data)
  return res.code === 200
}
