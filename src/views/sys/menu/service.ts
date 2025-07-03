import { BtnDTO, FuncDTO, SubmitDTO } from './data.d'
import { addButton, addFunc, removeButton, removeFunc, updateButton, updateFunc, pluginList } from './api'

export const funcAdd = async (data: SubmitDTO) => {
  const { name, pid, comments, applicationGuid, url, pluginGuid, pluginName, icon, type } = data
  const params = {
    functionName: name,
    functionIcon: icon,
    functionUrl: url,
    functionType: type,
    pluginGuid: pluginGuid,
    pluginName: pluginName,
    comments: comments,
    applicationGuid: applicationGuid!,
    parentFunctionGuid: pid,
  }

  const res = await addFunc(params)
  return res.code === 200
}

export const funcUpdate = async (data: SubmitDTO) => {
  const { guid, name, pid, comments, applicationGuid, url, pluginGuid, pluginName, icon, type } = data
  const params = {
    functionGuid: guid,
    functionName: name,
    functionIcon: icon,
    functionUrl: url,
    functionType: type,
    pluginGuid: pluginGuid,
    pluginName: pluginName,
    comments: comments,
    applicationGuid: applicationGuid!,
    parentFunctionGuid: pid,
  }
  const res = await updateFunc(params)
  return res.code === 200
}

export const funcRemove = async (guid: FuncDTO['functionGuid']) => {
  const res = await removeFunc([guid])
  return res.code === 200
}

export const buttonAdd = async (data: SubmitDTO) => {
  const { name, pid, authority } = data
  const params = {
    functionGuid: pid!,
    buttonId: name,
    authority,
  }
  const res = await addButton(params)
  return res.code === 200
}

export const buttonUpdate = async (data: SubmitDTO) => {
  const { name, pid, authority, guid } = data
  const params = {
    functionButtonId: guid,
    functionGuid: pid!,
    buttonId: name,
    authority,
  }
  const res = await updateButton(params)
  return res.code === 200
}

export const buttonRemove = async (guid: BtnDTO['functionButtonId']) => {
  const res = await removeButton([guid])
  return res.code === 200
}

export const getPluginList = async () => {
  const res = await pluginList()
  return res.data
}
