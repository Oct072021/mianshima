<template>
  <el-config-provider :locale="locale" :size="size">
    <router-view />
  </el-config-provider>

  <template v-if="userStore.firstLogin">
    <el-dialog
      v-model="dialogVisible"
      :title="$t('user.profilePassword')"
      width="600"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form v-loading="loading" :model="passwordForm" :rules="formRules" ref="formRef" label-width="auto">
        <el-form-item :label="$t('user.newPassword') + ': '" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password :placeholder="userStore.pwdTips" />
        </el-form-item>
        <el-form-item prop="confirmPassword" :label="$t('profile.confirmPassword')">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password :placeholder="userStore.pwdTips" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="confirm"> {{ $t('confirm') }} </el-button>
      </template>
    </el-dialog>
  </template>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { RouterView } from 'vue-router'

import { messages } from '@/i18n'
import { handleThemeStyle } from '@/utils/theme'
import { validatePassword, validateConfirmPassword } from '@/utils/validate'

import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'

import { UpdatePwd } from '@/store/modules/user/data.d'
import type { FormRules } from 'element-plus'

const appStore = useAppStore()
const userStore = useUserStore()

const locale = computed(() => messages![appStore.language].el)
const size = computed(() => appStore.componentSize)

const dialogVisible = ref(true)
const formRef = ref()
interface Pwd extends Pick<UpdatePwd, 'newPassword'> {
  confirmPassword: string
}
const passwordForm = reactive<Pwd>({
  newPassword: '',
  confirmPassword: '',
})
const formRules = reactive<FormRules<typeof passwordForm>>({
  newPassword: [{ required: true, validator: validatePassword(userStore.pwdComplex), trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword(passwordForm.newPassword), trigger: 'blur' }],
})

const loading = ref(false)
const confirm = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    // 用户登录
    const res = await userStore.firstUpdatePwd(passwordForm)
    if (res) {
      userStore.logoutAction()
      window.location.reload()
    } else {
      loading.value = false
    }
  })
}

// 设置标题
// useTitle(t('app.title'))

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(appStore.theme)
  })
})
</script>
