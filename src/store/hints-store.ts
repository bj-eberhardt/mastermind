import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Hints = 'showDragAndDropUsage';

export const useUiHintsStore = defineStore('uiHints', () => {
  const hintsShown = ref<Record<Hints, boolean>>(
    JSON.parse(localStorage.getItem('uiHints') || '{}')
  );

  const wasShown = (key: Hints) => !!hintsShown.value[key];

  const setShown = (key: Hints) => {
    hintsShown.value[key] = true;
    localStorage.setItem('uiHints', JSON.stringify(hintsShown.value));
    console.log('Save uiHints', JSON.stringify(hintsShown.value));
  };

  return {
    wasShown,
    setShown,
  };
});
