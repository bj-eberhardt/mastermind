<template>
  <div>
    {{ modelValue }}

    <div v-if="modelValue" class="mx-auto max-w-md space-y-6 rounded-xl bg-white p-6 shadow-lg">
      <h2 class="text-center text-2xl font-bold">Spiel Einstellungen</h2>

      <!-- Rundenanzahl -->
      <div>
        <label class="mb-1 block text-sm font-medium">Anzahl Runden (5–30):</label>
        <input
          type="number"
          v-model.number="modelValue.roundsCount"
          class="w-full rounded-md border p-2"
          :class="{ 'border-red-500': !validRounds }"
          min="5"
          max="30"
        />
        <p v-if="!validRounds" class="text-sm text-red-500">Wert muss zwischen 5 und 30 liegen.</p>
      </div>

      <!-- Spielfelder -->
      <div>
        <label class="mb-1 block text-sm font-medium">Anzahl Felder (3–5):</label>
        <input
          type="number"
          v-model.number="modelValue.fields"
          class="w-full rounded-md border p-2"
          :class="{ 'border-red-500': !validFields }"
          min="3"
          max="5"
        />
        <p v-if="!validFields" class="text-sm text-red-500">Wert muss zwischen 3 und 5 liegen.</p>
      </div>

      <!-- Farbduplikate erlauben -->
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          v-model="modelValue.allowColorDuplicate"
          id="colorDuplicate"
          class="form-checkbox"
        />
        <label for="colorDuplicate" class="text-sm">Doppelte Farben erlauben</label>
      </div>

      <!-- Farbanzahl -->
      <div>
        <label class="mb-1 block text-sm font-medium">
          Anzahl Farben ({{ minColorCount }}–8):
        </label>
        <input
          type="number"
          v-model.number="colorCount"
          :min="minColorCount"
          max="8"
          class="w-full rounded-md border p-2"
          :class="{ 'border-red-500': !validColorCount }"
        />
        <p v-if="!validColorCount" class="text-sm text-red-500">
          Farbenanzahl muss zwischen {{ minColorCount }} und 8 liegen.
        </p>
      </div>

      <!-- Vorschau der ausgewählten Farben -->
      <div class="mt-4 flex flex-wrap gap-2">
        <div
          v-for="(color, index) in modelValue.colors"
          :key="index"
          class="h-6 w-6 rounded-full border"
          :style="{ backgroundColor: color }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { GameOptions } from '../types/Game';

const model = defineModel<GameOptions>();

const predefinedColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown'];

const emit = defineEmits<(e: 'validation', isValid: boolean) => void>();

// 🧮 Farbanzahl getrennt verwalten
const colorCount = ref((model.value?.fields ?? 4) + 2);

// ➕ Mindestanzahl Farben (abhängig von Felderanzahl)
const minColorCount = computed(() => (model.value?.fields ?? 4) + 2);

onMounted(() => {
  if (!model.value) return;
});

// ✅ Validierung
const validRounds = computed(
  () => model.value && model.value.roundsCount >= 5 && model.value.roundsCount <= 30
);
const validFields = computed(
  () => model.value && model.value.fields >= 3 && model.value.fields <= 5
);
const validColorCount = computed(
  () => model.value && colorCount.value >= minColorCount.value && colorCount.value <= 8
);

const isFormValid = computed(() => {
  if (!model.value) {
    return false;
  }
  const validRounds = model.value.roundsCount >= 5 && model.value.roundsCount <= 30;
  const validFields = model.value.fields >= 3 && model.value.fields <= 5;
  const validColors = colorCount.value >= minColorCount.value && colorCount.value <= 8;
  console.debug(
    'isFormValid',
    'isValid',
    'rounds',
    validRounds,
    'fields',
    validFields,
    'colorCount',
    validColors
  );
  return validRounds && validFields && validColors;
});

watch(
  isFormValid,
  (val) => {
    console.debug('Form valid', val);
    emit('validation', val);
  },
  { immediate: true }
);

watch(colorCount, (newCount) => {
  if (validColorCount.value && model.value) {
    model.value.colors = predefinedColors.slice(0, newCount);
  }
});

if (model.value) {
  watch(
    () => model.value.fields,
    (newFields) => {
      const min = newFields + 2;
      if (colorCount.value < min) colorCount.value = min;
    }
  );
}
</script>

<style scoped></style>
