<template>
  <div class="svg-icon" :style="{ color: color }">
    <svg aria-hidden="true">
      <use :xlink:href="symbolId" :fill="color" />
    </svg>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`);
    return { symbolId };
  },
});
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  line-height: 0;
  svg {
    width: 1.5em;
    height: 1.5em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
