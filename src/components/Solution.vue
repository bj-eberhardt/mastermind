<template>
  <div class="row mb-15" :class="{ open: open }">
    <div class="pegs" :class="{ hidden: !open }">
      <template v-if="open">
        <div
          class="peg"
          v-for="(item, index) in solution"
          :key="index"
          :style="{ background: item ?? '' }"
        ></div>
      </template>
      <template v-else>
        <div
          class="peg"
          v-for="(item, index) in solution"
          :key="'hidden-' + index"
          :style="{ visibility: 'hidden' }"
        >
          Hidden design
        </div>
      </template>
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
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-left: 3em;
  position: relative;
}

.pegs {
  display: flex;
  gap: 10px;
}

.pegs.hidden {
  background: chocolate;
}

.peg {
  width: 30px;
  height: 30px;
  background: #444;
  border-radius: 50%;
  border: 2px solid #888;
}
</style>
