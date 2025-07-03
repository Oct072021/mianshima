<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id.length ? $t('add') : $t('edit')"
    :width="600"
    :close-on-click-modal="false"
    draggable
  >
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" @keyup.enter="submitHandle()">
      <el-form-item prop="name" :label="$t('dict.label')">
        <el-input v-model="dataForm.name" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="value" :label="$t('dict.value')">
        <el-input v-model="dataForm.value" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="frontName" :label="$t('dict.frontName')">
        <el-input v-model="dataForm.frontName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="frontOption" :label="$t('dict.frontOption')">
        <el-input v-model="dataForm.frontOption" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="tableName" :label="$t('dict.tableName')">
        <el-input v-model="dataForm.tableName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="isSys" :label="$t('dict.isSys')">
        <el-radio-group v-model="dataForm.isSys">
          <el-radio v-for="key in Object.keys(enableMap)" :value="+key">{{ enableMap[+key] }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="inure" :label="$t('dict.inure')">
        <el-radio-group v-model="dataForm.inure">
          <el-radio v-for="key in Object.keys(enableMap)" :value="+key">{{ enableMap[+key] }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="isDef" :label="$t('dict.isDef')">
        <el-radio-group v-model="dataForm.isDef">
          <el-radio v-for="key in Object.keys(enableMap)" :value="+key">{{ enableMap[+key] }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="memo" :label="$t('dict.remarks')">
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
import type { FormInstance, FormRules } from 'element-plus/es'

import { DictListVO, SubmitDictDTO } from '../data.d'

import { addValue, getValueInfo, updateValue } from '../service'

import { useMap } from '@/hooks/useMap'

const { enableMap } = useMap()

const { t } = useI18n()

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref<FormInstance>()
const dataForm = reactive<SubmitDictDTO>({
  id: '',
  tcmId: '',
  name: '',
  valueNum: '',
  value: '',
  isDef: 1,
  memo: '',
  inure: 0,
  isSys: 0,
  frontName: '',
  frontOption: '',
  tableName: '',
})

const dataRules = reactive<FormRules<SubmitDictDTO>>({
  name: [{ required: true, message: t('required'), trigger: 'blur' }],
  value: [{ required: true, message: t('required'), trigger: 'blur' }],
  tableName: [{ required: true, message: t('required'), trigger: 'blur' }],
})

const init = (tcmId: string, row?: DictListVO) => {
  visible.value = true
  dataForm.tcmId = tcmId
  dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // id 存在则为修改
  if (row) {
    const { valueNum, tableName } = row
    getValueInfo({ tcmId, valueNum, tableName }).then((res) => {
      Object.assign(dataForm, res)
    })
  }
}

// 表单提交
const submitHandle = () => {
  dataFormRef.value!.validate((valid: boolean) => {
    if (!valid) return
    ;(!dataForm.id.length ? addValue(dataForm) : updateValue(dataForm)).then((res) => {
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
