<template>
  <el-form :inline="true" :model="state.queryForm">
    <el-form-item>
      <el-input v-model="state.queryForm.userName" :placeholder="$t('userManage.userName')" />
    </el-form-item>
    <el-form-item>
      <el-button icon="Search" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
    </el-form-item>
    <el-form-item>
      <el-button icon="Plus" type="primary" @click="userSelectRef.open()">{{ $t('add') }}</el-button>
    </el-form-item>
    <el-form-item>
      <el-button icon="Delete" plain type="danger" @click="removeMember2Role()">{{ $t('batchDel') }}</el-button>
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
    <el-table-column prop="buName" :label="$t('userManage.dept')" align="center" />
    <el-table-column prop="defaultStationName" :label="$t('userManage.station')" align="center" />
    <el-table-column :label="$t('handle')" fixed="right" align="center" width="150">
      <template #default="{ row }">
        <el-button type="primary" link @click="removeMember2Role(row as UserListVO)">
          {{ t('delete') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- <el-pagination
    :current-page="state.page"
    :page-sizes="state.pageSizes"
    :page-size="state.limit"
    :total="state.total"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="sizeChangeHandle"
    @current-change="currentChangeHandle"
  /> -->
  <!-- 用户选择 -->
  <UserSelect @add="addMember2Role" ref="userSelectRef" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus/es'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { SearchUserDTO, UserListVO } from '../data.d'

import { useCrud } from '@/hooks/useCrud'

import UserSelect from '@/components/UserSelect/index.vue'

import { removeMember, addMember } from '../service'

const { t } = useI18n()

const props = defineProps<{
  roleId: string
}>()

const state: IHooksOptions<Omit<SearchUserDTO, 'deptGuid'>, UserListVO> = reactive({
  dataListUrl: '/system-service/role/user/list',
  isPage: false,
  queryForm: {
    roleGuid: props.roleId,
    userName: '',
    mobile: '',
  },
})
const { getDataList, selectionChangeHandle, sortChangeHandle, deleteBatchHandle } = useCrud<
  Omit<SearchUserDTO, 'deptGuid'>,
  UserListVO
>(state)

// 移除角色下成员
const removeMember2Role = async (row?: UserListVO) => {
  if (!row && !state.dataListSelections) {
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
    const list = row ? [row] : state.dataListSelections!
    const res = await removeMember(list, props.roleId)
    if (res) getDataList()
  })
}

const userSelectRef = ref()

const addMember2Role = async (members: UserListVO[]) => {
  const res = await addMember(members, props.roleId)
  if (res) {
    userSelectRef.value.close()
    getDataList()
  }
}
</script>
