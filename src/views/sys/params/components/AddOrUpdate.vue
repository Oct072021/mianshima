<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id ? $t('add') : $t('edit')"
    :close-on-click-modal="false"
    :width="600"
  >
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" @keyup.enter="submitHandle()">
      <el-form-item :label="$t('param.name')" prop="paramName">
        <el-input v-model="dataForm.paramName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('param.key')" prop="paramKey">
        <el-input v-model="dataForm.paramKey" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('param.value')" prop="paramValue">
        <el-input v-model="dataForm.paramValue" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('param.remark')" prop="remark">
        <el-input v-model="dataForm.remark" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('param.type')" prop="paramType">
        <el-radio-group v-model="dataForm.paramType">
          <el-radio v-for="key in Object.keys(enableMap)" :value="+key">{{ enableMap[+key] }}</el-radio>
        </el-radio-group>
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

import { getInfo, addParam, updateParam } from '../service'
import { SubmitDTO } from '../data'

import { useMap } from '@/hooks/useMap'

const { enableMap } = useMap()

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'refreshDataList'): void
}>()

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive<SubmitDTO>({
  id: 0,
  paramName: '',
  paramType: 0,
  paramKey: '',
  paramValue: '',
  remark: '',
})

const init = (row?: ListVO) => {
  visible.value = true
  dataForm.id = 0

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  if (row) {
    getInfo(row.paramKey).then((res) => {
      Object.assign(dataForm, res)
    })
  }
}

const dataRules = reactive<FormRules<ListVO>>({
  paramName: [{ required: true, message: t('required'), trigger: 'blur' }],
  paramType: [{ required: true, message: t('required'), trigger: 'blur' }],
  paramKey: [{ required: true, message: t('required'), trigger: 'blur' }],
  paramValue: [{ required: true, message: t('required'), trigger: 'blur' }],
})

// 表单提交
const submitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) return
    ;(!dataForm.id ? addParam(dataForm) : updateParam(dataForm)).then((res) => {
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
