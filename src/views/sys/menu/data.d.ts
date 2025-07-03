import { App, FuncDTO, BtnDTO } from '@/store/modules/app/data.d'

export type App = App
export type FuncDTO = FuncDTO
export type BtnDTO = BtnDTO

export interface SubmitDTO extends Omit<App, 'code' | 'subFunctionList' | 'functionGuid'> {
  authority?: string
}

export interface PluginDTO {
  pluginGuid: string
  pluginName: string
  pluginClassName: string
  pluginUrl: string
  comments?: string
}
