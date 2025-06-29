<template>
  <div class="color-picker">
    <div
      :key="index"
      v-for="(color, index) in colors"
      :style="{ background: color }"
      draggable="true"
      @dragstart="dragStart($event, color)"
      class="color"
    ></div>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  colors: string[];
}>();

function dragStart(ev: DragEvent, color: string) {
  if (ev.dataTransfer) {
    console.log('start dragging', ev);
    ev.dataTransfer.setData('text', color);
  }
}
</script>
<style scoped lang="scss">
.color-picker {
  padding: 1em;
  border-radius: 2em;
  border: solid 2px green;
  /*background: rgba(coral, 0.5);*/
  background: rgba(227, 231, 244, 0.5);
}

.color {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #888;
  cursor: pointer;
}
</style>
