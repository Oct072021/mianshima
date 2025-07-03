<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.userGuid.length ? $t('add') : $t('edit')"
    :close-on-click-modal="false"
    draggable
  >
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" @keyup.enter="submitHandle()">
      <el-form-item prop="userName" :label="$t('userManage.userName')">
        <el-input v-model="dataForm.userName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="userCode" :label="$t('userManage.userCode')">
        <el-input v-model="dataForm.userCode" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="jobNumber" :label="$t('userManage.jobNumber')">
        <el-input v-model="dataForm.jobNumber" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="password" :label="$t('userManage.password')">
        <el-input v-model="dataForm.password" show-password :placeholder="$t('placeholder')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="submitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormRules } from 'element-plus'

import { getAdminInfo, submitAdmin } from '../service'
import { AdminListVO, FormData } from '../data.d'

const props = defineProps<{
  tenantId: string
}>()
const emit = defineEmits<{
  (e: 'refreshDataList'): void
}>()

const { t } = useI18n()

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive<FormData>({
  userGuid: '',
  userCode: '',
  userName: '',
  jobNumber: '',
  password: '',
  // logoAddress: ''
  // applicationLogo: ''
  // portalAddress: ''
})
const dataRules = reactive<FormRules<typeof dataForm>>({
  userCode: [{ required: true, message: t('required'), trigger: 'blur' }],
  userName: [{ required: true, message: t('required'), trigger: 'blur' }],
  password: [{ required: true, message: t('required'), trigger: 'blur' }],
})

const init = async (row?: AdminListVO) => {
  visible.value = true
  dataForm.userGuid = ''

  // 重置表单数据
  dataFormRef.value?.resetFields()

  if (row) {
    getAdminInfo(row).then((res) => {
      Object.assign(dataForm, res)
    })
  }
}

// 表单提交
const submitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) return

    submitAdmin(dataForm, props.tenantId).then((res) => {
      if (res) {
        visible.value = false
        emit('refreshDataList')
      }
    })
  })
}

defineExpose({
  init,
})
</script>
