<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.tcmId.length ? $t('add') : $t('edit')"
    :close-on-click-modal="false"
    draggable
  >
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto">
      <el-form-item prop="tcmNum" :label="$t('dict.code')">
        <el-input v-model="dataForm.tcmNum" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="tcmName" :label="$t('dict.name')">
        <el-input v-model="dataForm.tcmName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="isSys" :label="$t('dict.isSys')">
        <el-radio-group v-model="dataForm.isSys">
          <el-radio v-for="key in Object.keys(enableMap)" :value="+key">{{ enableMap[+key] }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('dict.remarks')">
        <el-input v-model="dataForm.remark" :placeholder="$t('placeholder')" />
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

import { ListVO, SubmitDTO } from '../data.d'

import { addDict, getDictInfo, updateDict } from '../service'

import { useMap } from '@/hooks/useMap'

const { enableMap } = useMap()

const { t } = useI18n()

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref<FormInstance>()
const dataForm = reactive<SubmitDTO>({
  tcmId: '',
  tcmNum: '',
  tcmName: '',
  isSys: 0,
  remark: '',
})

const dataRules = reactive<FormRules<SubmitDTO>>({
  tcmNum: [{ required: true, message: t('required'), trigger: 'blur' }],
  tcmName: [{ required: true, message: t('required'), trigger: 'blur' }],
})

const init = (row?: ListVO) => {
  visible.value = true
  dataForm.tcmId = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // id 存在则为修改
  if (row) {
    getDictInfo(row.tcmNum).then((res) => {
      const { tcmId, tcmName, tcmNum, isSys, remark } = res
      Object.assign(dataForm, { tcmId, tcmName, tcmNum, isSys, remark })
    })
  }
}

// 表单提交
const submitHandle = () => {
  dataFormRef.value!.validate((valid: boolean) => {
    if (!valid) return
    ;(!dataForm.tcmId.length ? addDict(dataForm) : updateDict(dataForm)).then((res) => {
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
