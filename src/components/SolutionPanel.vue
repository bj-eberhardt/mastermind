<template>
  <div
    class="relative mt-6 mb-[3rem] flex w-fit items-center justify-center"
    style="perspective: 1000px"
  >
    <div
      class="cover ease absolute top-0 left-0 z-20 flex h-full w-full items-center justify-center rounded-lg bg-[#333] text-white shadow-[0_8px_16px_rgba(0,0,0,0.6)] transition-transform duration-[1000ms]"
      :class="{ open }"
    >
      <div class="pointer-events-none text-center text-[0.9rem] font-bold">Geheimer Code</div>
    </div>
    <div class="flex gap-[10px] rounded-[8px] bg-[#eeeeee] p-2 shadow-inner">
      <div
        class="h-[30px] w-[30px] rounded-full border-2 border-[#555] transition-colors duration-300 ease-in-out"
        v-for="(item, index) in solution"
        :key="index"
        :style="{ backgroundColor: open ? item : '#444' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
  solution: string[];
}>();
</script>

<style scoped>
.cover {
  transform-origin: top;
  transform-style: preserve-3d;
}

.cover.open {
  transform: rotateX(-120deg);
}
</style>
