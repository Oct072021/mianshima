import { AppDTO } from './data.d'
import { add, update, remove, info } from './api'

export const appInfo = async (applicationCode: AppDTO['applicationCode']) => {
  const res = await info({ applicationCode })
  return res.data
}

export const addApp = async (data: AppDTO) => {
  const { applicationName, applicationIcon, comments, applicationUrl, applicationFullName } = data
  const res = await add({ applicationName, applicationIcon, comments, applicationUrl, applicationFullName })
  return res.code === 200
}

export const updateApp = async (data: AppDTO) => {
  const res = await update(data)
  return res.code === 200
}

export const removeApp = async (guid: AppDTO['applicationGuid']) => {
  const res = await remove([guid])
  return res.code === 200
}
