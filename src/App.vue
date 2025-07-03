<template>
  <GameBoard></GameBoard>
  <FooterLine></FooterLine>
</template>

<script setup lang="ts">
import GameBoard from './components/GameBoard.vue';
import FooterLine from './components/FooterLine.vue';
import { onMounted } from 'vue';
import { useSoundPlayer } from './composables/useSound.js';

const { playStart } = useSoundPlayer();

onMounted(() => {
  playStart();
});
</script>
