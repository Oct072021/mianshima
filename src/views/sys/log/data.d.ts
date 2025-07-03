export interface LoginLogSearchDTO {
  userName: string
  address: string
  statusLabel: string
  startDate: string
  endDate: string
}

export interface OperateLogSearchDTO {
  realName: string
  module: string
  reqUri: string
  status: string
  startDate: string
  endDate: string
}

export interface LoginLogListVO {
  address: string
  contents: string
  createTime: string
  ipAddress: string
  operationLabel: string
  statusLabel: string
  title: string
  typeLabel: string
  userAgent: string
  userName: string
}

export interface OperateLogListVO {
  reqUri: string
  address: string
  reqMethod: string
  reqParams: string
  operateTypeLabel: string
  ip: string
  module: string
  operateType: number
  userAgent: string
  statusLabel: string
  resultMsg: string
  duration: number
  realName: string
  createTime: string
  name: string
  status: number
  resultMsg: string
}
