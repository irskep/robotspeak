<script setup lang="ts">
import { useSoundStore } from '@/stores/soundStore'
import { makeBeepBoopsUsingFancyGrammarAlgorithm } from './grammars/subphrasesGrammar'
import type { SoundToken } from './types/sound'
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'

// Get sound store instance
const soundStore = useSoundStore()
const canvas = ref<HTMLCanvasElement>()
const lastSequenceAsString = ref('')
const volume = ref(15) // Default volume at 15%

// Update volume in sound store when slider changes
watch(volume, (newVolume) => {
  soundStore.setVolume(newVolume)
})

// Mouse tracking for eye movement
const rawMouseX = ref(0)
const rawMouseY = ref(0)
const mouseX = ref(0.5) // Normalized 0-1
const mouseY = ref(0.5) // Normalized 0-1
let animationFrameId: number | null = null

const handleMouseMove = (e: MouseEvent) => {
  // Store raw mouse position
  rawMouseX.value = e.clientX
  rawMouseY.value = e.clientY
}

// Smooth animation loop for 60fps updates
const updateEyePosition = () => {
  // Normalize and update smooth position
  mouseX.value = rawMouseX.value / window.innerWidth
  mouseY.value = rawMouseY.value / window.innerHeight

  animationFrameId = requestAnimationFrame(updateEyePosition)
}

// Calculate pupil offsets using simple linear interpolation
const leftPupilTransform = computed(() => {
  // Map mouse position to pupil movement range (-6 to 6 pixels for subtler movement)
  const xOffset = (mouseX.value - 0.5) * 12 // -6 to 6
  const yOffset = (mouseY.value - 0.5) * 12 // -6 to 6
  return `translate(${xOffset}, ${yOffset})`
})

const rightPupilTransform = computed(() => {
  // Same mapping for right eye
  const xOffset = (mouseX.value - 0.5) * 12
  const yOffset = (mouseY.value - 0.5) * 12
  return `translate(${xOffset}, ${yOffset})`
})

onMounted(() => {
  canvas.value!.width = 300
  canvas.value!.height = 113 // Reduced from 150 to make canvas shorter
  soundStore.initialize(canvas.value!)

  // Set initial volume after initialization
  soundStore.setVolume(volume.value)

  // Add mouse listener and start animation loop
  window.addEventListener('mousemove', handleMouseMove)
  updateEyePosition() // Start the animation loop
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})

const playBeepBoops = async () => {
  soundStore.waviz?.visualizer?.simpleLine()
  soundStore.waviz?.input.initializePending()
  const seq = makeBeepBoopsUsingFancyGrammarAlgorithm()
  lastSequenceAsString.value = seq.map((w) => `${w.soundToken}${w.identifier}`).join(' ')
  soundStore.playSequence(seq)
}

