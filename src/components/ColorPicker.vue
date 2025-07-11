<template>
  <!-- just used to identify the position -->
  <div ref="sentinel" class="h-px"></div>
  <div
    ref="colorPickerRef"
    :class="
      isSticky
        ? 'fixed bottom-0 z-50 bg-[rgba(227,231,244,0.99)] p-4 shadow-lg transition-all duration-300 ease-in-out'
        : ''
    "
    class="xs:gap-[15px] flex justify-center gap-[4px] rounded-3xl border-2 border-green-600 bg-[rgba(227,231,244,0.5)] p-4 transition-all duration-300 ease-in-out"
  >
    <div
      v-for="(color, index) in colors"
      :key="index"
      :style="{ background: color }"
      draggable="true"
      @dragstart="dragStart($event, color)"
      :id="'color-picker-' + index"
      :data-element-id="'color-picker-' + index"
      :data-color-picker="color"
      class="h-7 w-7 cursor-pointer rounded-full border-2 border-gray-500"
    ></div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

defineProps<{
  colors: string[];
}>();

const sentinel = ref<HTMLElement | null>(null);
const isSticky = ref(false);

let observer: IntersectionObserver;

onMounted(() => {
  if (sentinel.value) {
    // check if color picker in viewport, otherwise make it sticky
    observer = new IntersectionObserver(
      ([entry]) => {
        console.log('is intersecting', entry.isIntersecting);
        isSticky.value = !entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel.value);
  }
});

onUnmounted(() => {
  observer?.disconnect();
});

function dragStart(ev: DragEvent, color: string) {
  if (ev.dataTransfer) {
    console.log('start dragging', ev);
    ev.dataTransfer.setData('text', color);
  }
}
</script>
