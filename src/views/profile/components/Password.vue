<template>
  <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" @keyup.enter="handleDataForm">
    <el-form-item prop="oldPassword" :label="$t('profile.oldPassword')">
      <el-input v-model="dataForm.oldPassword" type="password" show-password :placeholder="$t('placeholder')" />
    </el-form-item>
    <el-form-item prop="newPassword" :label="$t('profile.newPassword')">
      <el-input v-model="dataForm.newPassword" type="password" show-password :placeholder="userStore.pwdTips" />
    </el-form-item>
    <el-form-item prop="confirmPassword" :label="$t('profile.confirmPassword')">
      <el-input v-model="dataForm.confirmPassword" type="password" show-password :placeholder="userStore.pwdTips" />
    </el-form-item>
    <el-form-item prop="captcha" :label="$t('app.captcha')" class="login-captcha">
      <div class="flex gap">
        <el-input v-model="dataForm.captcha" :placeholder="$t('app.captcha')" :prefix-icon="Key" />
        <img :src="captchaInfo.image" @click="onCaptcha" />
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleDataForm">{{ $t('confirm') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { Key } from '@element-plus/icons-vue'

import { useCaptcha } from '@/hooks/useCaptcha'
import { validatePassword, validateConfirmPassword } from '@/utils/validate'

import { useUserStore } from '@/store/modules/user'

import { Pwd } from '../data.d'
import type { FormRules } from 'element-plus'

const { captchaInfo, getCaptchaInfo } = useCaptcha()

const { t } = useI18n()

const userStore = useUserStore()

const dataFormRef = ref()
const dataForm = reactive<Pwd>({
  key: '',
  captcha: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const dataRules = reactive<FormRules<typeof dataForm>>({
  oldPassword: [{ required: true, message: t('required'), trigger: 'blur' }],
  newPassword: [{ required: true, validator: validatePassword(userStore.pwdComplex), trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword(dataForm.newPassword), trigger: 'blur' }],
  captcha: [{ required: true, message: t('required'), trigger: 'blur' }],
})

const handleDataForm = () => {
  dataForm.key = captchaInfo.key
  dataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    const { key, captcha, oldPassword, newPassword } = dataForm
    const res = await userStore.updatePwd({ key, captcha, oldPassword, newPassword })
    if (res) {
      userStore.logoutAction()
      window.location.reload()
    }
  })
}

//获取验证码
const onCaptcha = () => {
  dataForm.captcha = ''
  getCaptchaInfo()
}
</script>
