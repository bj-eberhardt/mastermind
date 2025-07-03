<template>
  <i-mdi-volume-high v-if="sound.enabled" @click="toggle" class="h-6 w-6 text-[#e2d7d7]" />
  <i-mdi-volume-off v-else @click="toggle" class="h-6 w-6 text-[#e2d7d7]" />
</template>

<script setup lang="ts">
import { useSoundStore } from '../store/sound.ts';

const sound = useSoundStore();
const toggle = () => sound.toggle();
</script>
