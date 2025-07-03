export interface SearchDTO {
  tenementName: string
}

export interface SearchAdminDTO {
  tenementGuid: string
}

export interface SubmitDTO {
  tenementGuid: string
  tenementName: string
  tenementFullName: string
  comments: string
  // logoAddress: string
  // applicationLogo: string
  // portalAddress: string
}

export interface FormData {
  userGuid: string
  userCode: string
  userName: string
  jobNumber: string
  password: string
  // logoAddress: ''
  // applicationLogo: ''
  // portalAddress: ''
}

export interface SubmitAdminDTO extends FormData {
  tenementGuid: string
}

export interface RemoveAdminDTO {
  idList: string[]
  tenementGuid: string
}

export interface ListVO {
  applicationLogo: string
  comments: string
  createTime: string
  // isDisabled: 0
  // isSystem: 1
  tenementCode: string
  tenementFullName: string
  tenementGuid: string
  tenementName: string
}

export interface AdminListVO {
  tenementGuid: string
  userCode: string
  userGuid: string
  userName: string
}
