import { add, info, role, station, update, kickout, kickoutAll, userUpdatePwd } from './api'
import { ListVO, FormData, SessionListVO, Pwd } from './data.d'

// 获取用户信息
export const getInfo = async (userCode: ListVO['userCode']) => {
  const res = await info({ userCode })
  const {
    userGuid,
    userCode: code,
    userName,
    jobNumber,
    password,
    isDisabled,
    deptGuid,
    deptName,
    buGuid,
    buName,
    email,
    mobile,
    gender,
    defaultStationGuid,
    defaultStationName,
    roles,
    isAdmin,
  } = res.data

  return {
    userGuid,
    userCode: code,
    userName,
    jobNumber,
    password,
    isDisabled,
    deptGuid,
    deptName,
    buGuid,
    buName,
    email,
    mobile,
    gender,
    station: { stationGuid: defaultStationGuid, stationName: defaultStationName },
    roles,
    isAdmin,
  }
}
// 添加用户
export const addUser = async (data: FormData) => {
  const {
    userCode,
    userName,
    jobNumber,
    password,
    isDisabled,
    deptGuid,
    deptName,
    buGuid,
    buName,
    email,
    mobile,
    gender,
    station,
    roles,
    isAdmin,
  } = data

  const res = await add({
    userCode,
    userName,
    jobNumber,
    password,
    isDisabled,
    deptGuid,
    deptName,
    buGuid,
    buName,
    email,
    mobile,
    gender,
    defaultStationGuid: station!.stationGuid,
    defaultStationName: station!.stationName,
    roles: roles!.map((item) => ({ roleGuid: item.roleGuid, roleName: item.roleName })),
    isAdmin,
  })
  return res.code === 200
}
// 更新用户
export const updateUser = async (data: FormData) => {
  const {
    userGuid,
    userCode,
    userName,
    jobNumber,
    password,
    isDisabled,
    deptGuid,
    deptName,
    buGuid,
    buName,
    email,
    mobile,
    gender,
    station,
    roles,
    isAdmin,
  } = data

  const res = await update({
    userGuid,
    userCode,
    userName,
    jobNumber,
    password,
    isDisabled,
    deptGuid,
    deptName,
    buGuid,
    buName,
    email,
    mobile,
    gender,
    defaultStationGuid: station!.stationGuid,
    defaultStationName: station!.stationName,
    roles: roles!.map((item) => ({ roleGuid: item.roleGuid, roleName: item.roleName })),
    isAdmin,
  })
  return res.code === 200
}

// 获取岗位
export const getStation = async (buGuid: string) => {
  const res = await station({ buGuid })
  return res.data
}
// 获取角色
export const getRole = async () => {
  const res = await role()
  return res.data
}

// 下线会话
export const offline = async (accessToken: SessionListVO['ticket']) => {
  const res = await kickout({ accessToken })
  return res.code === 200
}
// 下线全部会话
export const offlineAll = async (userGuid: SessionListVO['userGuid']) => {
  const res = await kickoutAll({ userGuid })
  return res.code === 200
}

// 修改密码
export const changePwd = async (params: Pwd) => {
  const res = await userUpdatePwd(params)
  return res.code === 200
}
