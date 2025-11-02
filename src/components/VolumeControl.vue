<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const volume = computed({
  get: () => props.modelValue,
  set: (value: number) => emit('update:modelValue', value),
})
</script>

<template>
  <section class="volume-control">
    <input
      type="range"
      v-model="volume"
      min="0"
      max="100"
      step="1"
      class="volume-slider"
      :style="`--volume-percentage: ${volume}%`"
      aria-label="Volume control"
    />
    <span class="volume-label">{{ volume }}%</span>
  </section>
</template>

<style scoped>
.volume-control {
  --control-max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  margin: var(--space-xl) auto;
  max-width: var(--control-max-width);
}

.volume-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: var(--border-width-thick);
  background: var(--color-surface);
  outline: none;
  position: relative;
  border: var(--border-width-thin) solid var(--color-secondary);
  transition: var(--transition-base);
}

.volume-slider:hover {
  border-color: var(--color-accent);
}

.volume-slider::-webkit-slider-thumb {
  --thumb-size: 20px;
  --thumb-size-hover: 24px;
  --thumb-size-active: 18px;
  -webkit-appearance: none;
  appearance: none;
  width: var(--thumb-size);
  height: var(--thumb-size);
  background: var(--color-primary);
  cursor: pointer;
  border: var(--border-width-base) solid var(--color-accent);
  box-shadow: var(--shadow-glow-primary);
  transition: var(--transition-base);
}

.volume-slider::-webkit-slider-thumb:hover {
  width: var(--thumb-size-hover);
  height: var(--thumb-size-hover);
  box-shadow: var(--shadow-glow-primary-lg);
}

.volume-slider::-webkit-slider-thumb:active {
  width: var(--thumb-size-active);
  height: var(--thumb-size-active);
  background: var(--color-accent);
}

.volume-slider::-moz-range-thumb {
  --thumb-size: 20px;
  --thumb-size-hover: 24px;
  --thumb-size-active: 18px;
  width: var(--thumb-size);
  height: var(--thumb-size);
  background: var(--color-primary);
  cursor: pointer;
  border: var(--border-width-base) solid var(--color-accent);
  box-shadow: var(--shadow-glow-primary);
  transition: var(--transition-base);
}

.volume-slider::-moz-range-thumb:hover {
  width: var(--thumb-size-hover);
  height: var(--thumb-size-hover);
  box-shadow: var(--shadow-glow-primary-lg);
}

.volume-slider::-moz-range-thumb:active {
  width: var(--thumb-size-active);
  height: var(--thumb-size-active);
  background: var(--color-accent);
}

.volume-slider::-webkit-slider-runnable-track {
  background: linear-gradient(
    to right,
    var(--color-primary) 0%,
    var(--color-primary) var(--volume-percentage),
    transparent var(--volume-percentage)
  );
}

.volume-label {
  --label-min-width: 3em;
  min-width: var(--label-min-width);
  text-align: left;
  color: var(--color-accent);
  font-size: var(--font-size-sm);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}
</style>
