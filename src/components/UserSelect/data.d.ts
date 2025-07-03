export interface SearchDTO {
  userName: string
  deptGuid: string
  mobile?: string
}

export interface ListVO {
  deptGuid: string
  mobile: string
  userGuid: string
  userName: string
  userCode: string
  buGuid: string
  isLocked: number
  isDisabled: number
  email: string
  defaultStationGuid: string
}
