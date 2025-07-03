import { add, info, update } from './api'
import { ListVO, SubmitDTO } from './data.d'

// 获取参数信息
export const getInfo = async (paramKey: ListVO['paramKey']) => {
  const res = await info({ paramKey })
  return res.data
}
// 添加参数
export const addParam = async (data: SubmitDTO) => {
  const { paramName, paramType, paramKey, paramValue, remark } = data

  const res = await add({ paramName, paramType, paramKey, paramValue, remark })
  return res.code === 200
}
// 更新参数
export const updateParam = async (data: SubmitDTO) => {
  const res = await update(data)
  return res.code === 200
}
