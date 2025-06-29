<template>
  <button
    class="relative mx-3 my-2 transform rounded-lg bg-[#8B5E3C] px-4 py-2 text-base font-bold text-white shadow-[0_4px_#5c3a21] transition-all duration-100 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_6px_#5c3a21] active:translate-y-[2px] active:shadow-[0_2px_#5c3a21] disabled:cursor-not-allowed disabled:opacity-50"
    :disabled="disabled"
    :style="{ visibility: hidden ? 'hidden' : 'visible' }"
    @click="$emit('click')"
  >
    {{ text }}
  </button>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    hidden?: boolean;
    text: string;
    disabled?: boolean;
  }>(),
  { disabled: false, hidden: false }
);
defineEmits<(e: 'click') => void>();
</script>
