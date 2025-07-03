<template>
  <el-dialog v-model="visible" :title="!isUpdate ? $t('add') : $t('edit')" :close-on-click-modal="false" draggable>
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="!isUpdate ? dataRules : dataRules2"
      label-width="auto"
      @keyup.enter="submitHandle()"
      :validate-on-rule-change="false"
    >
      <el-form-item prop="userCode" :label="$t('userManage.userCode')">
        <el-input v-model="dataForm.userCode" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="userName" :label="$t('userManage.userName')">
        <el-input v-model="dataForm.userName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="jobNumber" :label="$t('userManage.jobNumber')">
        <el-input v-model="dataForm.jobNumber" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="gender" :label="$t('userManage.gender')">
        <el-radio-group v-model="dataForm.gender">
          <el-radio v-for="key in Object.keys(genderMap)" :value="+key">{{ genderMap[+key] }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="deptGuid" :label="$t('userManage.dept')">
        <OrgTreeSelect v-model="dataForm.deptGuid" :placeholder="$t('placeholder_select')" @change="changeOrg" />
      </el-form-item>
      <el-form-item prop="station" :label="$t('userManage.station')">
        <el-select v-model="dataForm.station" :placeholder="$t('placeholder_select')" value-key="stationGuid">
          <el-option v-for="item in stationList" :key="item.stationGuid" :label="item.stationName" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item prop="roles" :label="$t('userManage.roles')">
        <el-select v-model="dataForm.roles" :placeholder="$t('placeholder_select')" value-key="roleGuid" multiple>
          <el-option v-for="item in roleList" :key="item.roleGuid" :label="item.roleName" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item prop="isDisabled" :label="$t('userManage.isEnable')">
        <el-radio-group v-model="dataForm.isDisabled">
          <el-radio v-for="key in Object.keys(enableMap)" :value="+key">{{ enableMap[+key] }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="password" :label="$t('userManage.password')">
        <el-input v-model="dataForm.password" type="password" :placeholder="$t('placeholder')" show-password />
      </el-form-item>
      <el-form-item prop="email" :label="$t('userManage.email')">
        <el-input v-model="dataForm.email" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="mobile" :label="$t('userManage.mobile')">
        <el-input v-model="dataForm.mobile" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="isAdmin" :label="$t('userManage.isAdmin')">
        <el-radio-group v-model="dataForm.isAdmin">
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
import { useUserStore } from '@/store/modules/user'

import OrgTreeSelect from '@/components/OrgTree/select.vue'

import { ListVO, StationVO, FormData, RoleVO } from '../data.d'
import { TreeVO } from '@/components/OrgTree/data.d'
import type { FormInstance, FormRules } from 'element-plus/es'

import { getInfo, addUser, updateUser, getStation, getRole } from '../service'

import { useMap } from '@/hooks/useMap'
import { validatePassword } from '@/utils/validate'

const { enableMap, genderMap } = useMap()

const { t } = useI18n()

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref<FormInstance>()

const dataForm = reactive<FormData>({
  userGuid: '',
  userCode: '',
  userName: '',
  jobNumber: '',
  password: '',
  isDisabled: 1,
  deptGuid: '',
  deptName: '',
  buGuid: '',
  buName: '',
  email: '',
  mobile: '',
  gender: 0,
  station: null,
  roles: [],
  isAdmin: 0,
})

const isUpdate = ref(false)
const init = (row: ListVO) => {
  isUpdate.value = !!row
  visible.value = true
  dataForm.userGuid = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 更新表单数据
  if (row) {
    getInfo(row.userCode).then((res) => {
      getStationList(res.deptGuid)
      Object.assign(dataForm, res)
    })
  }
}

const rules = {
  userCode: [{ required: true, message: t('required'), trigger: 'blur' }],
  userName: [{ required: true, message: t('required'), trigger: 'blur' }],
  deptGuid: [{ required: true, message: t('required'), trigger: 'blur' }],
  mobile: [{ required: true, message: t('required'), trigger: 'blur' }],
  station: [{ required: true, message: t('required'), trigger: 'blur' }],
}
const dataRules = ref<FormRules<FormData>>({
  ...rules,
  password: [
    {
      required: true,
      validator: validatePassword(useUserStore().pwdComplex),
      trigger: 'blur',
    },
  ],
})
const dataRules2 = ref<FormRules<FormData>>({
  ...rules,
  password: [
    {
      required: true,
      message: t('required'),
      trigger: 'blur',
    },
  ],
})

const changeOrg = async (data: TreeVO) => {
  dataForm.deptName = data.buName
  dataForm.buName = data.namepath.split('>>')[0]
  dataForm.buGuid = data.companyGuid
  getStationList(data.buGuid)
}
// 当前组织的岗位
const stationList = ref<StationVO[]>([])
const getStationList = async (buGuid: string) => {
  const res = await getStation(buGuid)
  stationList.value = res
}
// 角色
const roleList = ref<RoleVO[]>([])
const getRoleList = async () => {
  const res = await getRole()
  roleList.value = res
}
getRoleList()

// 表单提交
const submitHandle = () => {
  dataFormRef.value!.validate((valid: boolean) => {
    if (!valid) return
    ;(!isUpdate.value ? addUser(dataForm) : updateUser(dataForm)).then((res) => {
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
