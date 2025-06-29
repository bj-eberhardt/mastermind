<template>
  <button
    class="check-button ma-2"
    :style="{ backgroundImage: `url(${woodTexture})`, visibility: hidden ? 'hidden' : 'visible' }"
    @click="$emit('click')"
  >
    Check
  </button>
</template>
<script lang="ts" setup>
import woodTexture from '../assets/wood-pattern.png?inline';
defineProps<{
  hidden: boolean;
}>();
defineEmits<(e: 'click') => void>();
</script>
<style lang="css" scoped>
.check-button {
  background: #8b5e3c; /* braun */
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  /* 3D Effekt */
  box-shadow: 0 4px #5c3a21;
  transform: translateY(0);
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;

  /* optionale Holzstruktur */
  /*background-image: url('src/assets/wood-pattern.png');*/
  background-size: cover;
  background-blend-mode: multiply;
}

.check-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px #5c3a21;
}

.check-button:active {
  transform: translateY(2px);
  box-shadow: 0 2px #5c3a21;
}
</style>
