<template>
  <el-dialog v-model="visible" :title="!update ? $t('add') : $t('edit')" :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" @keyup.enter="submitHandle()">
      <el-form-item prop="type" :label="$t('menu.type')">
        <el-radio-group v-model="dataForm.type">
          <el-radio
            v-for="key in Object.keys(typeMap).slice(0, -1)"
            :value="key"
            :disabled="!currentActive.includes(key)"
          >
            {{ typeMap[key].value }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="name" :label="$t('menu.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="applicationGuid" :label="$t('menu.app')">
        <el-select v-model="dataForm.applicationGuid" :placeholder="$t('placeholder_select')" @change="getMenuList">
          <el-option v-for="item in appStore.appList" :key="item.guid" :label="item.name" :value="item.guid" />
        </el-select>
      </el-form-item>
      <el-form-item prop="pid" :label="$t('menu.preMenu')">
        <el-tree-select
          v-model="dataForm.pid"
          :data="menuList"
          :no-data-text="$t('menu.tips2')"
          value-key="guid"
          node-key="guid"
          check-strictly
          :render-after-expand="false"
          :props="{ label: 'name', children: 'subFunctionList' }"
          style="width: 100%"
          clearable
        />
      </el-form-item>
      <el-form-item v-if="dataForm.type === '1'" prop="pluginGuid" :label="$t('menu.component')">
        <el-select v-model="dataForm.pluginGuid" :placeholder="$t('placeholder_select')">
          <el-option v-for="item in pluginOpt" :key="item.pluginGuid" :label="item.pluginName" :value="item.pluginGuid">
            {{ item.pluginName + ' ( 地址：' + item.pluginUrl + ' )' }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.type === '2'" prop="url" :label="$t('menu.url')">
        <el-input v-model="dataForm.url" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item v-if="dataForm.type === '3'" prop="authority" :label="$t('menu.auth')">
        <el-input v-model="dataForm.authority" :placeholder="$t('menu.tips')" />
      </el-form-item>
      <el-form-item v-if="dataForm.type !== '3'" prop="icon" :label="$t('menu.icon')" class="popover-list">
        <SelectIcon v-model="dataForm.icon" />
      </el-form-item>
      <el-form-item prop="comments" :label="$t('menu.remarks')">
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
import type { FormInstance, FormRules } from 'element-plus'
import { useAppStore } from '@/store/modules/app'

import SelectIcon from '@/components/ma-icon-select/index.vue'

import { App, PluginDTO, SubmitDTO } from '../data.d'

import { useMap } from '../hooks/useMap'

import { buttonAdd, funcAdd, buttonUpdate, funcUpdate, getPluginList } from '../service'

const { t } = useI18n()

const appStore = useAppStore()

const emit = defineEmits<{
  (e: 'refreshDataList', data: string): void
}>()

const { typeMap } = useMap()

const visible = ref(false)

const pluginOpt = ref<PluginDTO[]>([])
const getPluginOpt = async () => {
  const res = await getPluginList()
  pluginOpt.value = res
}
getPluginOpt()

const dataFormRef = ref<FormInstance>()
const dataForm = reactive<SubmitDTO>({
  guid: '',
  type: '0',
  name: '',
  pid: '',
  applicationGuid: '',
  pluginGuid: '',
  pluginName: '',
  url: '',
  authority: '',
  icon: '',
  comments: '',
})
const update = ref(false)
const currentActive = ref<string[]>([])

const init = (isUpdate: boolean, row: App) => {
  visible.value = true
  update.value = isUpdate

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 存在则为修改
  if (row) {
    if (row.applicationGuid) {
      getMenuList(row.applicationGuid!)

      const {
        guid,
        type,
        name,
        applicationGuid,
        functionGuid,
        authority,
        url,
        pluginGuid,
        pluginName,
        icon,
        comments,
        pid,
      } = row
      if (isUpdate) {
        Object.assign(dataForm, {
          guid,
          type: type + '',
          parentFunctionGuid: functionGuid,
          name,
          applicationGuid,
          url,
          pluginGuid,
          pluginName,
          icon,
          comments,
          pid,
          authority,
        })
      } else {
        if (row.type + '' === '0') currentActive.value = ['1', '2']
        if (row.type + '' === '1' || row.type + '' === '2') currentActive.value = ['3']

        Object.assign(dataForm, {
          applicationGuid,
          pid: guid,
          type: currentActive.value[0],
        })
      }
    } else {
      currentActive.value = ['0', '1', '2', '3']
      const { guid } = row
      Object.assign(dataForm, {
        applicationGuid: guid,
        pid: null,
        type: currentActive.value[0],
      })
    }
  } else {
    currentActive.value = ['0', '1', '2', '3']
    Object.assign(dataForm, {
      type: currentActive.value[0],
      guid: '',
      name: '',
      pid: '',
      applicationGuid: '',
      pluginGuid: '',
      pluginName: '',
      url: '',
      authority: '',
      icon: '',
      comments: '',
    })
  }
}

// 菜单列表
const menuList = ref<App['subFunctionList']>([])
const getMenuList = (guid: string) => {
  const res = appStore.appList.find((app) => app.guid === guid)
  menuList.value = res!.subFunctionList
}

const dataRules = reactive<FormRules<SubmitDTO>>({
  name: [{ required: true, message: t('required'), trigger: 'blur' }],
  applicationGuid: [{ required: true, message: t('required'), trigger: 'blur' }],
  url: [{ required: true, message: t('required'), trigger: 'blur' }],
})

// 表单提交
const submitHandle = () => {
  dataFormRef.value!.validate((valid: boolean) => {
    if (!valid) return

    if (update.value) {
      ;(dataForm.type === '3' ? buttonUpdate(dataForm) : funcUpdate(dataForm)).then((res) => {
        if (res) {
          visible.value = false
          emit('refreshDataList', dataForm.type)
        }
      })
    } else {
      ;(dataForm.type === '3' ? buttonAdd(dataForm) : funcAdd(dataForm)).then((res) => {
        if (res) {
          visible.value = false
          emit('refreshDataList', dataForm.type)
        }
      })
    }
  })
}

defineExpose({
  init,
})
</script>

<style lang="scss" scoped>
.mod__menu {
  :deep(.el-popover.el-popper) {
    overflow-x: hidden;
  }

  .popover-list {
    :deep(.el-input__inner) {
      cursor: pointer;
    }
    :deep(.el-input__suffix) {
      cursor: pointer;
    }
  }
}
</style>
