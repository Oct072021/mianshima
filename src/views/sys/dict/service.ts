import { dictAdd, dictInfo, dictUpdate, valueInfo, valueAdd, valueUpdate } from './api'

import { SubmitDTO, SubmitDictDTO } from './data.d'

// 获取数据字典信息
export const getDictInfo = async (tcmNum: SubmitDTO['tcmNum']) => {
  const res = await dictInfo({ tcmNum })
  return res.data
}
// 添加数据字典
export const addDict = async (data: SubmitDTO) => {
  const { tcmNum, tcmName, isSys, remark } = data
  const res = await dictAdd({ tcmNum, tcmName, isSys, remark })
  return res.code === 200
}
// 更新数据字典
export const updateDict = async (data: SubmitDTO) => {
  const res = await dictUpdate(data)
  return res.code === 200
}

// 获取数据字典值
export const getValueInfo = async (data: Pick<SubmitDictDTO, 'tcmId' | 'tableName' | 'valueNum'>) => {
  const res = await valueInfo(data)
  return res.data
}
// 添加数据字典值
export const addValue = async (data: SubmitDictDTO) => {
  data.valueNum = data.value
  const { tcmId, name, valueNum, value, isDef, memo, inure, isSys, frontName, frontOption, tableName } = data
  const res = await valueAdd({
    tcmId,
    name,
    valueNum,
    value,
    isDef,
    memo,
    inure,
    isSys,
    frontName,
    frontOption,
    tableName,
  })
  return res.code === 200
}
// 更新数据字典值
export const updateValue = async (data: SubmitDictDTO) => {
  const res = await valueUpdate(data)
  return res.code === 200
}
