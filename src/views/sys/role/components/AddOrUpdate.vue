<template>
  <el-dialog v-model="visible" :title="!dataForm.roleGuid ? $t('add') : $t('edit')" :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" @keyup.enter="submitHandle()">
      <el-form-item prop="roleName" :label="$t('role.roleName')">
        <el-input v-model="dataForm.roleName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="remarks" :label="$t('role.remark')">
        <el-input v-model="dataForm.remarks" :placeholder="$t('placeholder')" />
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

import { getInfo, submit } from '../service'
import { ListVO } from '../data.d'

const emit = defineEmits<{
  (e: 'refreshDataList'): void
}>()

const { t } = useI18n()

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive<ListVO>({
  roleGuid: '',
  roleName: '',
  remarks: '',
  createTime: '',
})
const dataRules = reactive<FormRules<typeof dataForm>>({
  roleName: [{ required: true, message: t('required'), trigger: 'blur' }],
})

const init = async (name?: string) => {
  visible.value = true
  dataForm.roleGuid = ''

  // 重置表单数据
  dataFormRef.value?.resetFields()

  // id 存在则为修改
  if (name) getRole(name)
}

// 获取信息
const getRole = (name: string) => {
  getInfo(name).then((res) => {
    Object.assign(dataForm, res)
  })
}

// 表单提交
const submitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) return

    submit(dataForm).then(() => {
      visible.value = false
      emit('refreshDataList')
    })
  })
}

defineExpose({
  init,
})
</script>
