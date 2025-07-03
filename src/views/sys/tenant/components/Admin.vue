<template>
  <el-form :inline="true" :model="state.queryForm">
    <el-form-item>
      <el-button icon="Plus" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
    </el-form-item>
    <el-form-item>
      <el-button icon="Delete" plain type="danger" @click="handleRemove()">{{ $t('batchDel') }}</el-button>
    </el-form-item>
  </el-form>
  <el-table
    v-loading="state.dataListLoading"
    :data="state.dataList"
    border
    style="width: 100%"
    @selection-change="selectionChangeHandle"
    @sort-change="sortChangeHandle"
  >
    <el-table-column type="selection" align="center" width="50" />
    <el-table-column prop="userName" :label="$t('userManage.userName')" align="center" />
    <el-table-column prop="userCode" :label="$t('userManage.userCode')" align="center" />
    <el-table-column :label="$t('handle')" fixed="right" align="center" width="150">
      <template #default="{ row }">
        <el-button type="primary" link @click="addOrUpdateHandle(row as AdminListVO)">
          {{ t('edit') }}
        </el-button>
        <el-button type="primary" link @click="handleRemove(row as AdminListVO)">
          {{ t('delete') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 添加\编辑 管理员 -->
  <AddOrUpdate ref="addOrUpdateRef" :tenant-id="props.tenantId" @refresh-data-list="getDataList" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus/es'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { useCrud } from '@/hooks/useCrud'

import AddOrUpdate from './AdminAddOrUpdate.vue'

import { SearchAdminDTO, AdminListVO } from '../data.d'
import { removeAdmin } from '../service'

const { t } = useI18n()

const props = defineProps<{
  tenantId: string
}>()

const state: IHooksOptions<SearchAdminDTO, AdminListVO> = reactive({
  dataListUrl: '/system-service/tenant/user/list',
  primaryKey: 'userGuid',
  isPage: false,
  queryForm: {
    tenementGuid: props.tenantId,
  },
})
const { getDataList, selectionChangeHandle, sortChangeHandle } = useCrud<SearchAdminDTO, AdminListVO>(state)

// 移除角色下成员
const handleRemove = (row?: AdminListVO) => {
  if (!row && !state.dataListSelectionKeys!.length) {
    ElMessage({
      type: 'warning',
      message: t('msg.batchDel'),
    })
    return
  }

  ElMessageBox.confirm(t('tip.del'), t('tip.tip'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  }).then(async () => {
    const list = row ? [row.userGuid] : state.dataListSelectionKeys!
    const res = await removeAdmin(props.tenantId, list)
    if (res) getDataList()
  })
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: AdminListVO) => {
  addOrUpdateRef.value.init(row)
}
</script>
