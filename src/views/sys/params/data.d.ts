export interface SearchDTO {
  paramType: string
  paramKey: string
  paramValue: string
}

export interface SubmitDTO {
  id: number
  paramName: string
  paramType: number
  paramKey: string
  paramValue: string
  remark: string
}

export interface ListVO {
  paramKey: string
  paramType: number
  createTime: string
  remark: string
  id: number
  paramName: string
  paramValue: string
}
