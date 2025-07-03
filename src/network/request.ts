import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'
import { Response } from './data.d'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import cache from '@/utils/cache'
import { ElMessageBox } from 'element-plus/es'
import { decrypt, encrypt } from '@/utils/smCrypto'

const requestQueue: any[] = [] // 请求队列
const maxConcurrent = 3 // 最大并发请求数
let concurrentRequests = 0 // 当前并发请求数

// axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  loading: true,
  encrypt: true,
  dataType: 'default',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()

    if (userStore.ticket) {
      config.headers['ticket'] = userStore.ticket
    }

    config.headers['Accept-Language'] = cache.getLanguage()

    // 追加时间戳，防止GET请求缓存
    if (config.method?.toUpperCase() === 'GET') {
      config.params = { ...config.params, t: new Date().getTime() }
    }

    if (config.encrypt) {
      let data, xSecCode, xSecVector
      if (config.dataType === 'default') {
        const en = encrypt(config.data, userStore.publicKey)
        data = en.enData
        xSecCode = en.xSecCode
        xSecVector = en.xSecVector
      }
      if (config.dataType === 'formData') {
        const formData = new FormData()
        const en = encrypt(config.data.form, userStore.publicKey)
        formData.append('file', config.data.file)
        formData.append('form', en.enData!)

        data = formData
        xSecCode = en.xSecCode
        xSecVector = en.xSecVector
      }
      config.data = data
      config.headers['X-Sec-Code'] = xSecCode
      config.headers['X-Sec-Vector'] = xSecVector
      config.headers['X-Sec-Request'] = 'script'
    }

    if (concurrentRequests < maxConcurrent) {
      concurrentRequests++

      return config
    } else {
      return new Promise((resolve) => {
        requestQueue.unshift({ config, resolve })
      })
    }

    // return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    const { config, data } = response
    const { code, msg } = data

    // 没有权限，如：未登录、token过期
    if (code === 401) return handleAuthorized()

    if (response.config.responseType === 'blob') return response

    if (config.typeStr) {
      let message: string, type: 'success' | 'warning' | 'info' | 'error'
      if (code === 200) {
        message = config.typeStr + '成功'
        type = 'success'
      } else {
        type = 'error'
        message = config.typeStr + '失败--' + msg
      }
      ElMessage({ message, type })
    }

    if (config.encrypt && data.data) {
      // console.log(data.data);
      data.data = decrypt(data.data)
    }

    concurrentRequests--
    if (requestQueue.length > 0) {
      const { config, resolve } = requestQueue.shift()
      concurrentRequests++
      resolve(config)
    }

    return data
  },
  (error: AxiosError) => {
    console.log(error)
    if (error.code === 'ECONNABORTED') {
      ElMessage({
        type: 'warning',
        message: '请求超时，请重新请求',
      })
    }
    if (error.status === 401) return handleAuthorized()

    // ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

const handleAuthorized = () => {
  ElMessageBox.confirm('登录超时，请重新登录', '提示', {
    showCancelButton: false,
    closeOnClickModal: false,
    showClose: false,
    confirmButtonText: '重新登录',
    type: 'warning',
  }).then(() => {
    cache.removeTicket()
    location.reload()

    return Promise.reject('登录超时，请重新登录')
  })
}

/* 导出封装的请求方法 */
export const Http = {
  // T => 请求数据类型， K => 返回数据类型
  get<T = any, K = any>(url: string, config?: AxiosRequestConfig<T>): Promise<Response<K>> {
    return service.get(url, config)
  },
  post<T = any, K = any>(url: string, data?: T, config?: AxiosRequestConfig<T>): Promise<Response<K>> {
    return service.post(url, data, config)
  },
  put<T = any, K = any>(url: string, data?: T, config?: AxiosRequestConfig<T>): Promise<Response<K>> {
    return service.put(url, data, config)
  },
  delete<T = any, K = any>(url: string, config?: AxiosRequestConfig<T>): Promise<Response<K>> {
    return service.delete(url, config)
  },
}

// 导出 axios 实例
export default service
