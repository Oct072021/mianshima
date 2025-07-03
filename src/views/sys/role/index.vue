<template>
  <el-card class="layout-query">
    <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item prop="roleName" :label="$t('role.roleName') + ': '">
        <el-input v-model="state.queryForm.roleName" :placeholder="$t('placeholder')" />
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" @click="getDataList()"> {{ $t('query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="RefreshRight" @click="reset(queryRef)"> {{ $t('reset') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card>
    <el-space>
      <el-space>
        <el-button v-auth="'sys:role:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">
          {{ $t('add') }}
        </el-button>
      </el-space>
      <el-space>
        <el-button v-auth="'sys:role:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">
          {{ $t('batchDel') }}
        </el-button>
      </el-space>
    </el-space>

    <el-table
      v-loading="state.dataListLoading"
      :data="state.dataList"
      border
      class="layout-table"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column prop="roleName" :label="$t('role.roleName')" align="center" />
      <el-table-column prop="remarks" :label="$t('role.remark')" align="center" />
      <el-table-column prop="createTime" :label="$t('createTime')" align="center" />
      <el-table-column :label="$t('handle')" fixed="right" align="center" width="200">
        <template #default="{ row }">
          <el-button
            v-auth="'sys:role:update'"
            type="primary"
            link
            @click="addOrUpdateHandle((row as ListVO).roleName)"
          >
            {{ $t('edit') }}
          </el-button>
          <el-button
            v-auth="'sys:role:delete'"
            type="primary"
            link
            @click="deleteBatchHandle((row as ListVO).roleGuid)"
          >
            {{ $t('delete') }}
          </el-button>
          <el-dropdown v-auth="'sys:role:more'" @command="(command: string) => handleCommand(command, row)">
            <el-button type="primary" class="el-dropdown-link" link>{{ $t('more') }}</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="authScope">{{ $t('role.roleAuth') }}</el-dropdown-item>
                <el-dropdown-item command="user">{{ $t('role.distribute') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="state.page"
      :page-sizes="state.pageSizes"
      :page-size="state.limit"
      :total="state.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    >
    </el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate ref="addOrUpdateRef" @refresh-data-list="getDataList" />
    <!-- 数据权限 -->
    <AuthScope ref="dataScopeRef" />
    <!-- 分配用户 -->
    <el-drawer v-if="userVisible" v-model="userVisible" :title="userTitle" :size="1000" :close-on-press-escape="false">
      <User :role-id="roleId" />
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts" name="SysRoleIndex">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AddOrUpdate from './components/AddOrUpdate.vue'
import AuthScope from './components/AuthScope.vue'
import User from './components/User.vue'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { useCrud } from '@/hooks/useCrud'
import { SearchDTO, ListVO } from './data.d'

const { t } = useI18n()

const state: IHooksOptions<SearchDTO, ListVO> = reactive({
  dataListUrl: '/system-service/role/page',
  deleteUrl: '/system-service/role/delete',
  primaryKey: 'roleGuid',
  queryForm: {
    roleName: '',
  },
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (name?: string) => {
  addOrUpdateRef.value.init(name)
}

const dataScopeRef = ref()
const userVisible = ref(false)
const roleId = ref()
const userTitle = ref()
const handleCommand = (command: string, row: ListVO) => {
  if (command === 'authScope') {
    dataScopeRef.value.init(row)
  } else if (command === 'user') {
    roleId.value = row.roleGuid
    userTitle.value = `${t('role.distribute')} - ` + row.roleName
    userVisible.value = true
  }
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud<
  SearchDTO,
  ListVO
>(state)
</script>

<style lang="scss" scoped>
:deep().el-dropdown {
  height: 22px;
}
</style>
