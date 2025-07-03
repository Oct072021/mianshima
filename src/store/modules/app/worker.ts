import { AppState, ITheme, App, FuncDTO, BtnDTO } from './data.d'
import { Response } from '@/network/data.d'
import { getAppList, getButtonList, getFuncList } from './api'
import axios from 'axios'
import { decrypt, encrypt } from '@/utils/smCrypto'

const recurse = (data: FuncDTO[], applicationGuid: string, pid: string, buttons: BtnDTO[]) => {
  const res: App[] = []
  data?.forEach((d) => {
    const temp2: App = {
      guid: d.functionGuid,
      code: d.functionCode,
      name: d.functionName,
      type: d.functionType,
      icon: d.functionIcon,
      url: d.functionUrl,
      comments: d.comments,
      applicationGuid,
      pid,
      subFunctionList: [],
    }
    if (d.subFunctionList?.length) {
      temp2.subFunctionList = recurse(d.subFunctionList, applicationGuid, d.functionGuid, buttons)
    } else {
      temp2.subFunctionList = buttons
        .filter((r) => r.functionGuid === d.functionGuid)
        .map((r) => ({
          name: r.buttonId,
          guid: r.functionButtonId,
          code: r.functionButtonId,
          functionGuid: r.functionGuid,
          authority: r.authority,
          applicationGuid,
          pid: d.functionGuid,
          type: '3',
        }))
    }
    res.push(temp2)
  })
  return res
}

self.onmessage = async function (event) {
  const en = encrypt({}, event.data.pk)

  const res1 = await axios.post(import.meta.env.VITE_API_BASE_URL + '/system-service/application/list', en.enData, {
    headers: {
      'X-Sec-Code': en.xSecCode,
      'X-Sec-Vector': en.xSecVector,
      'X-Sec-Request': 'script',
      'Content-Type': 'application/json',
      withDirectives: true,
    },
  })
  const r1 = decrypt(res1.data.data)
  // console.log(r1)

  const res2 = await axios.post(import.meta.env.VITE_API_BASE_URL + '/system-service/function/button/list', en.enData, {
    headers: {
      'X-Sec-Code': en.xSecCode,
      'X-Sec-Vector': en.xSecVector,
      'X-Sec-Request': 'script',
      'Content-Type': 'application/json',
      withDirectives: true,
    },
  })
  const r2 = decrypt(res2.data.data)
  // console.log(r2)

  const taskList = [] as Promise<Response<FuncDTO[]>>[]
  r1.forEach(({ applicationGuid }: any) => {
    const en = encrypt({ applicationGuid }, event.data.pk)
    taskList.push(
      axios.post(import.meta.env.VITE_API_BASE_URL + '/system-service/function/tree', en.enData, {
        headers: {
          'X-Sec-Code': en.xSecCode,
          'X-Sec-Vector': en.xSecVector,
          'X-Sec-Request': 'script',
          'Content-Type': 'application/json',
          withDirectives: true,
        },
      })
    )
  })
  const r3 = (await Promise.all(taskList)).map(({ data }: any) => decrypt(data.data))
  // console.log(r3)

  const result: App[] = []

  r1.forEach((item: any, i: any) => {
    const temp: App = {
      guid: item.applicationGuid,
      code: item.applicationCode,
      name: item.applicationName,
      type: '99',
      icon: item.applicationIcon,
      url: item.applicationUrl,
      comments: item.comments,
      pid: null,
      subFunctionList: [],
    }

    temp.subFunctionList = recurse(r3[i], item.applicationGuid, '', r2)

    result.push(temp)
  })
  console.log(result)

  self.postMessage(result)
}
