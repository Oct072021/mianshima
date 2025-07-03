<!-- 首页 -->
<template>
  <div class="contain">
    <div class="header">
      <img />
      <p>广东顺控发展股份有限公司</p>
    </div>
    <div class="body">
      <el-scrollbar class="item-div">
        <div class="item-grid">
          <template v-for="(item, i) in (routerStore.originalRoutes as RouteRecordRaw[])">
            <div
              class="item-box"
              :style="{
                backgroundColor: colorList[i],
              }"
              @click="selectSystem(item)"
            >
              <ma-icon :icon="item.meta?.icon" class="item_icon" color="#fff" size="100px" />
              <div class="item-title">{{ item.meta?.title }}</div>
              <div class="item-explain">
                {{ item.meta?.desc }}
              </div>
            </div>
          </template>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouteRecordRaw, useRouter } from 'vue-router'
import { useRouterStore } from '@/store/modules/router'

const router = useRouter()

const routerStore = useRouterStore()

const selectSystem = (route: RouteRecordRaw) => {
  if ((route.meta?.url as string).length) {
    router.push(route.path)
  }

  routerStore.setMenuRoute(route)
}

const colorList = [
  'rgba(64, 158, 255, 0.8)',
  'rgba(11, 178, 212, 0.8)',
  'rgba(62, 142, 247, 0.8)',
  'rgba(23, 179, 163, 0.8)',
  'rgba(17, 194, 109, 0.8)',
  'rgba(51, 204, 204, 0.8)',
  'rgba(153, 102, 102, 0.8)',
  'rgba(153, 102, 204, 0.8)',
  'rgba(102, 153, 204, 0.8)',
  'rgba(204, 102, 51, 0.8)',
  'rgba(204, 102, 153, 0.8)',
  'rgba(204, 153, 102, 0.8)',
  'rgba(204, 153, 153, 0.8)',
]
</script>
<style lang="scss" scoped>
.contain {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px 10%;
  background: url('./images/BG.jpg') no-repeat;
  background-position: center;
  background-size: cover;
  .header {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    position: relative;
    padding-left: 50px;
    font-size: 26px;
    font-weight: bold;
    font-family: 'Microsoft YaHei';
    color: #fff;
  }
  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: 40px;
    .item-div {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      :deep().el-scrollbar__view {
        height: 100%;
      }
      .item-grid {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .item-box {
          width: calc(33% - 10px);
          min-width: 210px;
          height: 180px;
          flex-grow: 2;
          margin: 5px;
          position: relative;
          cursor: pointer;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          .item_icon {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          .item-title {
            font-size: 24px;
            position: absolute;
            left: 15px;
            bottom: 20px;
            color: #fff;
          }
          .item-explain {
            font-size: 14px;
            color: #fff;
            position: absolute;
            left: 15px;
            bottom: 5px;
          }
        }
      }
    }
  }
}
</style>
