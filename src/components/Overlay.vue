<template>
  <div class="fixed inset-0 z-[1000] flex h-full w-full items-center justify-center bg-black/50">
    <div class="min-w-[300px] rounded bg-white p-8 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
      <h2 class="text-center text-2xl font-bold">{{ title }}</h2>
      <p class="text-2l font-semibold">{{ message }}</p>
      <p><slot name="body" :setValid="setValid"></slot></p>
      <div class="mt-4 flex justify-end gap-4">
        <button
          class="rounded-full border border-gray-400 bg-white px-4 py-2 text-gray-700 transition duration-200 hover:border-gray-600 hover:text-black hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!isValid"
          @click="clickConfirm"
        >
          {{ confirm }}
        </button>
        <button v-if="showCancel" @click="clickCancel">{{ cancel }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
const emit = defineEmits(['confirm', 'cancel']);
withDefaults(
  defineProps<{
    message: string;
    title: string;
    confirm: string;
    cancel: string;
    showCancel?: boolean;
  }>(),
  { showCancel: true }
);
const isValid = ref<boolean>(false);

function setValid(valid: boolean) {
  isValid.value = valid;
}

function clickConfirm() {
  emit('confirm');
}
function clickCancel() {
  emit('cancel');
}

// Block ESC key
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
