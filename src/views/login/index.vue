<template>
  <div class="login-container">
    <div class="login-intro">
      <div class="title">
        <img class="login-logo" :src="info.loginLogo" alt="" />
        <h1>{{ info.loginTitle }}</h1>
      </div>
      <div class="desc">
        {{ $t('app.description') }}
      </div>
      <div class="login-bg"><img src="/login_bg.png" alt="" /></div>
    </div>
    <div class="login-form">
      <div class="login-title">
        <span class="account"> {{ $t('app.signIn') }} </span>
      </div>
      <Account />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import Account from './components/Account.vue'
import cache from '@/utils/cache'
import { Info } from './data.d'
import { getConfig } from './service'

// 登录跳转
const route = useRoute()
watch(
  () => route,
  (value) => {
    const redirect = route?.query?.redirect as string
    if (redirect && redirect !== '/') {
      cache.setRedirect(redirect)
    } else {
      cache.setRedirect('')
    }
  },
  { immediate: true }
)

const info = reactive<Info>({
  loginTitle: '',
  loginLogo: '',
})
const getConfigData = async () => {
  const res = await getConfig()
  Object.assign(info, res)
  // 设置标题
  useTitle(info.loginTitle)
  info.loginLogo = import.meta.env.VITE_APP_BASE + info.loginLogo
  cache.setConfigData(res)
}
getConfigData()
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100vh;
}
.login-intro {
  display: flex;
  flex-direction: column;
  width: 520px;
  flex: 0 1 auto;
  .title {
    display: flex;
    justify-content: center;
  }
  .login-logo {
    width: 50px;
    height: 40px;
  }
  h1 {
    color: var(--el-color-primary-light-9);
  }
  .desc {
    color: var(--el-color-primary-light-9);
    line-height: 32px;
    padding: 15px 0;
  }
}

.login-bg img {
  width: 520px;
}
.login-title {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  :deep(.el-button) {
    font-size: 20px;
    color: #333;
    padding-bottom: 8px;
  }
  .account {
    color: var(--el-color-primary);
    border-bottom: 4px solid var(--el-color-primary);
    font-size: 20px;
    font-weight: 900;
  }
}
.login-form {
  background-color: var(--el-color-primary-light-9);
  flex: 0 1 auto;
  padding: 40px;
  border-radius: 6px;
  box-shadow: 1px 1px 8px #aaa6a6;
  box-sizing: border-box;
  width: 440px;

  :deep(.el-input) {
    height: 45px;
    margin-top: 5px;
    .el-input__inner {
      padding: 10px 15px 10px 5px;
      height: 45px;
      line-height: 45px;
      color: #666;
      font-size: 16px;
    }
  }
}

@media only screen and (max-width: 992px) {
  .login-intro {
    display: none;
  }
}
@media only screen and (max-width: 768px) {
  .login-container {
    background: #fff;
  }
  .login-intro {
    display: none;
  }
  .login-form {
    flex: 0 1 auto;
    border-radius: 0;
    box-shadow: none;
  }
  .login-captcha {
    :deep(.el-input) {
      width: 150px;
    }
  }
}
</style>
