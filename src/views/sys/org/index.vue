<template>
  <el-row :gutter="0">
    <el-col :span="5">
      <OrgTree @checkOrg="checkOrg" is-edit />
    </el-col>
    <el-col :span="19">
      <el-card class="layout-query">
        <el-form ref="queryRef" :inline="true" :model="state.queryForm">
          <el-form-item prop="stationName" :label="$t('station.name')">
            <el-input v-model="state.queryForm.stationName" :placeholder="$t('placeholder')" />
          </el-form-item>
          <el-form-item>
            <el-button icon="Search" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="RefreshRight" @click="reset(queryRef)">{{ $t('reset') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card body-class="flex column gap">
        <Panel title="岗位列表" />
        <el-space>
          <el-space>
            <el-button v-auth="'sys:org:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">
              {{ $t('add') }}
            </el-button>
          </el-space>
          <el-space>
            <el-button v-auth="'sys:org:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">
              {{ $t('batchDel') }}
            </el-button>
          </el-space>
        </el-space>

        <el-table
          v-loading="state.dataListLoading"
          show-overflow-tooltip
          :data="state.dataList"
          border
          class="layout-table grow"
          @selection-change="selectionChangeHandle"
          @row-click="getUserData"
          highlight-current-row
          height="calc((100vh - (var(--theme-main-padding) * 2) - var(--theme-tabs-height) - var(--theme-header-height) - 340px) / 2)"
        >
          <el-table-column type="selection" align="center" width="50" />
          <el-table-column prop="stationName" :label="$t('station.name')" align="center" />
          <el-table-column prop="stationCode" :label="$t('station.code')" align="center" />
          <el-table-column prop="memo" :label="$t('station.remarks')" align="center" />
          <el-table-column prop="createTime" :label="$t('station.createTime')" align="center" />
          <el-table-column :label="$t('handle')" fixed="right" align="center" width="200">
            <template #default="{ row }">
              <el-button v-auth="'sys:org:update'" type="primary" link @click.stop="addOrUpdateHandle(row as ListVO)">
                {{ $t('edit') }}
              </el-button>
              <el-button
                v-auth="'sys:org:delete'"
                type="primary"
                link
                @click.stop="deleteBatchHandle((row as ListVO).stationGuid)"
              >
                {{ $t('delete') }}
              </el-button>
              <el-dropdown v-auth="'sys:org:more'" @command="(command: string) => handleCommand(command, row)">
                <el-button type="primary" class="el-dropdown-link" link>{{ $t('more') }}</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="authScope">{{ $t('station.auth') }}</el-dropdown-item>
                    <el-dropdown-item command="user">{{ $t('station.distribute') }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
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
        <Panel title="成员列表" />
        <el-table
          v-loading="userState.dataListLoading"
          :data="userState.dataList"
          border
          style="width: 100%"
          class="grow"
          @selection-change="s"
          height="calc((100vh - (var(--theme-main-padding) * 2) - var(--theme-tabs-height) - var(--theme-header-height) - 340px) / 2)"
        >
          <el-table-column type="selection" align="center" width="50" />
          <el-table-column prop="userName" :label="$t('userManage.userName')" align="center" />
          <el-table-column prop="buName" :label="$t('userManage.dept')" align="center" />
          <el-table-column prop="defaultStationName" :label="$t('userManage.station')" align="center" />
          <!-- <el-table-column :label="$t('handle')" fixed="right" align="center" width="150">
      <template #default="{ row }">
        <el-button type="primary" link @click="removeMember2Role(row as UserListVO)">
          {{ t('delete') }}
        </el-button>
      </template>
    </el-table-column> -->
        </el-table>
        <el-pagination
          :current-page="userState.page"
          :page-sizes="userState.pageSizes"
          :page-size="userState.limit"
          :total="userState.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
        />
      </el-card>
    </el-col>
  </el-row>

  <!-- 弹窗, 新增 / 修改 -->
  <AddOrUpdate ref="addOrUpdateRef" @refresh-data-list="getDataList" />
  <!-- 数据权限 -->
  <AuthScope ref="dataScopeRef" />
  <!-- 分配用户 -->
  <el-drawer v-if="userVisible" v-model="userVisible" :title="userTitle" :size="1000" :close-on-press-escape="false">
    <User :station-id="stationId" />
  </el-drawer>
</template>

<script setup lang="ts" name="SysOrgIndex">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AddOrUpdate from './components/AddOrUpdate.vue'
import AuthScope from './components/AuthScope.vue'
import User from './components/User.vue'
import OrgTree from '@/components/OrgTree/index.vue'
import Panel from '@/components/Panel/index.vue'

import { useCrud } from '@/hooks/useCrud'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { ListVO, SearchDTO, SearchUserDTO, UserListVO } from './data.d'

const { t } = useI18n()

const state: IHooksOptions<SearchDTO, ListVO> = reactive({
  createdIsNeed: false,
  dataListUrl: '/system-service/station/list',
  deleteUrl: '/system-service/station/delete',
  primaryKey: 'stationGuid',
  isPage: false,
  queryForm: {
    buGuid: '',
    stationName: '',
  },
})
const { getDataList, selectionChangeHandle, deleteBatchHandle, reset } = useCrud<SearchDTO, ListVO>(state)

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: ListVO) => {
  addOrUpdateRef.value.init(row)
}

const checkOrg = (data: string) => {
  state.queryForm.buGuid = data
  getDataList()
}

const dataScopeRef = ref()
const userVisible = ref(false)
const stationId = ref()
const userTitle = ref()
const handleCommand = (command: string, row: ListVO) => {
  if (command === 'authScope') {
    dataScopeRef.value.init(row)
  } else if (command === 'user') {
    stationId.value = row.stationGuid
    userTitle.value = `${t('station.distribute')} - ` + row.stationName
    userVisible.value = true
  }
}

// 成员列表crud
const userState: IHooksOptions<Omit<SearchUserDTO, 'deptGuid'>, UserListVO> = reactive({
  dataListUrl: '/system-service/station/user/page',
  queryForm: {
    stationGuid: '',
    userName: '',
  },
})
const {
  getDataList: g,
  selectionChangeHandle: s,
  sizeChangeHandle,
  currentChangeHandle,
} = useCrud<Omit<SearchUserDTO, 'deptGuid'>, UserListVO>(userState)

const getUserData = (row: ListVO) => {
  userState.queryForm.stationGuid = row.stationGuid
  g()
}
</script>

<style lang="scss" scoped>
:deep().el-dropdown {
  height: 22px;
}
</style>
