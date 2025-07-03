<template>
  <el-form v-loading="loading" ref="loginFormRef" :model="loginForm" :rules="loginRules" @keyup.enter="onLogin">
    <el-form-item prop="userCode">
      <el-input v-model="loginForm.userCode" :prefix-icon="User" :placeholder="$t('app.username')" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" :prefix-icon="Lock" show-password :placeholder="$t('app.password')" />
    </el-form-item>
    <el-form-item prop="captcha" class="login-captcha">
      <el-input v-model="loginForm.captcha" :placeholder="$t('app.captcha')" :prefix-icon="Key" />
      <img :src="captchaInfo.image" @click="onCaptcha" />
    </el-form-item>
    <el-form-item class="login-button">
      <el-button type="primary" @click="onLogin()">{{ $t('app.signIn') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/modules/user'
import { User, Lock, Key } from '@element-plus/icons-vue'
import type { FormRules } from 'element-plus'

import { useCaptcha } from '@/hooks/useCaptcha'

import { Login } from '../data.d'

import constant from '@/utils/constant'
import cache from '@/utils/cache'

const { captchaInfo, getCaptchaInfo } = useCaptcha()

const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()

const loading = ref(false)

const loginFormRef = ref()
const loginForm = reactive<Login>({
  userCode: import.meta.env.VITE_ENV === 'development' ? 'gddstAdmin' : '',
  password: import.meta.env.VITE_ENV === 'development' ? 'Gis@123456' : '',
  key: '',
  captcha: '',
})
const loginRules = reactive<FormRules<Login>>({
  userCode: [{ required: true, message: t('required'), trigger: 'blur' }],
  password: [{ required: true, message: t('required'), trigger: 'blur' }],
  captcha: [{ required: true, message: t('required'), trigger: 'blur' }],
})

//获取验证码
const onCaptcha = () => {
  loginForm.captcha = ''
  getCaptchaInfo()
}

const onLogin = () => {
  loginForm.key = captchaInfo.key
  loginFormRef.value.validate((valid: boolean) => {
    if (!valid) return
    loading.value = true
    // 用户登录
    userStore.accountLogin(loginForm, captchaInfo.pk).then((res) => {
      if (res) {
        router.push({ path: cache.getRedirect() || constant.loginPage })
      } else {
        loading.value = false
        onCaptcha()
      }
    })
  })
}
</script>

<style lang="scss" scoped>
.login-captcha {
  :deep(.el-input) {
    width: 200px;
  }
}
.login-captcha img {
  width: 150px;
  height: 40px;
  margin: 5px 0 0 10px;
  cursor: pointer;
}
.login-button {
  :deep(.el-button--primary) {
    margin-top: 10px;
    width: 100%;
    height: 45px;
    font-size: 18px;
    letter-spacing: 8px;
  }
}
</style>
