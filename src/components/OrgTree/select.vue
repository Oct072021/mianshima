<template>
  <el-tree-select
    ref="treeRef"
    v-model="model"
    :data="dataList"
    value-key="buGuid"
    check-strictly
    :render-after-expand="false"
    :props="{
      label: 'buName',
      children: 'subBusinessUnitList',
    }"
    style="width: 100%"
    :clearable="props.clearable"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    @change="getInfo"
  />
</template>

<script lang="ts" setup name="OrgTree">
import { onMounted, ref } from 'vue'

import { getTree } from './service'

import { TreeVO } from './data.d'
import type { TreeInstance } from 'element-plus'

const props = withDefaults(
  defineProps<{
    clearable?: boolean
    disabled?: boolean
    placeholder?: string
  }>(),
  {
    clearable: false,
    disabled: false,
    placeholder: '',
  }
)
const emit = defineEmits<{
  (e: 'change', data: TreeVO): void
}>()

const model = defineModel<number | string>()

const dataList = ref<TreeVO[]>([])
const getDataList = async () => {
  const res = await getTree()
  dataList.value = res
}

const treeRef = ref<TreeInstance>()
const getInfo = (key: TreeVO['buGuid']) => {
  const node = treeRef.value?.getNode(key)
  emit('change', node?.data as TreeVO)
}

onMounted(() => {
  getDataList()
})
</script>

<style lang="scss" scoped></style>
