<template>
  <div class="overlay" v-if="modelValue" @click="model = false">
    <div class="dialog">
      <h2>{{ title }}</h2>
      <div v-if="slots.default">
        <slot />
      </div>
      <p v-else>{{ message }}</p>
      <div class="button-line mt-3">
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

// Block ESC key
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

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.button-line {
  display: flex;
  justify-content: end;
}
</style>
