import { Tree } from '@/types/tree.d'

export interface SearchDTO {
  roleName: string
}

export interface SubmitDTO {
  roleName: string
  roleGuid: string
  remarks: string
}

export interface TreeVO extends Tree {
  buName: string
  buGuid: string
  buCode: string
  parentGuid: string
  companyGuid: string
  namepath: string
}

export interface OrgDTO extends Omit<TreeVO, 'children'|'namepath'> {
  companyAddr: string
  buType: number
  comments: string
}
