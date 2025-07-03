// 判断是否为JSON字符串
export const isValidJsonString = (str:string) => {
  try {
    JSON.parse(str)
    return true // 如果成功解析，返回 true
  } catch (error) {
    return false // 如果抛出错误，返回 false
  }
}
