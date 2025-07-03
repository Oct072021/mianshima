export interface SearchDTO {
  pluginName: string
}

export interface SubmitDTO {
  pluginGuid: string
  pluginName: string
  pluginClassName: string
  pluginUrl: string
  comments: string
}

export interface ListVO {
  comments: string
  createTime: string
  pluginClassName: string
  pluginGuid: string
  pluginName: string
  pluginUrl: string
}
