export interface ListVO {
  buGuid: string
  ticket: string
  userGuid: string
  userName: string
  loginLocation: string
  userCode: string
  buName: string
  ipAddr: string
}

export interface OnlineState {
  onlineUser: ListVO[]
}
