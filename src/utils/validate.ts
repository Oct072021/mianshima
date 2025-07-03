import { PwdComplex } from '@/store/modules/user/data.d'
import type { InternalRuleItem } from 'async-validator'
import { useI18n } from 'vue-i18n'

export const isExternalLink = (path: string): boolean => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const validateEmail = (rule: any, value: any, callback: (e?: Error) => any) => {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('邮箱格式不正确'))
  }
}
// 密码校验
export const validatePassword = (pwdComplex?: PwdComplex) => {
  const { t } = useI18n()
  const validator = (rule: InternalRuleItem, value: string, callback: Function) => {
    if (pwdComplex) {
      const { characters, maxiNumLength, miniNumLength, digits, specialCharacters, mixedCase } = pwdComplex
      if (digits && !/\d/.test(value)) {
        callback(new Error(t('profile.includeNumber')))
        return
      }
      if (mixedCase && !/[A-Z]/.test(value) && !/[a-z]/.test(value)) {
        callback(new Error(t('profile.includeMixedCase')))
        return
      }
      if (specialCharacters && !/[@!#$%&*]/.test(value)) {
        callback(new Error(t('profile.includeSpecialChar') + ' ' + characters))
        return
      }
      if (value.length > maxiNumLength) {
        callback(new Error(t('profile.maxiNumLength') + maxiNumLength))
        return
      }
      if (value.length < miniNumLength) {
        callback(new Error(t('profile.miniNumLength') + miniNumLength))
        return
      }
      callback()
    } else {
      if (value.length === 0) {
        callback(new Error(t('required')))
        return
      }
      callback()
    }
  }
  return validator
}
// 确认密码校验
export const validateConfirmPassword = (origin: string) => {
  const { t } = useI18n()
  const validator = (rule: InternalRuleItem, value: string, callback: Function) => {
    if (value !== origin) {
    callback(new Error(t('profile.checkConfirmPassword')))
  } else {
    callback()
  }
  }
  return validator
}
export const mobileRegExp = /^1[3456789]\d{9}$/

export const validateMobile = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (mobileRegExp.test(value)) {
    callback()
  } else {
    callback(new Error('手机号格式不正确'))
  }
}
