import { PwdComplex } from '@/store/modules/user/data.d'
import constant from '@/utils/constant'

// 把路径转换成驼峰命名
export const pathToCamel = (path: string): string => {
  return path.replace(/\/(\w)/g, (all, letter) => letter.toUpperCase())
}

// 是否外链
export const isExternalLink = (url: string): boolean => {
  return /^(https?:|\/\/|http?:|\/\/|^{{\s?apiUrl\s?}})/.test(url)
}

// 替换外链参数
export const replaceLinkParam = (url: string): string => {
  return url.replace('{{apiUrl}}', constant.apiUrl)
}

// 转换文件大小格式
export const convertSizeFormat = (size: number): string => {
  const unit = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  let index = Math.floor(Math.log(size) / Math.log(1024))
  let newSize = size / Math.pow(1024, index)

  // 保留的小数位数
  return newSize.toFixed(2) + ' ' + unit[index]
}

// 生成uuid
export const generateUUID = () => {
  let uuid = ''
  for (let i = 0; i < 32; i++) {
    let random = (Math.random() * 16) | 0
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-'
    }
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
  }
  return uuid
}

// 获取svg图标(id)列表
export const getIconList = (): string[] => {
  const rs: string[] = []
  const list = document.querySelectorAll('svg symbol[id^="icon-"]')
  for (let i = 0; i < list.length; i++) {
    rs.push(list[i].id)
  }
  return rs
}

// 树形数据转换
export const treeDataTranslate = (data: any[], id?: string, pid?: string): any[] => {
  const res: any[] = []
  const temp: any = {}
  id = id || 'id'
  pid = pid || 'pid'
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (let k = 0; k < data.length; k++) {
    if (!temp[data[k][pid]] || data[k][id] === data[k][pid]) {
      res.push(data[k])
      continue
    }
    if (!temp[data[k][pid]]['children']) {
      temp[data[k][pid]]['children'] = []
    }
    temp[data[k][pid]]['children'].push(data[k])
  }
  return res
}

// 生成数字字母混合字符串
export const getRandom = (num: number) => {
  const chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ]
  let res = ''
  for (let i = 0; i < num; i++) {
    const id = Math.floor(Math.random() * 36)
    res += chars[id]
  }
  return res
}

interface Config<T, K> {
  menuList: T[]
  target: keyof T
  mapper: (key: T[keyof T], value: T[]) => K
}
/**
 * 基于某个字段对数据进行分类，根据分类结果生成新数据
 * @param menuList 原始数据
 * @param target 分类基准的目标字段
 * @param mapper 生成新数据的映射函数
 * @returns 新数据
 */
export const generateNewList = <T extends Object, K>({ menuList, target, mapper }: Config<T, K>) => {
  const map = new Map<string, T[]>()
  // 使用Map结构对路由菜单进行分类
  menuList.forEach((menu) => {
    const tempKey = JSON.stringify(menu[target])
    if (!map.has(tempKey)) map.set(tempKey, [])
    map.get(tempKey)!.push(menu)
  })

  const newList: K[] = []
  map.forEach((value, key) => {
    const newkey: T[keyof T] = JSON.parse(key)
    const newItem = mapper(newkey, value)
    newList.push(newItem)
  })

  return newList
}

// 生成随机密码
export const generatePwd = (config: PwdComplex) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const specialChars = '@!#$%&*'

  // 组合所有可能的字符
  const allChars = lowercase + uppercase + numbers + specialChars

  // 随机确定字符串长度（8-32）
  const length = Math.floor(Math.random() * (config.maxiNumLength - config.miniNumLength + 1)) + config.miniNumLength

  let result = ''

  // 确保至少包含每种类型中的一个字符
  if (config.mixedCase) {
    result += lowercase.charAt(Math.floor(Math.random() * lowercase.length))
    result += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
  }
  if (config.digits) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }
  if (config.specialCharacters) {
    result += specialChars.charAt(Math.floor(Math.random() * specialChars.length))
  }

  // 填充剩余字符
  for (let i = 4; i < length; i++) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }

  // 打乱字符串中的字符顺序
  return result
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
}
