import { sm2, sm3, sm4 } from 'sm-crypto'
import { v4 as uuidv4 } from 'uuid'

const key = sm3(uuidv4()).substring(0, 32).toString()
const iv = sm3(uuidv4()).substring(0, 32).toString()

export const encrypt = <T extends object>(data: T, pk: string) => {
  let enData
  if (data) enData = sm4.encrypt(JSON.stringify(data), key, { mode: 'cbc', iv })

  // debugger
  const xSecCode = sm2.doEncrypt(key, pk, 1)
  const xSecVector = sm2.doEncrypt(iv, pk, 1)

  return { enData, xSecCode, xSecVector }
}

export const decrypt = <T = any>(data: string): T => {
  return JSON.parse(sm4.decrypt(data, key, { mode: 'cbc', iv }))
}
