export interface SearchDTO {
  tcmName: string
}

export interface SubmitDTO {
  tcmId: string
  tcmNum: string
  tcmName: string
  isSys: number
  remark: string
}

export interface SearchDictDTO {
  tcmId: string
  value: string
  frontName: string
  frontOption: string
}

export interface SubmitDictDTO {
  id: string
  tcmId: string
  name: string
  valueNum: string
  value: string
  isDef: number
  memo: string
  inure: number
  isSys: number
  frontName: string
  frontOption: string
  tableName: string
}

export interface ListVO {
  tcmId: string
  isSys: number
  tcmName: string
  createTime: string
  tcmNum: string
  remark: string
}

export interface DictListVO {
  isDef: number
  tcmId: string
  memo: string
  frontName?: string
  tableName: string
  createTime: string
  inure: number
  name: string
  id: string
  frontOption?: string
  value: string
  valueNum: string
  isSys: number
}
