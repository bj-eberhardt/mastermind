<template>
  <div v-if="position && position.x && position.y" class="color-chooser">
    <div
      :style="{ top: `${position.y}px`, left: `${position.x}px` }"
      class="pointer-events-none fixed z-50"
    >
      <!-- Color chooser overlay -->
      <div
        v-if="modelValue"
        class="absolute top-1/2 left-1/2 z-[9999] h-[120px] w-[120px] -translate-x-[60px] -translate-y-[60px]"
        @mouseleave="model = false"
      >
        <!-- hole so that the overlay can be look through to the board -->
        <div :style="holeStyle" class="pointer-events-none fixed"></div>

        <div class="absolute inset-0 rounded-full shadow-lg"></div>

        <!-- different colors -->
        <div
          v-for="(color, index) in colors"
          :id="'color-overlay-' + index"
          :key="index"
          :class="'bg-[' + color + ']'"
          :data-color="color"
          :style="{ backgroundColor: color, ...circlePosition(index) }"
          class="pointer-events-auto absolute h-[30px] w-[30px] cursor-pointer rounded-full transition-all duration-200 ease-in-out hover:scale-110 hover:border-4 active:scale-125"
          @click.stop="selectColor(color)"
          @touchend.stop="selectColor(color)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const emit = defineEmits<(event: 'colorSelected', color: string) => void>();

const props = defineProps<{
  colors: string[];
  position: { x: number; y: number };
}>();

const model = defineModel<boolean>();

const selectedColor = ref('transparent');
const showOverlay = ref(false);

let pressTimer: number | null = null;

const startPress = () => {
  cancelPress();
  pressTimer = window.setTimeout(() => {
    showOverlay.value = true;
  }, 500);
};

const cancelPress = () => {
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
};

const selectColor = (color: string) => {
  selectedColor.value = `var(--tw-${color})`;
  showOverlay.value = false;
  emit('colorSelected', color);
  model.value = false;
};

// Kreisanordnung um den weißen Kreis (Polar-Koordinaten)
const circlePosition = (index: number) => {
  const radius = 40; // px
  const angle = (2 * Math.PI * index) / props.colors.length;
  const x = 35 + 10 + radius * Math.cos(angle);
  const y = 35 + 10 + radius * Math.sin(angle);
  return {
    top: `${y}px`,
    left: `${x}px`,
  };
};

const radius = 60;
const holeRadius = 15;

const holeStyle = computed(() => {
  const size = radius * 2;
  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    WebkitMaskImage: `radial-gradient(circle ${holeRadius}px at center, transparent 0px, transparent ${holeRadius}px, black ${holeRadius + 1}px)`,
    maskImage: `radial-gradient(circle ${holeRadius}px at center, transparent 0px, transparent ${holeRadius}px, black ${holeRadius + 1}px)`,
    WebkitMaskComposite: 'destination-out',
    pointerEvents: 'auto',
    position: 'absolute',
    borderRadius: '50%',
  };
});

watch(model, (newVal) => {
  // make sure when the overlay is shown, we cannot move the background when touching and moving
  if (newVal) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
});

function isHTMLElement(el: Element): el is HTMLElement {
  return el instanceof HTMLElement;
}

function getTouchedColor(touch: Touch): string | null {
  const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
  const el = elements.find(isHTMLElement);
  if (el && el.dataset.color) {
    return el.dataset.color;
  }
  return null;
}

function handleTouchEnd(e: TouchEvent) {
  const touch = e.changedTouches[0];
  const color = getTouchedColor(touch);
  if (color) {
    selectColor(color);
  }
}

onMounted(() => {
  document.addEventListener('touchend', handleTouchEnd);
});

onBeforeUnmount(() => {
  document.removeEventListener('touchend', handleTouchEnd);
});
</script>
