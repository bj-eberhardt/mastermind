<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import ElementToElementAnimation from './ElementToElementAnimation.vue';
import { useUiHintsStore } from '../store/hints-store.js';

const { wasShown, setShown } = useUiHintsStore();

const showDragAnimation = ref(!wasShown('showDragAndDropUsage'));
const showDragAnimationCount = ref(3);

const onDragAnimationEnd = async (): Promise<void> => {
  showDragAnimation.value = false;
  showDragAnimationCount.value -= 1;
  if (showDragAnimationCount.value < 0) {
    setShown('showDragAndDropUsage');
    return;
  }
  await nextTick();
  showDragAnimation.value = true;
};

const stopAndDisableDragAnimation = (): void => {
  showDragAnimation.value = false;
  setShown('showDragAndDropUsage');
};

onMounted(() => {
  document.addEventListener('dragend', stopAndDisableDragAnimation);
});

onBeforeUnmount(() => {
  document.removeEventListener('dragend', stopAndDisableDragAnimation);
});
</script>

<template>
  <ElementToElementAnimation
    v-if="showDragAnimation"
    @done="onDragAnimationEnd"
    from-id="color-picker-0"
    to-id="field-0"
    :duration="3000"
  >
    <i-mdi-cursor-pointer class="h-8 w-8 text-[#e2d7d7]"></i-mdi-cursor-pointer>
  </ElementToElementAnimation>
</template>

<style scoped></style>
