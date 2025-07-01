// src/stores/useStatsStore.ts
import { defineStore } from 'pinia';
import { GameOptions } from '../types/Game.ts';

export interface GameResult {
  wins: number;
  losses: number;
  totalMoves: number;
  minMoves: number;
  maxMoves: number;
  gamesPlayed: number;
}

interface GameStatEntry {
  settings: GameOptions;
  result: GameResult;
}

function isSameSettings(a: GameOptions, b: GameOptions): boolean {
  return (
    a.colors.length === b.colors.length &&
    a.roundsCount === b.roundsCount &&
    a.allowColorDuplicate == b.allowColorDuplicate &&
    a.fields == b.fields
  );
}

export const useStatsStore = defineStore('stats', {
  state: () => ({
    entries: [] as GameStatEntry[],
  }),
  actions: {
    loadFromStorage() {
      const raw = localStorage.getItem('mastermind_stats_v2');
      if (raw) {
        try {
          this.entries = JSON.parse(raw);
        } catch (e) {
          console.error('Fehler beim Laden der Statistikdaten:', e);
          this.entries = [];
        }
      }
    },
    saveToStorage() {
      console.debug('Storing stats', this.entries);
      localStorage.setItem('mastermind_stats_v2', JSON.stringify(this.entries));
    },
    getEntry(settings: GameOptions): GameStatEntry {
      let entry = this.entries.find((e) => isSameSettings(e.settings, settings));
      if (!entry) {
        entry = {
          settings,
          result: { wins: 0, losses: 0, totalMoves: 0, gamesPlayed: 0, maxMoves: -1, minMoves: -1 },
        };
        this.entries.push(entry);
      }
      return entry;
    },
    recordWin(settings: GameOptions, moves: number) {
      const entry = this.getEntry(settings);
      entry.result.wins += 1;
      entry.result.totalMoves += moves;
      entry.result.gamesPlayed += 1;
      if (entry.result.minMoves == -1 || entry.result.minMoves > moves) {
        entry.result.minMoves = moves;
      }
      if (entry.result.maxMoves == -1 || entry.result.maxMoves < moves) {
        entry.result.maxMoves = moves;
      }
      this.saveToStorage();
    },
    recordLoss(settings: GameOptions) {
      const entry = this.getEntry(settings);
      entry.result.losses += 1;
      entry.result.gamesPlayed += 1;
      this.saveToStorage();
    },
    getStats(settings: GameOptions): GameResult {
      return this.getEntry(settings).result;
    },
    getAllStats(): GameStatEntry[] {
      return this.entries;
    },
  },
});
