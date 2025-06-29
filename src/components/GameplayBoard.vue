<template>
  <div class="field flex flex-col">
    <div class="solution flex">
      <solution
        v-if="false"
        :open="['won', 'loose'].includes(game.getGameState())"
        :solution="solution"
      ></solution>
      <solution-new
        :open="['won', 'loose'].includes(game.getGameState())"
        :solution="solution"
      ></solution-new>
    </div>

    <div class="user-input rounds flex flex-col-reverse">
      <round-line
        v-for="(round, index) in board"
        :key="index"
        :data="round"
        :readonly="game.getCurrentRound() !== index || game.getGameState() != 'inProgress'"
        @update="(index, color) => (round.guesses[index] = color)"
      >
        <board-button
          text="Check"
          :hidden="currentRoundNotFilled"
          v-if="index == game.getCurrentRound()"
          @click="check"
        ></board-button>
      </round-line>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Game, GameOptions, GameState } from '../types/Game.js';
import { computed, reactive, ref, watch } from 'vue';
import { GameRow } from '../types/GameRow.js';
import { getArrayWith } from '../utils/sharedUtils.js';
import BoardButton from './BoardButton.vue';
import SolutionNew from './SolutionNew.vue';
import RoundLine from './RoundLine.vue';

const props = defineProps<{
  options: GameOptions;
}>();

const emit = defineEmits(['won', 'loose']);

const game = reactive(new Game(props.options));
const board = ref<GameRow[]>(
  Array.from({ length: props.options.roundsCount }, () => ({
    guesses: getArrayWith(props.options.fields, undefined),
    results: getArrayWith(props.options.fields, 'noMatch'),
  }))
);
const solution = ref<string[]>(getArrayWith(props.options.fields, ''));

game.startGame();

function check() {
  const currentRound = board.value[game.getCurrentRound()];
  currentRound.results = game.check(currentRound.guesses as string[]);
}

const currentRoundNotFilled = computed<boolean>(() => {
  const currentRound = board.value[game.getCurrentRound()];
  return currentRound.guesses.some((i) => i === undefined);
});

watch(
  () => game.getGameState(),
  (newState: GameState) => {
    switch (newState) {
      case 'won':
      case 'loose':
        solution.value = game.getSolution();
    }
  }
);

watch(
  () => game.getGameState(),
  (newState: GameState) => {
    if (newState === 'won') {
      emit('won');
    } else if (newState === 'loose') {
      emit('loose');
    }
  }
);
</script>
<style scoped>
.solution {
  align-self: center;
}
</style>
