import { defineStore } from 'pinia';
import { computed, ref, toValue } from 'vue';

export interface GameOptions {
  roundsCount: number;
  fields: number;
  allowColorDuplicate: boolean;
  colors: string[];
  soundEnabled: boolean;
}

const STORAGE_KEY = 'settings';

export const useGameSettingsStore = defineStore('gameSettings', () => {
  const options = ref<GameOptions>({
    roundsCount: 5,
    fields: 4,
    allowColorDuplicate: false,
    colors: ['red', 'blue', 'green', 'yellow', 'purple', 'cyan'],
    soundEnabled: true,
  });

  const loadSettings = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as GameOptions;
      Object.assign(options.value, parsed);
      console.debug(`Loaded settings:`, parsed);
    } catch (err) {
      console.warn('Failed to parse game settings from localStorage:', err);
    }
  };

  loadSettings();

  const updateSettings = (newSettings: Partial<GameOptions>) => {
    Object.assign(options.value, newSettings);
    console.log('Update settings', JSON.stringify(options.value));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(options.value));
  };

  const currentOptions = computed<GameOptions>(() => toValue(options));

  return {
    currentOptions,
    updateSettings,
  };
});
