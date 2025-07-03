import { add, info, remove, tree, update } from './api'
import { OrgDTO, TreeVO } from './data.d'

// 获取组织数据-tree
export const getTree = async () => {
  const res = await tree()
  return res.data
}
// 组织详情
export const getInfo = async (buCode: OrgDTO['buCode']) => {
  const res = await info({ buCode })
  return res.data
}
// 新增组织
export const addOrg = async (data: OrgDTO) => {
  const { buCode, buName, parentGuid, companyAddr, buType, comments, companyGuid } = data
  const res = await add({ buCode, buName, parentGuid, companyAddr, buType, comments, companyGuid })
  return res.code === 200
}
// 更新组织
export const updateOrg = async (data: OrgDTO) => {
  const { buGuid, buCode, buName, parentGuid, companyAddr, buType, comments,companyGuid } = data
  const res = await update({ buGuid, buCode, buName, parentGuid, companyAddr, buType, comments, companyGuid })
  return res.code === 200
}
// 删除组织
export const removeOrg = async (buGuid: OrgDTO['buGuid']) => {
  const res = await remove([buGuid])
  return res.code === 200
}
