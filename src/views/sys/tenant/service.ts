import { tenantAdd, tenantInfo, tenantUpdate, adminAdd, adminInfo, adminUpdate, adminRemove } from './api'

import { FormData, SubmitDTO, AdminListVO } from './data.d'

// 获取租户信息
export const getTenementInfo = async (tenementCode: string) => {
  const res = await tenantInfo({ tenementCode })
  return res.data
}
// 提交租户表单
export const submit = async (params: SubmitDTO) => {
  const { tenementGuid, tenementName, tenementFullName, comments } = params
  const res = !tenementGuid.length
    ? await tenantAdd({ tenementName, tenementFullName, comments })
    : await tenantUpdate(params)
  return res.code === 200
}

// 获取租户管理员信息
export const getAdminInfo = async ({ tenementGuid, userGuid }: AdminListVO) => {
  const res = await adminInfo({ tenementGuid, userGuid })
  return res.data
}
// 提交租户管理员表单
export const submitAdmin = async (params: FormData, tenementGuid: string) => {
  const { userGuid, userCode, userName, jobNumber, password } = params
  const res = !userGuid.length
    ? await adminAdd({ tenementGuid, userCode, userName, jobNumber, password })
    : await adminUpdate({ ...params, tenementGuid })
  return res.code === 200
}
// 移除租户管理员
export const removeAdmin = async (tenementGuid: string, idList: string[]) => {
  const res = await adminRemove({ tenementGuid, idList })
  return res.code === 200
}
