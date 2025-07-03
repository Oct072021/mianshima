import { add, info, update, userSave, userDelete, authList, authSave } from './api'

import { ListVO, SubmitDTO, UserListVO, AuthDTO } from './data.d'
import { Response } from '@/network/data.d'
import { App } from '@/store/modules/app/data.d'

import { useAppStore } from '@/store/modules/app'

// 获取信息
export const getInfo = async (stationCode: ListVO['stationCode']) => {
  const res = await info({ stationCode })
  return res.data
}
// 添加岗位
export const addStation = async (data: SubmitDTO) => {
  const { stationName, memo, buGuid, companyGuid } = data
  const res = await add({ stationName, memo, buGuid, companyGuid })
  return res.code === 200
}
// 更新岗位
export const updateStation = async (data: SubmitDTO) => {
  const res = await update(data)
  return res.code === 200
}

// 新增岗位成员
export const addMember = async (list: UserListVO[], stationGuid: string) => {
  const params = list.map((item) => ({ userGuid: item.userGuid, stationGuid }))
  const res = await userSave(params)
  return res.code === 200
}
// 删除岗位成员
export const removeMember = async (list: UserListVO[], stationGuid: string) => {
  const params = list.map((item) => ({ userGuid: item.userGuid, stationGuid }))

  const res = await userDelete(params)
  return res.code === 200
}
// 获取岗位权限列表
export const getAuthList = async (stationGuid: string) => {
  const res = await authList({ stationGuid })

  const arr: string[] = []
  res.data.forEach((item, i) => {
    const f = res.data.slice(i + 1).find((d) => d.objectType?.includes(item.objectType))
    if (!f)
      arr.push(
        item.buttonCode || item.objectType || useAppStore().appList.find(({ guid }) => guid === item.application)!.code
      )
  })
  return arr
}
// 保存岗位权限
export const saveAuth = async (list: App[], stationGuid: string) => {
  const appFilter = list.filter((item) => item.code.length === 4)
  const buttonFilter = list.filter((item) => item.functionGuid)

  const taskList = [] as Promise<Response<null>>[]
  useAppStore().appList.forEach(({ guid }) => {
    const i = appFilter.findIndex((item) => item.guid === guid)
    const params: AuthDTO = {
      stationGuid,
      applicationGuid: guid,
      rights: [
        {
          functionCode: null,
          buttons: null,
        },
      ],
    }

    if (i !== -1) {
      const funcFilter = list.filter((item) => guid === item.applicationGuid)
      if (funcFilter.length)
        params.rights = funcFilter.map((item) => {
          const temp = buttonFilter.filter((btn) => btn.functionGuid === item.guid)
          return { functionCode: item.code, buttons: temp.length ? temp.map((btn) => btn.guid) : null }
        })
    } else {
      params.rights = []
    }

    taskList.push(authSave(params))
  })

  const res = await Promise.all(taskList)
  return res
}
