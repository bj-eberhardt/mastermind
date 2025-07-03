<template>
  <div class="relative flex flex-col">
    <div class="absolute top-2 right-2 flex cursor-pointer space-x-2">
      <sound-button></sound-button>
      <help-button></help-button>
    </div>

    <div class="flex self-center">
      <solution-panel
        :open="['won', 'loose'].includes(game.getGameState())"
        :solution="solution"
      ></solution-panel>
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
          :text="t('game.check')"
          :hidden="currentRoundNotFilled"
          v-if="index == game.getCurrentRound() && game.getGameState() == 'inProgress'"
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
import SolutionPanel from './SolutionPanel.vue';
import RoundLine from './RoundLine.vue';
import { useI18n } from 'vue-i18n';
import { useStatsStore } from '../store/games-stats-store.js';
import { useSoundPlayer } from '../composables/useSound.js';
import SoundButton from './SoundButton.vue';
import HelpButton from './HelpButton.vue';
const statsStore = useStatsStore();
statsStore.loadFromStorage();
const { playWin, playLose } = useSoundPlayer();
const { t } = useI18n();
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
      statsStore.recordWin(props.options, game.getCurrentRound() + 1);
      playWin();
      emit('won');
    } else if (newState === 'loose') {
      statsStore.recordLoss(props.options);
      playLose();
      emit('loose');
    }
  }
);
</script>
