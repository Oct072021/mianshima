import { Response } from '@/network/data.d'

import { add, info, update, userSave, userDelete, authList, authSave } from './api'

import { AuthDTO, SubmitDTO, UserListVO } from './data.d'
import { App } from '@/store/modules/app/data.d'

import { useAppStore } from '@/store/modules/app'

// 获取信息
export const getInfo = async (roleName: string) => {
  const res = await info({ roleName })
  return res.data
}
export const submit = async (params: SubmitDTO) => {
  const { roleName, remarks, roleGuid } = params
  const res = !roleGuid ? await add({ roleName, remarks }) : await update(params)
  return res.data
}

// 新增角色成员
export const addMember = async (list: UserListVO[], roleGuid: string) => {
  const params = list.map((item) => ({ userGuid: item.userGuid, roleGuid }))
  const res = await userSave(params)
  return res.code === 200
}
// 删除角色成员
export const removeMember = async (list: UserListVO[], roleGuid: string) => {
  const params = list.map((item) => ({ userGuid: item.userGuid, roleGuid }))
  const res = await userDelete(params)
  return res.code === 200
}

// 获取角色权限列表
export const getAuthList = async (roleGuid: string) => {
  const res = await authList({ roleGuid })

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
// 保存角色权限
export const saveAuth = async (list: App[], roleGuid: string) => {
  const appFilter = list.filter((item) => item.code.length === 4)
  const buttonFilter = list.filter((item) => item.functionGuid)

  const taskList = [] as Promise<Response<null>>[]
  useAppStore().appList.forEach(({ guid }) => {
    const i = appFilter.findIndex((item) => item.guid === guid)
    const params: AuthDTO = {
      roleGuid,
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
