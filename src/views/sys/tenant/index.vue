<template>
  <el-card class="layout-query">
    <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item prop="tenementName">
        <el-input v-model="state.queryForm.tenementName" :placeholder="$t('tenant.name')" />
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
        <el-button v-auth="'sys:tenant:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">
          {{ $t('add') }}
        </el-button>
      </el-space>
      <el-space>
        <el-button v-auth="'sys:tenant:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">
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
      <el-table-column prop="tenementName" :label="$t('tenant.name')" align="center" />
      <el-table-column prop="comments" :label="$t('tenant.remark')" align="center" />
      <el-table-column prop="createTime" :label="$t('tenant.createTime')" align="center" />
      <el-table-column :label="$t('handle')" fixed="right" align="center" width="200">
        <template #default="{ row }">
          <el-button v-auth="'sys:tenant:update'" type="primary" link @click="addOrUpdateHandle(row as ListVO)">
            {{ $t('edit') }}
          </el-button>
          <el-button
            v-auth="'sys:tenant:delete'"
            type="primary"
            link
            @click="deleteBatchHandle((row as ListVO).tenementGuid)"
          >
            {{ $t('delete') }}
          </el-button>
          <el-button v-auth="'sys:tenant:admin'" type="primary" link @click="handleAdmin(row as ListVO)">
            {{ $t('admin') }}
          </el-button>
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
    />

    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate ref="addOrUpdateRef" @refresh-data-list="getDataList" />
    <!-- 分配用户 -->
    <el-drawer
      v-if="adminVisible"
      v-model="adminVisible"
      :title="adminTitle"
      :size="1000"
      :close-on-press-escape="false"
    >
      <Admin :tenant-id="guid" />
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts" name="SysTenantIndex">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AddOrUpdate from './components/AddOrUpdate.vue'
import Admin from './components/Admin.vue'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { useCrud } from '@/hooks/useCrud'
import { SearchDTO, ListVO } from './data.d'

const { t } = useI18n()

const state: IHooksOptions<SearchDTO, ListVO> = reactive({
  dataListUrl: '/system-service/tenant/page',
  deleteUrl: '/system-service/tenant/delete',
  primaryKey: 'tenementGuid',
  queryForm: {
    tenementName: '',
  },
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: ListVO) => {
  addOrUpdateRef.value.init(row)
}

const adminVisible = ref(false)
const guid = ref()
const adminTitle = ref()
const handleAdmin = (row: ListVO) => {
  guid.value = row.tenementGuid
  adminTitle.value = `${t('tenant.distribute')} - ` + row.tenementName
  adminVisible.value = true
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud<
  SearchDTO,
  ListVO
>(state)
</script>

<style scoped></style>
