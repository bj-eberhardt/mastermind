import startSoundUrl from '/src/assets/sounds/intro.mp3';
import looseSoundUrl from '/src/assets/sounds/loose.mp3';
import winSoundUrl from '/src/assets/sounds/win.mp3';
import { watch } from 'vue';
import { useGameSettingsStore } from '../store/game-settings-store.js';

export function useSoundPlayer() {
  const { currentOptions } = useGameSettingsStore();

  const audios: Record<string, HTMLAudioElement> = {
    start: new Audio(startSoundUrl),
    win: new Audio(winSoundUrl),
    lose: new Audio(looseSoundUrl),
  };

  function stopAll() {
    Object.values(audios).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  watch(
    () => currentOptions.soundEnabled,
    (newVal) => {
      if (!newVal) {
        stopAll();
      }
    }
  );

  function play(soundKey: 'start' | 'win' | 'lose') {
    if (!currentOptions.soundEnabled) return;
    const audio = audios[soundKey];
    audio.pause();
    audio.currentTime = 0;
    audio.play().then();
  }

  return {
    playStart: () => play('start'),
    playWin: () => play('win'),
    playLose: () => play('lose'),
  };
}
