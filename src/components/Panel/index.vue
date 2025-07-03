<template>
  <div class="flex gap panel">
    <div class="deco" />
    <span>{{ props.title }}</span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string
}>()
</script>

<style scoped lang="scss">
.panel {
  padding-bottom: 10px;
}
span {
  font-weight: 900;
  font-size: 18px;
}
.deco {
  width: 10px;
  border-radius: 5px;
  background-color: var(--el-color-primary);
}
</style>
