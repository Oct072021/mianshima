import { add, info, update } from './api'
import { ListVO, SubmitDTO } from './data.d'

// 获取插件信息
export const getInfo = async (pluginName: ListVO['pluginName']) => {
  const res = await info({ pluginName })
  return res.data
}
// 添加插件
export const addPlugin = async (data: SubmitDTO) => {
  const { pluginName, pluginUrl, comments } = data
  data.pluginClassName = pluginName
  const res = await add({ pluginName, pluginUrl, comments, pluginClassName: data.pluginClassName })
  return res.code === 200
}
// 更新插件
export const updatePlugin = async (data: SubmitDTO) => {
  const res = await update(data)
  return res.code === 200
}
