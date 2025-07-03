import { SessionStorage, Storage } from '@/utils/storage'
import CacheKey from '@/utils/cache/key'

import { ITheme } from '@/store/modules/app/data.d'
import { themeConfig } from '@/store/theme/config'

// 缓存
class Cache {
  getTicket = (): string => {
    return Storage.getItem(CacheKey.TicketKey) || ''
  }

  setTicket = (value: string) => {
    Storage.setItem(CacheKey.TicketKey, value)
  }

  removeTicket = () => {
    Storage.removeItem(CacheKey.TicketKey)
  }

  getSidebarOpened = (): boolean => {
    return Storage.getItem(CacheKey.SidebarOpenedKey) || false
  }

  setSidebarOpened = (value: boolean) => {
    Storage.setItem(CacheKey.SidebarOpenedKey, value)
  }

  getLanguage = (): string => {
    return Storage.getItem(CacheKey.LangKey) || 'zh-CN'
  }

  setLanguage = (value: string) => {
    Storage.setItem(CacheKey.LangKey, value)
  }

  getComponentSize = (): string => {
    return Storage.getItem(CacheKey.ComponentSizeKey) || 'default'
  }

  setComponentSize = (value: string) => {
    Storage.setItem(CacheKey.ComponentSizeKey, value)
  }

  getTheme = (): ITheme => {
    return (SessionStorage.getItem(CacheKey.ThemeKey) as ITheme) || themeConfig
  }

  setTheme = (value: ITheme) => {
    SessionStorage.setItem(CacheKey.ThemeKey, value)
  }

  removeTheme = () => {
    SessionStorage.removeItem(CacheKey.ThemeKey)
  }

  getRedirect = (): string => {
    return Storage.getItem(CacheKey.Redirect)
  }

  setRedirect = (value: string) => {
    Storage.setItem(CacheKey.Redirect, value)
  }

  getConfigData = (): any => {
    return Storage.getItem(CacheKey.ConfigData)
  }

  setConfigData = (value: any) => {
    Storage.setItem(CacheKey.ConfigData, value)
  }
}

export default new Cache()
