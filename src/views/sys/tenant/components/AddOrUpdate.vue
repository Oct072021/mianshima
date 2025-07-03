<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.tenementGuid.length ? $t('add') : $t('edit')"
    :close-on-click-modal="false"
    draggable
  >
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" @keyup.enter="submitHandle()">
      <el-form-item prop="tenementName" :label="$t('tenant.name')">
        <el-input v-model="dataForm.tenementName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="tenementFullName" :label="$t('tenant.fullName')">
        <el-input v-model="dataForm.tenementFullName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="comments" :label="$t('tenant.remark')">
        <el-input v-model="dataForm.comments" :placeholder="$t('placeholder')" />
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

import { getTenementInfo, submit } from '../service'
import { ListVO, SubmitDTO } from '../data.d'

const emit = defineEmits<{
  (e: 'refreshDataList'): void
}>()

const { t } = useI18n()

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive<SubmitDTO>({
  tenementGuid: '',
  tenementName: '',
  tenementFullName: '',
  comments: '',
  // logoAddress: '',
  // applicationLogo: '',
  // portalAddress: '',
})
const dataRules = reactive<FormRules<typeof dataForm>>({
  tenementName: [{ required: true, message: t('required'), trigger: 'blur' }],
  tenementFullName: [{ required: true, message: t('required'), trigger: 'blur' }],
})

const init = async (row?: ListVO) => {
  visible.value = true
  dataForm.tenementGuid = ''

  // 重置表单数据
  dataFormRef.value?.resetFields()

  // id 存在则为修改
  if (row) {
    getTenementInfo(row.tenementCode).then((res) => {
      Object.assign(dataForm, res)
    })
  }
}

// 表单提交
const submitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) return

    submit(dataForm).then((res) => {
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