const playToken = async (s: SoundToken) => {
  try {
    await soundStore.playSoundToken(s)
    console.log(`Played ${s}`)
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}
</script>

<template>
  <main class="console">
    <header class="interface-header">
      <h1>Talk to TRN5-F0RMR</h1>
    </header>

    <section class="primary-display">
      <div class="Robot">
        <svg viewBox="-100 -10 200 210">
          <!-- Define clip path for angular body -->
          <defs>
            <clipPath id="body-clip">
              <path d="M -85 55 L 95 55 L 95 185 L 85 195 L -85 195 L -95 185 L -95 65 Z" />
            </clipPath>
          </defs>

          <!-- Antenna with base socket -->
          <g class="robot-antenna">
            <!-- Antenna base/socket -->
            <rect
              x="-10"
              y="40"
              width="20"
              height="15"
              fill="var(--robot-detail)"
              stroke="var(--robot-antenna)"
              stroke-width="2"
            />
            <!-- Single continuous line from socket to tip -->
            <path
              d="M 0 40 L 0 20 Q 15 10 30 5"
              stroke="var(--robot-antenna)"
              stroke-width="3"
              fill="none"
            />
            <!-- Antenna tip -->
            <circle cx="30" cy="5" r="6" fill="var(--robot-antenna)" />
          </g>

          <!-- Body using path for angular corners -->
          <path
            d="M -85 55 L 95 55 L 95 185 L 85 195 L -85 195 L -95 185 L -95 65 Z"
            fill="var(--robot-body)"
            stroke="var(--robot-body-stroke)"
            stroke-width="3"
          />

          <!-- Top panel line -->
          <line x1="-95" y1="75" x2="95" y2="75" stroke="var(--robot-detail)" stroke-width="1" />

          <!-- Eyes Group -->
          <g class="robot-eyes">
            <!-- Left eye outer -->
            <circle
              cx="-45"
              cy="95"
              r="22"
              fill="var(--robot-eye)"
              stroke="var(--robot-eye-stroke)"
              stroke-width="3"
            />
            <!-- Left eye pupil -->
            <rect
              x="-52"
              y="88"
              width="14"
              height="14"
              fill="var(--robot-eye-stroke)"
              :transform="leftPupilTransform"
            />

            <!-- Right eye outer -->
            <circle
              cx="45"
              cy="95"
              r="22"
              fill="var(--robot-eye)"
              stroke="var(--robot-eye-stroke)"
              stroke-width="3"
            />
            <!-- Right eye pupil -->
            <rect
              x="38"
              y="88"
              width="14"
              height="14"
              fill="var(--robot-eye-stroke)"
              :transform="rightPupilTransform"
            />
          </g>

          <!-- Tech details -->
          <g class="robot-details">
            <!-- Side vents -->
            <rect x="-90" y="85" width="8" height="3" fill="var(--robot-detail)" />
            <rect x="-90" y="92" width="8" height="3" fill="var(--robot-detail)" />
            <rect x="-90" y="99" width="8" height="3" fill="var(--robot-detail)" />

            <rect x="82" y="85" width="8" height="3" fill="var(--robot-detail)" />
            <rect x="82" y="92" width="8" height="3" fill="var(--robot-detail)" />
            <rect x="82" y="99" width="8" height="3" fill="var(--robot-detail)" />

            <!-- Bottom bolts -->
            <circle cx="-75" cy="185" r="3" fill="var(--robot-detail)" />
            <circle cx="75" cy="185" r="3" fill="var(--robot-detail)" />
          </g>
        </svg>
        <div class="Robot__Mouth">
          <canvas ref="canvas"></canvas>
        </div>
      </div>
    </section>

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

    <section class="control-panel">
      <button class="primary" @click="playBeepBoops">Make with the beep boops</button>
    </section>

    <section class="readout">
      <pre>{{ lastSequenceAsString || '&nbsp;' }}</pre>
    </section>

    <aside class="diagnostics">
      <button class="debug" @click="playToken('S')">S</button>
      <button class="debug" @click="playToken('s')">s</button>
      <button class="debug" @click="playToken('A')">A</button>
      <button class="debug" @click="playToken('a')">a</button>
      <button class="debug" @click="playToken('B')">B</button>
      <button class="debug" @click="playToken('b')">b</button>
      <button class="debug" @click="playToken('w')">w</button>
      <button class="debug" @click="playToken('z')">z</button>
    </aside>
  </main>
</template>

<style scoped>
.Robot {
  width: var(--width-robot);
  max-width: var(--max-width-robot);
  margin: 0 auto;
  position: relative;
  aspect-ratio: var(--aspect-ratio-robot);
}

.Robot svg {
  width: 100%;
  height: 100%;
}

.Robot__Mouth {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 10%;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

canvas {
  position: absolute;
  width: 70%;
  height: auto;
  image-rendering: pixelated;
  aspect-ratio: var(--aspect-ratio-canvas);
  border: var(--border-width-base) solid var(--color-accent);
  background: var(--color-surface-bright);
  box-shadow: var(--shadow-glow-accent);
}

/* Robot eyes - no animation, just bright */
.robot-eyes circle {
  filter: brightness(1.2); /* Always bright */
}

/* Eye tracking - no transition needed with requestAnimationFrame */
.robot-eyes rect {
  will-change: transform; /* Hint for GPU acceleration */
}

/* Antenna always glowing */
.robot-antenna circle {
  filter: drop-shadow(0 0 8px var(--color-primary));
}

/* Volume Control */
.volume-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  margin: var(--space-xl) auto;
  max-width: 400px;
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
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  cursor: pointer;
  border: var(--border-width-base) solid var(--color-accent);
  box-shadow: var(--shadow-glow-primary);
}

.volume-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  cursor: pointer;
  border: var(--border-width-base) solid var(--color-accent);
  box-shadow: var(--shadow-glow-primary);
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
  min-width: 3em;
  text-align: left;
  color: var(--color-accent);
  font-size: var(--font-size-sm);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}
</style>
