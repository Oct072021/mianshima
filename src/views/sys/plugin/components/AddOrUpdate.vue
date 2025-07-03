<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.pluginGuid.length ? $t('add') : $t('edit')"
    :close-on-click-modal="false"
    :width="600"
  >
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" @keyup.enter="submitHandle()">
      <el-form-item :label="$t('plugin.name')" prop="pluginName">
        <el-input v-model="dataForm.pluginName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('plugin.url')" prop="pluginUrl">
        <el-input v-model="dataForm.pluginUrl" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('plugin.remark')" prop="comments">
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

import { ListVO } from '../data.d'
import type { FormRules } from 'element-plus/es'

import { getInfo, addPlugin, updatePlugin } from '../service'
import { SubmitDTO } from '../data'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'refreshDataList'): void
}>()

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive<SubmitDTO>({
  pluginGuid: '',
  pluginName: '',
  pluginClassName: '',
  pluginUrl: '',
  comments: '',
})

const init = (row?: ListVO) => {
  visible.value = true
  dataForm.pluginGuid = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  if (row) {
    getInfo(row.pluginName).then((res) => {
      Object.assign(dataForm, res)
    })
  }
}

const dataRules = reactive<FormRules<ListVO>>({
  pluginName: [{ required: true, message: t('required'), trigger: 'blur' }],
  pluginUrl: [{ required: true, message: t('required'), trigger: 'blur' }],
})

// 表单提交
const submitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) return
    ;(!dataForm.pluginGuid.length ? addPlugin(dataForm) : updatePlugin(dataForm)).then((res) => {
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
