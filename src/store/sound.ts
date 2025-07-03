import { defineStore } from 'pinia';

export const useSoundStore = defineStore('sound', {
  state: () => ({
    enabled:
      localStorage.getItem('sound-enabled') === null
        ? true
        : localStorage.getItem('sound-enabled') === 'true',
  }),
  actions: {
    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('sound-enabled', String(this.enabled));
    },
    set(val: boolean) {
      this.enabled = val;
      localStorage.setItem('sound-enabled', String(val));
    },
  },
});
