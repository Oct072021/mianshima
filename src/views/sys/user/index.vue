<template>
  <el-row :gutter="0">
    <el-col :span="5">
      <OrgTree @checkOrg="checkOrg" />
    </el-col>
    <el-col :span="19">
      <el-card class="layout-query">
        <el-form ref="queryRef" :inline="true" :model="state.queryForm">
          <el-form-item prop="deptGuid" v-show="false">
            <el-input v-model="state.queryForm.deptGuid" />
          </el-form-item>
          <el-form-item prop="userName" :label="$t('userManage.userName')">
            <el-input v-model="state.queryForm.userName" :placeholder="$t('placeholder')" />
          </el-form-item>
          <el-form-item>
            <el-button icon="Search" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="RefreshRight" @click="reset(queryRef)">{{ $t('reset') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card>
        <el-space>
          <el-space>
            <el-button v-auth="'sys:user:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">
              {{ $t('add') }}
            </el-button>
          </el-space>
          <el-space>
            <el-button
              v-auth="'sys:user:export'"
              plain
              icon="Download"
              @click="downloadHandle('/system-service/user/export')"
            >
              {{ $t('export') }}
            </el-button>
          </el-space>
          <el-space>
            <el-button v-auth="'sys:user:delete'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">
              {{ $t('batchDel') }}
            </el-button>
          </el-space>
        </el-space>

        <el-table
          v-loading="state.dataListLoading"
          show-overflow-tooltip
          :data="state.dataList"
          border
          class="layout-table"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column type="selection" align="center" width="50" />
          <el-table-column type="index" :label="$t('index')" align="center" width="70" />
          <el-table-column prop="userCode" :label="$t('userManage.userCode')" align="center" />
          <el-table-column prop="userName" :label="$t('userManage.userName')" align="center" />
          <el-table-column prop="deptName" :label="$t('userManage.dept')" align="center" />
          <el-table-column prop="email" :label="$t('userManage.email')" align="center" />
          <el-table-column prop="mobile" :label="$t('userManage.mobile')" align="center" />
          <el-table-column prop="isDisabled" :label="$t('userManage.isEnable')" align="center">
            <template #default="{ row }">
              <el-tag :type="statusMap[(row as ListVO).isDisabled].type">
                {{ statusMap[(row as ListVO).isDisabled].label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('handle')" fixed="right" align="center" width="200">
            <template #default="{ row }">
              <el-button v-auth="'sys:user:update'" type="primary" link @click="addOrUpdateHandle(row as ListVO)">
                {{ $t('edit') }}
              </el-button>
              <el-button
                v-auth="'sys:user:delete'"
                type="primary"
                link
                @click="deleteBatchHandle((row as ListVO).userGuid)"
              >
                {{ $t('delete') }}
              </el-button>
              <el-dropdown v-auth="'sys:user:more'" @command="(command: string) => handleCommand(command, row)">
                <el-button type="primary" class="el-dropdown-link" link>{{ $t('more') }}</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="session"> {{ $t('userManage.session') }}</el-dropdown-item>
                    <el-dropdown-item command="password">{{ $t('user.changePwd') }}</el-dropdown-item>
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
      </el-card>
    </el-col>
  </el-row>

  <!-- 弹窗, 新增 / 修改 -->
  <AddOrUpdate ref="addOrUpdateRef" @refresh-data-list="getDataList" />
  <!-- 修改密码 -->
  <ChangePwd ref="changePwdRef" @refresh-data-list="getDataList" />
  <!-- 用户会话 -->
  <el-drawer
    v-if="sessionVisible"
    v-model="sessionVisible"
    :title="sessionTitle"
    :size="1000"
    :close-on-press-escape="false"
  >
    <Session :user="currentUser!" />
  </el-drawer>
</template>

<script setup lang="ts" name="SysUserIndex">
import { reactive, ref } from 'vue'

import { useCrud } from '@/hooks/useCrud'

import AddOrUpdate from './components/AddOrUpdate.vue'
import ChangePwd from './components/ChangePwd.vue'
import Session from './components/Session.vue'
import OrgTree from '@/components/OrgTree/index.vue'

import { IHooksOptions } from '@/hooks/useCrud/data.d'
import { ListVO, SearchDTO } from './data.d'

import { useMap } from './hooks/useMap'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { statusMap } = useMap()

const state: IHooksOptions<SearchDTO, ListVO> = reactive({
  dataListUrl: '/system-service/user/page',
  deleteUrl: '/system-service/user/delete',
  primaryKey: 'userGuid',
  queryForm: {
    userName: '',
    deptGuid: '',
  },
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: ListVO) => {
  addOrUpdateRef.value.init(row)
}

const changePwdRef = ref()

const sessionVisible = ref(false)
const currentUser = ref<ListVO>()
const sessionTitle = ref()
const handleCommand = (command: string, row: ListVO) => {
  if (command === 'password') {
    changePwdRef.value.init(row)
  } else if (command === 'session') {
    currentUser.value = row
    sessionTitle.value = `${t('userManage.session')} -` + row.userName
    sessionVisible.value = true
  }
}

const checkOrg = (deptGuid: string) => {
  state.queryForm.deptGuid = deptGuid
  getDataList()
}

const {
  getDataList,
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  deleteBatchHandle,
  downloadHandle,
  reset,
} = useCrud<SearchDTO, ListVO>(state)
</script>

<style lang="scss" scoped>
:deep().el-dropdown {
  height: 22px;
}
</style>
