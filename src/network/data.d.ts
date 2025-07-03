declare module 'axios' {
  export interface AxiosRequestConfig {
    typeStr?: string
    dataType?: string
    encrypt?: boolean
    loading?: boolean
  }
}

export interface Response<T = any> {
  code: number
  msg?: string
  data: T
}
