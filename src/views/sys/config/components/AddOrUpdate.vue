<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id.length ? $t('add') : $t('edit')"
    :close-on-click-modal="false"
    :width="600"
  >
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" @keyup.enter="submitHandle()">
      <el-form-item :label="$t('config.name')" prop="value">
        <el-input v-model="dataForm.value" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('config.value')" prop="valueNum">
        <el-input v-model="dataForm.valueNum" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('config.remark')" prop="memo">
        <el-input v-model="dataForm.memo" :placeholder="$t('placeholder')" />
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

import { ListVO } from '../data.d'
import type { FormRules } from 'element-plus/es'

import { addConfig, updateConfig } from '../service'
import { SubmitDTO } from '../data'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'refreshDataList'): void
}>()

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive<SubmitDTO>({
  id: '',
  value: '',
  valueNum: '',
  memo: '',
})

const init = (row?: ListVO) => {
  visible.value = true
  dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  if (row) {
    Object.assign(dataForm, row)
  }
}

const dataRules = reactive<FormRules<ListVO>>({
  value: [{ required: true, message: t('required'), trigger: 'blur' }],
  valueNum: [{ required: true, message: t('required'), trigger: 'blur' }],
})

// 表单提交
const submitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) return
    ;(!dataForm.id.length ? addConfig(dataForm) : updateConfig(dataForm)).then((res) => {
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
