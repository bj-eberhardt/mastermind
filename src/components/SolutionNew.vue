<template>
  <div class="row mt-6 mb-[3rem]" :class="{ open }">
    <div class="cover" :class="{ open }">
      <div class="lid-text">Geheimer Code</div>
    </div>
    <div class="pegs">
      <div
        class="peg"
        v-for="(item, index) in solution"
        :key="index"
        :style="{ backgroundColor: open ? item : '#444' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
  solution: string[];
}>();
</script>

<style scoped>
.row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  perspective: 1000px;
}

.pegs {
  display: flex;
  gap: 10px;
  padding: 0.5rem;
  background: #eee;
  border-radius: 8px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
}

.peg {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #555;
  transition: background-color 0.3s ease;
}

/* Abdeckung */
.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: top;
  transform-style: preserve-3d;
  background: #333;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  transition: transform 1s ease;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.cover.open {
  transform: rotateX(-120deg);
}

.lid-text {
  font-size: 0.9rem;
  font-weight: bold;
  pointer-events: none;
  text-align: center;
}
</style>
