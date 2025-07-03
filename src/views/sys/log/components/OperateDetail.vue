<template>
  <el-dialog v-model="visible" :title="$t('detail')" :close-on-click-modal="false" draggable top="10vh">
    <el-form label-width="auto">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('log.name')">
            <el-input v-model="dataForm.realName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('log.module')">
            <el-input v-model="dataForm.module" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('log.operateName')">
            <el-input v-model="dataForm.name" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('log.url')">
            <el-input v-model="dataForm.reqUri" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('log.method')">
            <el-input v-model="dataForm.reqMethod" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('log.ip')">
            <el-input v-model="dataForm.ip" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('log.addr')">
            <el-input v-model="dataForm.address" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('log.operateType')">
            <el-tag type="primary">
              {{ dataForm.operateTypeLabel }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('log.duration')">
            <el-input v-model="dataForm.duration" disabled>
              <template #append>ms</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('log.operateStatus')" prop="status">
            <el-tag :type="operateLogStatusMap[dataForm.status].type">
              {{ operateLogStatusMap[dataForm.status].label }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('log.createTime')" prop="createTime">
            <el-input v-model="dataForm.createTime" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('log.agent')">
        <el-input v-model="dataForm.userAgent" disabled />
      </el-form-item>
      <el-form-item :label="$t('log.reqParams')">
        <el-input v-model="dataForm.reqParams" :rows="4" type="textarea" disabled />
      </el-form-item>
      <el-form-item :label="$t('log.resultMsg')">
        <el-input v-model="dataForm.resultMsg" :rows="6" type="textarea" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="visible = false">{{ $t('close') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { OperateLogListVO } from '../data.d'
import { useMap } from '../hooks/useMap'

const { operateLogStatusMap } = useMap()

const visible = ref(false)
const dataForm = reactive<OperateLogListVO>({
  reqUri: '',
  address: '',
  reqMethod: '',
  reqParams: '',
  operateTypeLabel: '',
  ip: '',
  module: '',
  operateType: 0,
  userAgent: '',
  statusLabel: '',
  resultMsg: '',
  duration: 0,
  realName: '',
  createTime: '',
  name: '',
  status: 0,
})

const init = (data: OperateLogListVO) => {
  visible.value = true
  Object.assign(dataForm, data)
}

defineExpose({
  init,
})
</script>
