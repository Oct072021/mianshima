export interface SubmitDTO {
  id: string
  value: string // 字段名
  valueNum: string // 字段值
  // ordNum: string
  memo: string
}

export interface ListVO {
  memo: string
  recordDate: string
  id: string
  value: string // 字段名
  valueNum: string // 字段值
}
