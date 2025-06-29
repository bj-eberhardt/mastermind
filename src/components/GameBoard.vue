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

const showOptionsDialog = ref(false);
const showWinDialog = ref(true);
const showLooseDialog = ref(false);

const options = reactive<GameOptions>({
  roundsCount: 3,
  fields: 4,
  allowColorDuplicate: false,
  colors: ['red', 'blue', 'green', 'yellow', 'purple', 'cyan'],
});
const inGame = ref(true);

const loadGameSettings = (): void => {
  const settings = localStorage.getItem('settings');
  if (!settings) {
    return;
  }
  const parsed = JSON.parse(settings) as GameOptions;
  Object.assign(options, parsed);
  console.debug(`Loaded settings: ${settings}`);
  console.debug('options', options);
};

const saveSettings = (): void => {
  const settings = JSON.stringify(options);
  console.debug(`Save settings: ${settings}`);
  localStorage.setItem('settings', settings);
};

const newGame = async (): Promise<void> => {
  inGame.value = false;
  await nextTick();
  inGame.value = true;
};

const showDialog = async (type: 'win' | 'loose'): Promise<void> => {
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
  loadGameSettings();
  newGame();
});
</script>

<template>
  <div class="mastermind-board" :style="{ backgroundImage: `url(${woodTexture})` }">
    <Overlay
      title="Settings"
      confirm="OK"
      :show-cancel="false"
      cancel="Cancel"
      v-if="showOptionsDialog"
      :message="'Sind Sie sicher, dass Sie fortfahren möchten?'"
      @confirm="
        showOptionsDialog = false;
        saveSettings();
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
    <toast title="Gewonnen" :message="'Sie haben gewonnen'" v-model="showWinDialog"></toast>
    <toast title="Verloren" :message="'Sie haben verloren'" v-model="showLooseDialog"></toast>

    <gameplay-board
      v-if="inGame"
      :options="options"
      @won="showDialog('win')"
      @loose="showDialog('loose')"
    ></gameplay-board>

    <div class="color-picker mt-15">
      <color-picker :colors="options.colors"></color-picker>
    </div>

    <div class="menu mt-15">
      <board-button text="New game" @click="newGame"></board-button>
      <board-button text="Options" @click="showOptionsDialog = true"></board-button>
    </div>
  </div>
</template>

<style scoped>
button:active {
  transform: scale(0.95);
}
</style>

<style scoped>
.mastermind-board {
  width: 475px;
  background: saddlebrown;
  border: 5px solid #000;
  padding: 20px;
  margin: 0 auto;
  border-radius: 15px;
}

.color-picker {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
}
</style>
