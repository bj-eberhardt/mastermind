<template>
  <i-mdi-help-circle class="h-6 w-6 text-[#e2d7d7]" @click="showOverlay = true" />
  <Overlay
    :title="t('help-overlay.title')"
    confirm="OK"
    :show-cancel="false"
    cancel=""
    v-if="showOverlay"
    @confirm="showOverlay = false"
  >
    <template #body>
      <section class="max-w-xl rounded-md bg-white p-4 text-gray-800 shadow-md">
        <h2 class="mb-3 text-xl font-semibold">{{ t('help-overlay.subtitle') }}</h2>
        <p class="mb-4">{{ t('help-overlay.paragraph1') }}</p>
        <p class="mb-4" v-html="t('help-overlay.paragraph2')"></p>
        <p v-html="t('help-overlay.paragraph3')"></p>
      </section>
    </template>
  </Overlay>
</template>
<script setup lang="ts">
import Overlay from './Overlay.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const showOverlay = ref(false);
</script>
