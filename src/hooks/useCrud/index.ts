import service, { Http } from '@/network/request'

import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { List, Pagination } from '@/types/network.d'
import { IHooksOptions } from '@/hooks/useCrud/data.d'

export const useCrud = <T = any, K = any>(options: IHooksOptions<T, K>) => {
  const { t } = useI18n()

  const defaultOptions: IHooksOptions<T, K> = {
    createdIsNeed: true,
    dataListUrl: '',
    isPage: true,
    deleteUrl: '',
    primaryKey: 'id' as keyof K,
    exportUrl: '',
    queryForm: {} as T,
    dataList: [] as K[],
    order: '',
    asc: false,
    page: 1,
    limit: 10,
    total: 0,
    pageSizes: [10, 20, 50, 100, 200, 500, 1000],
    dataListLoading: false,
    dataListSelections: [],
    dataListSelectionKeys: [],
  }

  const mergeDefaultOptions = (options: IHooksOptions<T, K>, props: IHooksOptions<T, K>): IHooksOptions<T, K> => {
    let key: keyof IHooksOptions<T, K>
    for (key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key] as any
      }
    }
    return props
  }

  // 覆盖默认值
  const state = mergeDefaultOptions(defaultOptions, options)

  onMounted(() => {
    if (state.createdIsNeed) {
      query()
    }
  })

  const query = () => {
    if (!state.dataListUrl) return

    state.dataListLoading = true

    const params: Pagination & T = {
      page: state.isPage ? state.page : undefined,
      limit: state.isPage ? state.limit : undefined,
      ...state.queryForm,
    }
    // console.log(params)

    Http.post<typeof params, List<K> | K[]>(state.dataListUrl, params)
      .then((res) => {
        // console.log(state.dataListUrl, res)
        state.dataList = state.isPage ? (res.data as List<K>).list : (res.data as K[])
        state.total = state.isPage ? (res.data as List<K>).total : 0
      })
      .finally(() => {
        state.dataListLoading = false
      })
  }

  const getDataList = () => {
    state.page = 1
    query()
  }

  const sizeChangeHandle = (val: number) => {
    state.page = 1
    state.limit = val
    query()
  }

  const currentChangeHandle = (val: number) => {
    state.page = val
    query()
  }

  // 多选
  const selectionChangeHandle = (selections: K[]) => {
    state.dataListSelections = selections
    state.dataListSelectionKeys = selections.map((item) => state.primaryKey! && item[state.primaryKey])
  }

  // 单选值
  const singleSelectionHandle = () => {
    const selectionKeys = state.dataListSelectionKeys ? state.dataListSelectionKeys : []

    if (selectionKeys.length === 0) {
      ElMessage.warning(t('msg.selectOne'))
      return
    }

    if (selectionKeys.length > 1) {
      ElMessage.warning(t('msg.selectOnlyOne'))
      return
    }

    return selectionKeys[0]
  }

  // 排序
  const sortChangeHandle = (data: any) => {
    const { prop, order } = data

    if (prop && order) {
      state.order = prop
      state.asc = order === 'ascending'
    } else {
      state.order = ''
    }

    query()
  }

  const deleteHandle = (key: number | string) => {
    if (!state.deleteUrl) {
      return
    }

    ElMessageBox.confirm(t('tip.del'), t('tip.tip'), {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      type: 'warning',
    })
      .then(() => {
        service.delete(state.deleteUrl + '/' + key).then(() => {
          ElMessage.success(t('msg.delSuccess'))

          query()
        })
      })
      .catch(() => {})
  }

  const deleteBatchHandle = (key?: K[keyof K]) => {
    let data: K[keyof K][]
    if (key) {
      data = [key]
    } else {
      data = state.dataListSelectionKeys ? state.dataListSelectionKeys : []

      if (data.length === 0) {
        ElMessage.warning(t('msg.batchDel'))
        return
      }
    }

    ElMessageBox.confirm(t('tip.del'), t('tip.tip'), {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      type: 'warning',
    })
      .then(() => {
        if (state.deleteUrl) {
          Http.post<typeof data, null>(state.deleteUrl, data).then((res) => {
            if (res.code === 200) {
              ElMessage.success(t('msg.delSuccess'))
              query()
            }
          })
        }
      })
      .catch(() => {})
  }

  const downloadHandle = async (url: string, filename?: string, method: string = 'POST'): Promise<any> => {
    try {
      const res = await service({
        responseType: 'blob',
        url: url,
        method: method,
        data: state.queryForm,
      })
      // 创建a标签
      const down = document.createElement('a')

      // 文件名没传，则使用时间戳
      if (filename) {
        down.download = filename
      } else {
        const downName = res.headers['content-disposition'].split('=')[1]
        down.download = decodeURI(downName)
      }

      // 隐藏a标签
      down.style.display = 'none'

      // 创建下载url
      down.href = URL.createObjectURL(
        new Blob([res.data], {
          type: res.data.type,
        })
      )

      // 模拟点击下载
      document.body.appendChild(down)
      down.click()

      // 释放URL
      URL.revokeObjectURL(down.href)
      // 下载完成移除
      document.body.removeChild(down)
    } catch (err: any) {
      ElMessage.error(err.message)
    }
  }

  const reset = (queryRef: FormInstance) => {
    queryRef.resetFields()

    getDataList()
  }

  return {
    getDataList,
    sizeChangeHandle,
    currentChangeHandle,
    selectionChangeHandle,
    singleSelectionHandle,
    sortChangeHandle,
    deleteHandle,
    deleteBatchHandle,
    downloadHandle,
    reset,
  }
}
