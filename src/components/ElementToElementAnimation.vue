<template>
  <div
    v-show="showElement"
    ref="animationItem"
    id="drag-element"
    class="absolute z-[9999] transition-transform"
    :style="{ '--tw-duration': duration + 'ms' }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from 'vue';

const emit = defineEmits(['done']);

const props = withDefaults(
  defineProps<{
    fromId: string;
    toId: string;
    duration?: number;
    initialDelay?: number;
  }>(),
  { duration: 1000, initialDelay: 1000 }
);

const showElement = ref(false);
const animationItem = ref<HTMLElement>();

let checkInterval: number | undefined;
let initialDelayTimer: number | undefined;

const fromEl = ref<HTMLElement>();
const toEl = ref<HTMLElement>();

watch(
  () => props.fromId + props.toId,
  () => {
    tryFindElements();
  },
  { immediate: true }
);

function tryFindElements() {
  const fromId = props.fromId;
  const toId = props.toId;
  console.log('Start searching for elements ...', fromId, toId);
  checkInterval = window.setInterval(() => {
    if (fromId) {
      const el = document.getElementById(fromId);
      if (el) fromEl.value = el;
    }

    if (toId) {
      const el = document.getElementById(toId);
      if (el) toEl.value = el;
    }

    if (fromEl.value && toEl.value) {
      clearInterval(checkInterval);
      if (initialDelayTimer) {
        clearInterval(initialDelayTimer);
      }
      initialDelayTimer = setTimeout(() => startAnimation(), props.initialDelay);
    } else {
      console.log('Not found expected elements:', 'from', fromEl, 'to', toEl);
    }
  }, 200);
}

async function startAnimation() {
  if (!fromEl.value || !toEl.value || !animationItem.value) return;

  const startBox = fromEl.value.getBoundingClientRect();
  const endBox = toEl.value.getBoundingClientRect();

  // set element to start position
  const el = animationItem.value;
  el.style.left = startBox.left + 'px';
  el.style.top = startBox.top + 'px';
  console.log('Set position', el.style.left, el.style.top);
  await nextTick();
  showElement.value = true;

  setTimeout(() => {
    console.log('Update destination coordinates');
    const x = endBox.left - startBox.left;
    const y = endBox.top - startBox.top;
    el.style.transform = `translate(${x}px, ${y}px)`;

    setTimeout(() => {
      showElement.value = false;
      emit('done');
    }, props.duration);
  }, 100);
}

onBeforeUnmount(() => {
  clearInterval(checkInterval);
  clearInterval(initialDelayTimer);
});
</script>
