<template>
  <el-dialog v-model="visible" :title="$t('user.changePwd')" :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto">
      <el-form-item prop="newPassword" :label="$t('profile.newPassword')">
        <div class="flex" style="width: 100%">
          <el-input
            class="grow"
            v-model="dataForm.newPassword"
            type="password"
            show-password
            :placeholder="userStore.pwdTips"
          />
          <el-button
            v-if="isRandom"
            ref="copyBtnRef"
            :icon="Document"
            type="primary"
            @click="clip(dataForm.newPassword, copyBtnRef.$el)"
          >
            {{ $t('copy') }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item v-show="!isRandom" prop="confirmPassword" :label="$t('profile.confirmPassword')">
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
        <el-button @click="handleReset">{{ $t('reset') }}</el-button>
        <el-button type="success" @click="randomPwd">{{ $t('randomPwd') }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/modules/user'
import { Document, Key } from '@element-plus/icons-vue'

import { useCaptcha } from '@/hooks/useCaptcha'
import { validatePassword, validateConfirmPassword } from '@/utils/validate'
import clip from '@/utils/clipboard'
import { generatePwd } from '@/utils/tool'

import { changePwd } from '../service'

import { ListVO, Pwd } from '../data.d'
import type { FormInstance, FormRules } from 'element-plus'

const { captchaInfo, getCaptchaInfo } = useCaptcha()

const { t } = useI18n()

const userStore = useUserStore()

const visible = ref(false)
const dataFormRef = ref<FormInstance>()
const dataForm = reactive<Pwd>({
  key: '',
  captcha: '',
  userName: '',
  newPassword: '',
  confirmPassword: '',
})

const init = (row: ListVO) => {
  visible.value = true
  isRandom.value = false
  dataForm.userName = row.userName

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }
  onCaptcha()
}

const dataRules = reactive<FormRules<typeof dataForm>>({
  newPassword: [{ required: true, validator: validatePassword(userStore.pwdComplex), trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword(dataForm.newPassword), trigger: 'blur' }],
  captcha: [{ required: true, message: t('required'), trigger: 'blur' }],
})

const handleDataForm = () => {
  dataForm.key = captchaInfo.key
  dataFormRef.value!.validate(async (valid: boolean) => {
    if (!valid) return

    const res = await changePwd(dataForm)
    if (res) {
      visible.value = false
    } else {
      onCaptcha()
    }
  })
}

const copyBtnRef = ref()
const isRandom = ref(false)
const randomPwd = () => {
  isRandom.value = true
  const pwd = generatePwd(userStore.pwdComplex)
  dataForm.newPassword = pwd
  dataForm.confirmPassword = pwd
  onCaptcha()
}

// 获取验证码
const onCaptcha = () => {
  dataForm.captcha = ''
  getCaptchaInfo()
}

const handleReset = () => {
  dataFormRef.value!.resetFields()
  onCaptcha()
  isRandom.value = false
}

defineExpose({
  init,
})
</script>
