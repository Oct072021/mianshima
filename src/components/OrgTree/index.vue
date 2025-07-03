<template>
  <el-card class="tree_left">
    <div style="margin: 10px 5px" class="flex gap">
      <el-input v-model="keyword" clearable :placeholder="$t('placeholder')" />
      <el-button v-if="props.isEdit" icon="Plus" type="primary" @click="handleAddOrUpdate()">{{ $t('add') }}</el-button>
    </div>
    <el-scrollbar :height="props.height">
      <el-tree
        ref="treeRef"
        :data="dataList"
        :expand-on-click-node="false"
        :default-expand-all="true"
        :filter-node-method="filterNode"
        :props="{
          label: 'buName',
          children: 'subBusinessUnitList',
        }"
        highlight-current
        node-key="buGuid"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <div class="flex between grow" style="padding-right: 5px">
            <span>{{ node.label }}</span>
            <div v-if="props.isEdit">
              <el-button icon="Edit" type="primary" link @click.stop="handleAddOrUpdate(data as OrgDTO)" />
              <el-button icon="Delete" type="danger" link @click.stop="handleRemove((data as OrgDTO).buGuid)" />
            </div>
          </div>
        </template>
      </el-tree>
    </el-scrollbar>
  </el-card>

  <el-dialog
    v-if="props.isEdit"
    v-model="visible"
    :title="!dataForm.buGuid.length ? $t('add') : $t('edit')"
    :close-on-click-modal="false"
    draggable
  >
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" @keyup.enter="submitHandle()">
      <el-form-item prop="buCode" :label="$t('org.code')">
        <el-input v-model="dataForm.buCode" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="buName" :label="$t('org.name')">
        <el-input v-model="dataForm.buName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="buType" :label="$t('org.type')">
        <el-select v-model="dataForm.buType" :placeholder="$t('placeholder_select')">
          <el-option v-for="item in orgTypeOpts" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="parentGuid" :label="$t('org.parent')">
        <OrgTreeSelect v-model="dataForm.parentGuid" @change="checkParentOrg" :placeholder="$t('placeholder_select')" />
      </el-form-item>
      <el-form-item prop="companyAddr" :label="$t('org.addr')">
        <el-input v-model="dataForm.companyAddr" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item prop="comments" :label="$t('org.remarks')">
        <el-input v-model="dataForm.comments" :placeholder="$t('placeholder')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="submitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="OrgTree">
import { onMounted, ref, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'

import OrgTreeSelect from './select.vue'

import { getTree, getInfo, updateOrg, addOrg, removeOrg } from './service'

import { OrgDTO, TreeVO } from './data.d'
import type { FormInstance, FormRules, TreeInstance } from 'element-plus'

import { useMap } from './hooks/useMap'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    isEdit?: boolean
    height?: string
  }>(),
  {
    isEdit: false,
    height:
      'calc(100vh - (var(--theme-main-padding) * 2) - var(--theme-tabs-height) - var(--theme-header-height) - 2px - 32px - 20px)',
  }
)
const emit = defineEmits<{
  (e: 'checkOrg', data: TreeVO['buGuid']): void
}>()

const { orgTypeOpts } = useMap()

const dataList = ref<TreeVO[]>([])
const getDataList = async () => {
  const res = await getTree()
  dataList.value = res
}

onMounted(() => {
  getDataList()
})

const treeRef = ref<TreeInstance>()
const keyword = ref()
watch(keyword, (val) => {
  treeRef.value!.filter(val)
})
const filterNode = (name: string, data: TreeVO) => {
  if (!name) return true
  return data.buName.includes(name)
}

// 处理点击事件
const handleNodeClick = (row: TreeVO) => {
  emit('checkOrg', row.buGuid)
}

const visible = ref(false)
const dataFormRef = ref<FormInstance>()

const dataForm = reactive<OrgDTO>({
  buGuid: '',
  buName: '',
  buCode: '',
  parentGuid: '',
  companyAddr: '',
  buType: 0,
  comments: '',
  companyGuid: '',
})

const dataRules = reactive<FormRules<OrgDTO>>({
  buCode: [{ required: true, message: t('required'), trigger: 'blur' }],
  buName: [{ required: true, message: t('required'), trigger: 'blur' }],
  buType: [{ required: true, message: t('required'), trigger: 'blur' }],
})

const handleAddOrUpdate = async (row?: OrgDTO) => {
  dataFormRef.value?.resetFields()
  dataForm.buGuid = ''
  visible.value = true

  if (row) {
    const res = await getInfo(row.buCode)
    Object.assign(dataForm, res)
  }
}

const submitHandle = async () => {
  dataFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return

    const res = dataForm.buGuid.length ? await updateOrg(dataForm) : await addOrg(dataForm)
    if (res) {
      getDataList()
      visible.value = false
    }
  })
}

const handleRemove = (buGuid: OrgDTO['buGuid']) => {
  ElMessageBox.confirm(t('tip.del'), t('tip.tip'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  }).then(async () => {
    const res = await removeOrg(buGuid)
    if (res) getDataList()
  })
}

const checkParentOrg = (data: TreeVO) => {
  dataForm.companyGuid = data.companyGuid
}
</script>

<style lang="scss" scoped>
.tree_left {
  padding: 0 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  :deep(.el-card__header) {
    padding: 15px 12px;
    font-weight: bold;
    font-size: 16px;
  }
  :deep(.el-card__body) {
    padding: 0;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
