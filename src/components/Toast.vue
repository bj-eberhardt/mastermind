<template>
  <div
    class="fixed inset-0 z-[1005] flex h-full w-full items-center justify-center bg-black/50"
    v-if="modelValue"
    @click="model = false"
  >
    <div class="min-w-[300px] rounded-[8px] bg-white p-8 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
      <h2>{{ title }}</h2>
      <div v-if="slots.default">
        <slot />
      </div>
      <p v-else>{{ message }}</p>
      <div class="mt-3 flex justify-end">
        <button
          class="rounded-full border border-gray-400 bg-white px-4 py-2 text-gray-700 transition duration-200 hover:border-gray-600 hover:text-black hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          @click="model = false"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
const slots = defineSlots();
const model = defineModel<boolean>();
defineProps<{
  message: string;
  title: string;
}>();

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    model.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
