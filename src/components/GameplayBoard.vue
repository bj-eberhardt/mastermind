<template>
  <div class="relative flex flex-col">
    <div class="absolute top-2 right-2 flex cursor-pointer space-x-2">
      <sound-button></sound-button>
      <help-button></help-button>
    </div>

    <div class="flex self-center">
      <solution-panel
        data-element-id="solution"
        :open="['won', 'loose'].includes(game.getGameState())"
        :solution="solution"
      ></solution-panel>
    </div>

    <div class="user-input rounds flex flex-col-reverse">
      <round-line
        v-for="(round, index) in board"
        :data-element-id="'round-' + index"
        :key="index"
        :data="round"
        :readonly="game.getCurrentRound() !== index || game.getGameState() != 'inProgress'"
        @update="(index, color) => (round.guesses[index] = color)"
        :colors="game.colors"
      >
        <board-button
          data-element-id="check-button"
          :type="width < 375 ? 'icon' : 'text'"
          :hint="t('game.check')"
          :text="t('game.check')"
          :hidden="currentRoundNotFilled"
          v-if="index == game.getCurrentRound() && game.getGameState() == 'inProgress'"
          @click="check"
        >
          <template #icon>
            <i-mdi-check-circle class="h-6 w-6 text-2xl text-[#e2d7d7]" />
          </template>
        </board-button>
      </round-line>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Game, GameOptions, GameState } from '../types/Game.js';
import { computed, nextTick, reactive, ref, watch } from 'vue';
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
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize();
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
    results: getArrayWith(props.options.fields, 'unset'),
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
  async (newState: GameState) => {
    switch (newState) {
      case 'won':
      case 'loose':
        scrollToSolution();
        await nextTick();
        solution.value = game.getSolution();
    }
  }
);

function scrollToSolution() {
  const el = document.querySelector('[data-element-id="solution"]');
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

  if (!isVisible) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

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
