<template>
  <div
    v-if="data"
    :class="[
      'row relative flex flex-wrap items-center pt-4 pb-4 pl-8 sm:pl-12',
      prop.readonly ? '' : 'highlighted',
      !prop.readonly ? '' : 'readonly',
      'border-t border-dotted border-gray-400 last:border-none',
    ]"
  >
    <div class="flex gap-2.5">
      <template v-if="prop.readonly">
        <div
          v-for="(item, index) in data.guesses"
          :key="index"
          class="h-[30px] w-[30px] rounded-full border-2 border-[#888888] bg-[#444444]"
          :style="{ background: item ?? '#444' }"
          :data-color="item"
        />
      </template>
      <template v-else>
        <div
          v-for="(item, index) in data.guesses"
          :key="index"
          class="h-[30px] w-[30px] rounded-full border-2 border-[#888888] bg-[#444444]"
          :style="{ background: item ?? '#444' }"
          @dragover.prevent
          @dragenter.prevent
          @drop="dropHandler(index, $event)"
          @touchstart="showOverlay(index, $event)"
          @mousedown="showOverlay(index, $event)"
          :id="'field-' + index"
          :data-element-id="'field-' + index"
          :data-color="item"
        />
      </template>
    </div>
    <ColorTouch
      @colorSelected="$emit('update', colorChooserDialog.index, $event)"
      v-model="colorChooserDialog.visible"
      :colors="colors"
      :position="{ x: colorChooserDialog.x, y: colorChooserDialog.y }"
    ></ColorTouch>

    <div class="ml-5 grid grid-cols-2 grid-rows-2 gap-0.75">
      <div
        v-for="(item, index) in data.results"
        :key="index"
        :data-element-id="'result-' + index"
        :data-result="item"
        class="h-3 w-3 rounded-full border border-[#f7e7d2]"
        :class="{
          'bg-white': item === 'white',
          'bg-black': item === 'black',
          'bg-transparent': item === 'noMatch' || item === 'unset',
          'bg-gray-400': !['white', 'black', 'noMatch'].includes(item),
        }"
      ></div>
    </div>

    <div class="ml-1 w-full flex-1 text-center sm:ml-8 sm:w-auto">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GameRow } from '../types/GameRow';
import { nextTick, ref, unref } from 'vue';
import ColorTouch from './ColorTouch.vue';

const prop = defineProps<{
  readonly: boolean;
  data: GameRow;
  colors: string[];
}>();

const emit = defineEmits<{
  update: [index: number, value: string];
}>();

const colorChooserDialog = ref({
  visible: false,
  x: 0,
  y: 0,
  index: -1,
});

function dropHandler(index: number, ev: DragEvent) {
  ev.preventDefault();
  const data = unref(prop.data);
  if (!data) return;
  if (prop.readonly) {
    return;
  }
  const color = ev.dataTransfer?.getData('text');
  if (!color) return;
  emit('update', index, color);
}

async function showOverlay(index: number, e: Event) {
  // pass current position to the overlay
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  colorChooserDialog.value.x = centerX;
  colorChooserDialog.value.y = centerY;
  colorChooserDialog.value.index = index;
  await nextTick();

  colorChooserDialog.value.visible = true;
  console.log('Show overlay');
}
</script>
<style scoped>
.row:not(:last-child) {
  border-top: 2px dotted gray;
}

.row.highlighted::before {
  content: '➤';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2em;
  color: #1d4ed8;
  line-height: 1;
}
</style>
