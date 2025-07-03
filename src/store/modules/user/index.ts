import { defineStore } from 'pinia'

import {
  login,
  userInfo,
  logout,
  firstLoginUpdatePwd,
  pwdComplexityValidConfig,
  loginUserUpdatePwd,
  isFirstLogin,
} from './api'

import { Login } from '@/views/login/data.d'
import { UserState, UpdatePwd } from './data.d'

import { encrypt, decrypt } from '@/utils/smCrypto'
import cache from '@/utils/cache'
import { Storage } from '@/utils/storage'
import { i18n } from '@/i18n'

const { t } = i18n.global

export const useUserStore = defineStore('userStore', {
  state: (): UserState => ({
    // 用户信息
    user: {
      id: null,
      username: '',
      realName: '',
      superAdmin: 0, // -1:租户  0:普通用户  1:后台管理员
      authoritySet: [],
      roleSet: [],
      stationSet: [],
      dataScopeList: [],
      buguid: '',
      buName: '',
    },
    publicKey: Storage.getItem('PK'),
    ticket: cache.getTicket(),
    firstLogin: 0,
    updateFirstPwdKey: '',
    // 密码复杂度
    pwdComplex: {
      characters: '',
      lockTime: -1,
      specialCharacters: false,
      digits: false,
      maxRetryCount: -1,
      maxiNumLength: -1,
      miniNumLength: -1,
      mixedCase: false,
    },
    pwdTips: '',
  }),
  actions: {
    // 账号登录
    async accountLogin(loginForm: Login, pk: string) {
      const { enData, xSecCode, xSecVector } = encrypt(loginForm, pk)
      const res = await login(xSecCode, xSecVector, enData)
      if (res.code === 200) {
        const { publicKey, ticket } = decrypt<Omit<UserState, 'user'>>(res.data)

        this.publicKey = publicKey
        Storage.setItem('PK', publicKey)
        this.ticket = ticket
        cache.setTicket(ticket)
      }
      return res.code === 200
    },
    // 获取用户信息
    async getUserInfo() {
      const res = await userInfo()

      const { id, username, realName, superAdmin, authoritySet, dataScopeList, buguid, buName, roleSet, stationSet } =
        res.data

      Object.assign(this.user, {
        id,
        username,
        realName,
        superAdmin,
        authoritySet,
        dataScopeList,
        buguid,
        buName,
        roleSet,
        stationSet,
      })
    },
    // 用户退出
    async logoutAction() {
      await logout()

      cache.removeTicket()
      cache.setRedirect('/dashboard')
      Storage.removeItem('PK')
    },
    // 获取用户信息
    async getIsFirstLogin() {
      const res = await isFirstLogin()
      const { firstLogin, updateFirstPwdKey } = res.data
      this.firstLogin = firstLogin
      this.updateFirstPwdKey = updateFirstPwdKey
    },
    // 首次登录修改密码
    async firstUpdatePwd({ newPassword }: Pick<UpdatePwd, 'newPassword'>) {
      const params = {
        key: this.updateFirstPwdKey,
        userName: this.user.username!,
        newPassword,
      }
      const res = await firstLoginUpdatePwd(params)
      if (res.code === 200) {
        return true
      } else {
        cache.removeTicket()
        Storage.removeItem('PK')
        return false
      }
    },
    // 获取密码复杂度配置
    async getComplexConfig() {
      const { data } = await pwdComplexityValidConfig()
      console.log(data)

      Object.assign(this.pwdComplex, data)
      const tip1 = `${data.miniNumLength}-${data.maxiNumLength}${t('user.tip1')}、`
      const tip2 = data.mixedCase ? `${t('user.tip2')}、` : ''
      const tip3 = data.digits ? `${t('user.tip3')}、` : ''
      const tip4 = data.specialCharacters ? `${t('user.tip4')}${data.characters}` : ''
      this.pwdTips = `${tip1}${tip2}${tip3}${tip4}`
    },
    // 修改密码
    async updatePwd(pwdInfo: Omit<UpdatePwd, 'userName'>) {
      const params = {
        userName: this.user.username!,
        ...pwdInfo,
      }
      const res = await loginUserUpdatePwd(params)

      return res.code === 200
    },
  },
})
