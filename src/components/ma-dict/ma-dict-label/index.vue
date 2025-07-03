<template>
  <span v-html="getDictLabelList(dictType, dictValue)"></span>
</template>

<script setup lang="ts" name="MaDictLabel">
import { useTools } from '../hooks/useTools'

const { getDictLabelList } = useTools()

defineProps({
  dictType: {
    type: String,
    required: true,
  },
  dictValue: {
    type: [String, Number],
    required: true,
  },
})
</script>
