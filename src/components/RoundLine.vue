<template>
  <div class="row" v-if="data" :class="{ readonly: prop.readonly, highlighted: !prop.readonly }">
    <div class="pegs">
      <template v-if="prop.readonly">
        <div
          v-for="(item, index) in data.guesses"
          :key="index"
          class="peg"
          :style="{ background: item ?? '' }"
        />
      </template>
      <template v-else>
        <div
          v-for="(item, index) in data.guesses"
          :key="index"
          class="peg"
          :style="{ background: item ?? '' }"
          @dragover.prevent
          @dragenter.prevent
          @drop="dropHandler(index, $event)"
        />
      </template>
    </div>
    <div class="feedback">
      <div
        class="feedback-peg"
        :class="[item]"
        v-for="(item, index) in data.results"
        :key="index"
      ></div>
    </div>
    <div class="slot">
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
.slot {
  margin-left: 2em;
}

.row {
  display: flex;
  align-items: center;
  padding-left: 3em;
  padding-top: 1em;
  padding-bottom: 1em;
  position: relative;
}

.row:not(:last-child) {
  border-top: 2px dotted gray;
}

.pegs {
  display: flex;
  gap: 10px;
}

.peg {
  width: 30px;
  height: 30px;
  background: #444;
  border-radius: 50%;
  border: 2px solid #888;
}

.feedback {
  display: grid;
  grid-template-columns: repeat(2, 12px);
  grid-template-rows: repeat(2, 12px);
  gap: 3px;
  margin-left: 20px;
}

.feedback-peg {
  width: 12px;
  height: 12px;
  background: #bbb;
  border-radius: 50%;
  border: 1px solid antiquewhite;
}

.feedback-peg.white {
  background: white;
}

.feedback-peg.black {
  background: black;
}

.feedback-peg.noMatch {
  background: unset;
}

.row.highlighted::before {
  content: '➤';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2em;
  color: #1d4ed8; /* Tailwind blue-700 z.B. */
  line-height: 1;
}
</style>
