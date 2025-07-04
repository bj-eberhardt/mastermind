<template>
  <div
    v-if="data"
    :class="[
      'row relative flex items-center pt-4 pb-4 pl-12',
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
          :id="'field-' + index"
        />
      </template>
    </div>

    <div class="ml-5 grid grid-cols-2 grid-rows-2 gap-0.75">
      <div
        v-for="(item, index) in data.results"
        :key="index"
        class="h-3 w-3 rounded-full border border-[#f7e7d2]"
        :class="{
          'bg-white': item === 'white',
          'bg-black': item === 'black',
          'bg-transparent': item === 'noMatch',
          'bg-gray-400': !['white', 'black', 'noMatch'].includes(item),
        }"
      ></div>
    </div>

    <div class="ml-8">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GameRow } from '../types/GameRow';
import { unref } from 'vue';

const prop = defineProps<{
  readonly: boolean;
  data: GameRow;
}>();

const emit = defineEmits<{
  update: [index: number, value: string];
}>();

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
