<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.stationGuid.length ? $t('add') : $t('edit')"
    :close-on-click-modal="false"
    draggable
  >
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" @keyup.enter="submitHandle()">
      <el-form-item prop="stationName" :label="$t('station.name')">
        <el-input v-model="dataForm.stationName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="buGuid" :label="$t('org.name')">
        <OrgTreeSelect
          v-model="dataForm.buGuid"
          :placeholder="$t('placeholder_select')"
          @change="({ companyGuid }) => (dataForm.companyGuid = companyGuid)"
        />
      </el-form-item>
      <el-form-item prop="memo" :label="$t('station.remarks')">
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

import OrgTreeSelect from '@/components/OrgTree/select.vue'

import { ListVO, SubmitDTO } from '../data.d'
import type { FormInstance, FormRules } from 'element-plus/es'

import { getInfo, addStation, updateStation } from '../service'

const { t } = useI18n()

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref<FormInstance>()

const dataForm = reactive<SubmitDTO>({
  stationGuid: '',
  stationName: '',
  memo: '',
  buGuid: '',
  companyGuid: '',
})

const init = (row: ListVO) => {
  visible.value = true
  dataForm.stationGuid = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 更新表单数据
  if (row) {
    getInfo(row.stationCode).then((res) => {
      Object.assign(dataForm, res)
    })
  }
}

const dataRules = reactive<FormRules<SubmitDTO>>({
  stationName: [{ required: true, message: t('required'), trigger: 'blur' }],
  buGuid: [{ required: true, message: t('required'), trigger: 'blur' }],
})

// 表单提交
const submitHandle = () => {
  dataFormRef.value!.validate((valid: boolean) => {
    if (!valid) return
    ;(!dataForm.stationGuid.length ? addStation(dataForm) : updateStation(dataForm)).then((res) => {
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
