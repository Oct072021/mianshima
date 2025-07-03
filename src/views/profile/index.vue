<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-card class="profile-card">
        <template #header> {{ $t('profile.info') }} </template>
        <div class="avatar">
          <Thumb :height="'100px'" :width="'100px'" :hoverable="false">
            <div>Hello</div>
            {{ userStore.user.username }}
          </Thumb>
        </div>
        <ul>
          <li>
            <ma-icon icon="icon-user" />
            {{ $t('profile.username') }}
            <span>{{ userStore.user.username }}</span>
          </li>
          <li>
            <ma-icon icon="icon-idcard" />
            {{ $t('profile.name') }}
            <span>{{ userStore.user.realName }}</span>
          </li>
          <!-- <li>
            <ma-icon icon="icon-phone" /> 手机号码
            <span>{{ userStore.user.mobile }}</span>
          </li>
          <li>
            <ma-icon icon="icon-mail" /> 用户邮箱
            <span>{{ userStore.user.email || '/' }}</span>
          </li> -->
          <li>
            <ma-icon icon="icon-apartment" />
            {{ $t('profile.org') }}
            <span>{{ userStore.user.buName }}</span>
          </li>
          <li>
            <ma-icon icon="icon-tag" />
            {{ $t('profile.station') }}
            <span>{{ userStore.user.stationSet.join(',') }} </span>
          </li>
          <li>
            <ma-icon icon="icon-calendar-check" />
            {{ $t('profile.role') }}
            <span>{{ userStore.user.roleSet.join(',') }}</span>
          </li>
        </ul>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card>
        <template #header> {{ $t('profile.base') }} </template>
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('user.changePwd')" name="password">
            <Password />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts" name="ProfileIndex">
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'

import Password from './components/Password.vue'
import Thumb from '@/components/Thumb/index.vue'

const userStore = useUserStore()
const activeName = ref('password')
</script>

<style scoped lang="scss">
.profile-card {
  .avatar {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  ul {
    list-style: none;
    padding: 0;
    li {
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      &:last-child {
        border-bottom: none;
        padding-top: 12px;
      }
      span {
        float: right;
      }
    }
  }
}
</style>
