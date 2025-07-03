<template>
  <el-dialog v-model="visible" :title="$t('role.roleAuth')" :close-on-click-modal="false" :width="600" draggable>
    <el-form ref="dataFormRef" :model="dataForm" label-width="auto" @keyup.enter="submitHandle()">
      <el-form-item prop="roleName" :label="$t('role.roleName')">
        <el-input v-model="dataForm.roleName" disabled />
      </el-form-item>
      <el-form-item prop="dataScope" :label="$t('role.roleAuth')">
        <el-tree
          v-loading="loading"
          ref="treeRef"
          :data="appStore.appList"
          :props="{
            children: 'subFunctionList',
            label: 'name',
          }"
          node-key="code"
          show-checkbox
        />
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
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/store/modules/app'

import { App } from '@/store/modules/app/data.d'
import { ListVO } from '../data'

import { getAuthList, saveAuth } from '../service'

const { t } = useI18n()

const appStore = useAppStore()

const visible = ref(false)
const treeRef = ref()
const dataFormRef = ref()

const dataForm = reactive({
  roleGuid: '',
  roleName: '',
})

const loading = ref(false)

const init = async ({ roleName, roleGuid }: ListVO) => {
  visible.value = true
  dataForm.roleGuid = roleGuid
  dataForm.roleName = roleName

  loading.value = true

  const res = await getAuthList(roleGuid)
  treeRef.value!.setCheckedKeys(res, false)
  loading.value = false
}

// 表单提交
const submitHandle = () => {
  loading.value = true
  const checked = treeRef.value.getCheckedNodes(false, true) as App[]

  saveAuth(checked, dataForm.roleGuid).then((res) => {
    loading.value = false
    if (res) {
      ElMessage({
        type: 'success',
        message: t('msg.saveSuccess'),
      })
      visible.value = false
    }
  })
}

defineExpose({
  init,
})
</script>
