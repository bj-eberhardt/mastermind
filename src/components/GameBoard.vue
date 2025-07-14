<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import ColorPicker from './ColorPicker.vue';
import type { GameOptions } from '../types/Game';
import { sleep } from '../utils/sharedUtils.js';
import woodTexture from '../assets/wood-pattern.png?inline';
import Overlay from './Overlay.vue';
import BoardButton from './BoardButton.vue';
import GameplayBoard from './GameplayBoard.vue';
import GameOptionsPanel from './GameOptionsPanel.vue';
import Toast from './Toast.vue';
import { useI18n } from 'vue-i18n';
import StatsDisplay from './StatsDisplay.vue';
import { useStatsStore } from '../store/games-stats-store.js';
import IntroFirstUsage from './IntroFirstUsage.vue';
import { useGameSettingsStore } from '../store/game-settings-store.js';

const { t } = useI18n();
const statsStore = useStatsStore();
statsStore.loadFromStorage();

const { currentOptions, updateSettings } = useGameSettingsStore();

const showOptionsDialog = ref(false);
const showWinDialog = ref(false);
const showLooseDialog = ref(false);
const showStatsDialog = ref(false);

// default options
const options = reactive<GameOptions>(currentOptions);

const loaded = ref(false);
// needed for repainting if new game was started
const inGame = ref(true);

// start new game by forcing a repaint of component
const newGame = async (): Promise<void> => {
  inGame.value = false;
  await nextTick();
  inGame.value = true;
};

// showing end game dialog
const showEndGameDialog = async (type: 'win' | 'loose'): Promise<void> => {
  await sleep(1000);
  switch (type) {
    case 'win':
      showWinDialog.value = true;
      break;
    case 'loose':
      showLooseDialog.value = true;
      break;
  }
};

onMounted(() => {
  newGame();
  loaded.value = true;
});
</script>

<template>
  <transition name="slide-down">
    <div
      v-if="loaded"
      data-element-id="main-screen"
      class="mx-auto w-full max-w-[470px] overflow-x-hidden rounded-[15px] border-[5px] border-black bg-[saddlebrown] p-2 sm:p-5"
      :style="{ backgroundImage: `url(${woodTexture})` }"
    >
      <Overlay
        :title="t('settings-overlay.title')"
        confirm="OK"
        :show-cancel="false"
        cancel="Cancel"
        v-if="showOptionsDialog"
        :message="t('settings-overlay.subtitle')"
        :useCustomConfirmValidation="true"
        @confirm="
          showOptionsDialog = false;
          updateSettings(options);
          newGame();
        "
        @cancel="showOptionsDialog = false"
      >
        <template #body="{ setValid }">
          <GameOptionsPanel
            v-if="options && showOptionsDialog"
            @validation="setValid"
            v-model="options"
          ></GameOptionsPanel>
        </template>
      </Overlay>
      <Overlay
        :title="t('stats-overlay.title')"
        confirm="OK"
        :show-cancel="false"
        cancel=""
        v-if="showStatsDialog"
        :message="t('stats-overlay.subtitle')"
        :useCustomConfirmValidation="false"
        @confirm="showStatsDialog = false"
        @cancel="showStatsDialog = false"
      >
        <template #body>
          <StatsDisplay v-if="showStatsDialog"></StatsDisplay>
        </template>
      </Overlay>
      <toast
        :title="t('toast.win.title')"
        :message="t('toast.win.message')"
        v-model="showWinDialog"
      ></toast>
      <toast
        :title="t('toast.loose.title')"
        :message="t('toast.loose.message')"
        v-model="showLooseDialog"
      ></toast>

      <gameplay-board
        v-if="inGame"
        :options="options"
        @won="showEndGameDialog('win')"
        @loose="showEndGameDialog('loose')"
      ></gameplay-board>

      <div class="mt-[30px] flex justify-center">
        <color-picker :colors="options.colors"></color-picker>
      </div>

      <div class="menu mt-15 flex grid auto-cols-fr grid-flow-col justify-center">
        <board-button :text="t('mainMenu.newGame')" @click="newGame"></board-button>
        <board-button
          data-element-id="options.dialog"
          :text="t('mainMenu.options')"
          @click="showOptionsDialog = true"
        ></board-button>
        <board-button :text="t('mainMenu.stats')" @click="showStatsDialog = true"></board-button>
      </div>
      <intro-first-usage></intro-first-usage>
    </div>
  </transition>
</template>

<style scoped>
button:active {
  transform: scale(0.95);
}
</style>

<style scoped>
.slide-down-enter-active {
  animation: slideDown 1s ease-out;
}
@keyframes slideDown {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
