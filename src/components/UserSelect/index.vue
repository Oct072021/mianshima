<template>
  <!-- 用户选择 -->
  <el-dialog v-model="visible" :title="$t('userManage.select')" width="80%">
    <el-row :gutter="10">
      <el-col :span="5">
        <OrgTree @checkOrg="checkOrg" height="50vh" />
      </el-col>
      <el-col :span="19">
        <el-form :inline="true" :model="state.queryForm">
          <el-form-item>
            <el-input v-model="state.queryForm.userName" :placeholder="$t('userManage.userName')" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="state.queryForm.mobile" :placeholder="$t('userManage.mobile')" />
          </el-form-item>
          <el-form-item>
            <el-button icon="Search" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="tableRef"
          v-loading="state.dataListLoading"
          :data="state.dataList"
          border
          height="50vh"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column type="selection" align="center" width="50" />
          <el-table-column prop="userName" :label="$t('userManage.userName')" align="center" />
          <el-table-column prop="mobile" :label="$t('userManage.mobile')" align="center" />
          <el-table-column prop="email" :label="$t('userManage.email')" align="center" />
        </el-table>
      </el-col>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">{{ t('cancel') }}</el-button>
        <el-button type="primary" @click="addMember">
          {{ t('confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TableInstance } from 'element-plus/es'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { useCrud } from '@/hooks/useCrud'

import OrgTree from '@/components/OrgTree/index.vue'

import { SearchDTO, ListVO } from './data.d'
// import { addMember } from '../service'

const { t } = useI18n()

// const props = defineProps<{}>()
const emit = defineEmits<{
  (e: 'add', data: ListVO[]): void
}>()

const visible = ref(false)

/** --------------------------------------------------------------------------------------------------------------------------------- **/
// 成员选择crud
const state: IHooksOptions<SearchDTO, ListVO> = reactive({
  dataListUrl: '/system-service/user/list',
  isPage: false,
  createdIsNeed: false,
  queryForm: {
    userName: '',
    mobile: '',
    deptGuid: '',
  },
})
const { getDataList, selectionChangeHandle } = useCrud<SearchDTO, ListVO>(state)
// 切换组织
const checkOrg = (data: string) => {
  state.queryForm.deptGuid = data
  getDataList()
}
// 添加角色下成员
const addMember = async () => {
  if (state.dataListSelections) {
    emit('add', state.dataListSelections)
  } else {
    visible.value = false
  }
}

const tableRef = ref<TableInstance>()
// 获取已选择的成员
// const getSelectedMember = () => {
//   tableRef.value!.clearSelection()
//   const filter = state.dataList!.filter((item) =>
//     state.dataList!.find((data) => data.userGuid === item.userGuid)
//   )
//   filter.forEach((row) => {
//     tableRef.value!.toggleRowSelection(row)
//   })
// }

const open = () => (visible.value = true)
const close = () => {
  visible.value = false
  tableRef.value?.clearSelection()
}
defineExpose({
  open,
  close,
})
</script>
