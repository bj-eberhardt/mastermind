<template>
  <div class="space-y-8">
    <div
      v-for="entry in statsStore.getAllStats()"
      :key="JSON.stringify(entry.settings)"
      class="rounded-xl bg-white p-4 shadow"
    >
      <h3 class="mb-2 text-lg font-bold">
        {{ getSettingsLabel(entry.settings) }}
      </h3>

      <div class="mb-4 flex gap-6">
        <div class="flex-1">
          <p class="text-sm text-gray-500">{{ t('stats.totalGames') }}</p>
          <p class="text-xl font-semibold">{{ entry.result.gamesPlayed }}</p>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-500">{{ t('stats.wins') }}</p>
          <p class="text-xl font-semibold text-green-600">{{ entry.result.wins }}</p>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-500">{{ t('stats.losses') }}</p>
          <p class="text-xl font-semibold text-red-600">{{ entry.result.losses }}</p>
        </div>
      </div>

      <div class="mb-6 h-3 w-full overflow-hidden rounded bg-gray-200">
        <div class="h-full bg-green-500" :style="{ width: getWinRate(entry.result) + '%' }"></div>
      </div>

      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-sm text-gray-500">{{ t('stats.avgMoves') }}</p>
          <p class="text-lg font-semibold">
            {{ getAverageMoves(entry.result) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ t('stats.bestMoves') }}</p>
          <p class="text-lg font-semibold">
            {{ entry.result.minMoves || '-' }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ t('stats.worstMoves') }}</p>
          <p class="text-lg font-semibold">
            {{ entry.result.maxMoves || '-' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { GameResult, useStatsStore } from '../store/games-stats-store.ts';
import { GameOptions } from '../types/Game.js';

const { t } = useI18n();
const statsStore = useStatsStore();
statsStore.loadFromStorage();

function getAverageMoves(result: GameResult): string {
  return result.wins > 0 ? (result.totalMoves / result.wins).toFixed(1) : '-';
}

function getWinRate(result: GameResult): string {
  return result.gamesPlayed > 0 ? ((result.wins / result.gamesPlayed) * 100).toFixed(1) : '0';
}

function getSettingsLabel(settings: GameOptions) {
  const { fields, roundsCount, colors, allowColorDuplicate } = settings;

  const fieldLabel = `${fields} ${t('stats.fields', fields)}`;
  const roundLabel = `${roundsCount} ${t('stats.rounds', roundsCount)}`;
  const colorLabel = `${colors.length} ${t('stats.colors', colors.length)}`;
  const duplicateText = t(
    allowColorDuplicate ? 'stats.duplicateAllowed' : 'stats.duplicateNotAllowed'
  );

  return t('stats.settingsTitle', {
    fieldLabel,
    roundLabel,
    colorLabel,
    duplicateText,
  });
}
</script>
