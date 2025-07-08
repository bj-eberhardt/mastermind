<template>
  <div class="group relative flex justify-center">
    <button
      class="mx-sm-3 relative mx-1 my-2 transform rounded-lg bg-[#8B5E3C] px-2 py-1 text-base font-bold text-white shadow-[0_4px_#5c3a21] transition-all duration-100 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_6px_#5c3a21] active:translate-y-[2px] active:shadow-[0_2px_#5c3a21] disabled:cursor-not-allowed disabled:opacity-50 sm:mx-2 sm:px-4 sm:py-2"
      :disabled="disabled"
      :style="{ visibility: hidden ? 'hidden' : 'visible' }"
      @click="$emit('click')"
    >
      <template v-if="slots.icon && type === 'icon'">
        <slot name="icon" />
      </template>
      <template v-else>
        <slot name="text">{{ text }}</slot>
      </template>
    </button>
    <div
      v-if="type === 'icon' && hint"
      class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-sm whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100"
    >
      {{ hint }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Slot } from 'vue';
withDefaults(
  defineProps<{
    hidden?: boolean;
    text: string;
    disabled?: boolean;
    type?: 'icon' | 'text';
    hint?: string;
  }>(),
  { disabled: false, hidden: false, type: 'text', hint: undefined }
);
defineEmits<(event: 'click') => void>();
const slots = defineSlots<{
  icon?: Slot;
  text?: Slot;
}>();
</script>
