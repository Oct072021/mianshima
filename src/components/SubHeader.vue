<template>
  <div class="home-header">
    <el-icon v-if="showBack" class="icon" @click="goBack" size="30px"
      ><ArrowLeft
    /></el-icon>
    {{ title }}
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  showBack: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["go-back"]);

function goBack() {
  emit("go-back");
}
</script>

<style lang="scss" scoped>
.home-header {
  height: 50px;
  padding-left: 20px;
  background: #fff;
  border: 1px solid #dde3ee;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  :deep() {
    .el-icon {
      margin-right: 5px;
      cursor: pointer;
    }
  }
}
</style>
