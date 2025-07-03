import { isValidJsonString } from './common'
/**
 * window.localStorage 浏览器永久缓存
 * @method setItem 设置缓存
 * @method getItem 获取缓存
 * @method removeItem 移除缓存
 * @method clear 移除全部缓存
 */
export const Storage = {
  setItem(key: string, value: any) {
    if (value === undefined) {
      return
    }
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  getItem(key: string) {
    let json: any = window.localStorage.getItem(key)
    return JSON.parse(json)
  },
  removeItem(key: string) {
    window.localStorage.removeItem(key)
  },
  clear() {
    window.localStorage.clear()
  },
}

/**
 * window.sessionStorage 浏览器临时缓存
 * @method setItem 设置缓存
 * @method getItem 获取缓存
 * @method removeItem 移除缓存
 * @method clear 移除全部缓存
 */
export const SessionStorage = {
  setItem(key: string, value: any) {
    const data = value instanceof Object || value instanceof Array ? JSON.stringify(value) : value
    sessionStorage.setItem(key, data)
  },
  getItem(key: string) {
    const data = sessionStorage.getItem(key)
    if (!data) return
    if (isValidJsonString(data)) {
      return JSON.parse(data)
    } else {
      return data
    }
  },
  removeItem(key: string) {
    sessionStorage.removeItem(key)
  },
  clear() {
    sessionStorage.clear()
  },
}
