<template>
  <div
    class="mt-[30px] flex justify-center gap-[15px] rounded-3xl border-2 border-green-600 bg-[rgba(227,231,244,0.5)] p-4"
  >
    <div
      v-for="(color, index) in colors"
      :key="index"
      :style="{ background: color }"
      draggable="true"
      @dragstart="dragStart($event, color)"
      class="h-7 w-7 cursor-pointer rounded-full border-2 border-gray-500"
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
