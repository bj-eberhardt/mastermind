<template>
  <footer class="py-4 text-center text-sm text-gray-500">Version: {{ version }}</footer>
</template>

<script setup lang="ts">
const version = __APP_VERSION__;
</script>
