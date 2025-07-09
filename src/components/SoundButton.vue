<template>
  <i-mdi-volume-high
    v-if="currentOptions.soundEnabled"
    @click="toggle"
    class="h-6 w-6 text-[#e2d7d7]"
  />
  <i-mdi-volume-off v-else @click="toggle" class="h-6 w-6 text-[#e2d7d7]" />
</template>

<script setup lang="ts">
import { useGameSettingsStore } from '../store/game-settings-store.js';

const { currentOptions, updateSettings } = useGameSettingsStore();

const toggle = () => {
  updateSettings({ soundEnabled: !currentOptions.soundEnabled });
};
</script>
