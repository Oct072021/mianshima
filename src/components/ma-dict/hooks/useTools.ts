import { useAppStore } from '@/store/modules/app'

export const useTools = () => {
  // 获取字典数据列表
  const getDictDataList = (dictList: any[], dictType: string) => {
    const type = dictList.find((element: any) => element.tcmNum === dictType)
    if (type) {
      return type.dataList
    } else {
      return []
    }
  }

  // 获取字典Label
  const getDictLabel = (dictList: any[], dictType: string, dictValue: string) => {
    const type = dictList.find((element: any) => element.dictType === dictType)
    if (type) {
      const val = type.dataList.find((element: any) => element.dictValue === dictValue + '')
      if (val) {
        return val.dictLabel
      } else {
        return dictValue
      }
    } else {
      return dictValue
    }
  }

  // 获取字典Label样式
  const getDictLabelClass = (dictList: any[], dictType: string, dictValue: string): string => {
    const type = dictList.find((element: any) => element.dictType === dictType)
    if (type) {
      const val = type.dataList.find((element: any) => element.dictValue === dictValue + '')
      if (val) {
        return val.labelClass
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  const getDictLabelList = (dictType: string, dictValue: any): string => {
    if (Number.isInteger(dictValue)) {
      dictValue = dictValue + ''
    }

    if (!dictValue) {
      return ''
    }

    const appStore = useAppStore()

    let result = ''
    dictValue.split(',').forEach((value: string) => {
      const classStyle = getDictLabelClass(appStore.dictList, dictType, value)
      const label = getDictLabel(appStore.dictList, dictType, value)

      if (classStyle) {
        result += `<span class="el-tag el-tag--${classStyle} el-tag--${appStore.componentSize}">${label}</span>&nbsp;`
      } else {
        result += label + '&nbsp;'
      }
    })

    return result
  }

  return {
    getDictDataList,
    getDictLabelList,
  }
}
