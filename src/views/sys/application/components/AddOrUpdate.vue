<template>
  <el-dialog v-model="visible" :title="!update ? $t('add') : $t('edit')" :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="dataForm" :rules="formRules" label-width="auto" @keyup.enter="submitHandle()">
      <el-form-item prop="applicationName" :label="$t('application.name')">
        <el-input v-model="dataForm.applicationName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="applicationFullName" :label="$t('application.fullName')">
        <el-input v-model="dataForm.applicationFullName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="applicationUrl" :label="$t('application.url')">
        <el-input v-model="dataForm.applicationUrl" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="applicationIcon" :label="$t('application.icon')">
        <SelectIcon v-model="dataForm.applicationIcon" />
      </el-form-item>
      <el-form-item prop="comments" :label="$t('application.remarks')">
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

import SelectIcon from '@/components/ma-icon-select/index.vue'

import { addApp, appInfo, updateApp } from '../service'

import { AppDTO } from '../data.d'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'refreshDataList'): void
}>()

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive<AppDTO>({
  applicationGuid: '',
  applicationCode: '',
  applicationName: '',
  applicationIcon: '',
  applicationFullName: '',
  comments: '',
  applicationUrl: '',
})

const update = ref(false)

const init = async (code: string) => {
  visible.value = true
  update.value = !!code

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 存在则为修改
  if (code) {
    const res = await appInfo(code)

    Object.assign(dataForm, res)
  }
}

const formRules = reactive<FormRules<AppDTO>>({
  applicationName: [{ required: true, message: t('required'), trigger: 'blur' }],
  applicationFullName: [{ required: true, message: t('required'), trigger: 'blur' }],
})

// 表单提交
const submitHandle = () => {
  dataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    const res = update.value ? await updateApp(dataForm) : await addApp(dataForm)
    if (res) {
      visible.value = false
      emit('refreshDataList')
    }
  })
}

defineExpose({
  init,
})
</script>

<style lang="scss" scoped></style>
