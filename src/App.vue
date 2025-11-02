<script setup lang="ts">
import { useSoundStore } from '@/stores/soundStore'
import { makeBeepBoopsUsingFancyGrammarAlgorithm } from './grammars/subphrasesGrammar'
import type { SoundToken, RobotWord, BakedRobotWord } from './types/sound'
import { sequenceToWav } from '@/modules/sequenceToWav'
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'

// Get sound store instance
const soundStore = useSoundStore()
const canvas = ref<HTMLCanvasElement>()
const lastSequenceAsString = ref('')
const lastSequence = ref<RobotWord[]>([])
const lastBakedSequence = ref<BakedRobotWord[]>([])
const lastSequenceWavDataUri = ref<string>('')
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

// Eye movement configuration
const PUPIL_MOVEMENT_RANGE = 12 // Maximum offset in pixels (-6 to 6)

// Calculate pupil offsets using simple linear interpolation
const leftPupilTransform = computed(() => {
  // Map mouse position to pupil movement range
  const xOffset = (mouseX.value - 0.5) * PUPIL_MOVEMENT_RANGE
  const yOffset = (mouseY.value - 0.5) * PUPIL_MOVEMENT_RANGE
  return `translate(${xOffset}, ${yOffset})`
})

const rightPupilTransform = computed(() => {
  // Same mapping for right eye
  const xOffset = (mouseX.value - 0.5) * PUPIL_MOVEMENT_RANGE
  const yOffset = (mouseY.value - 0.5) * PUPIL_MOVEMENT_RANGE
  return `translate(${xOffset}, ${yOffset})`
})

// Canvas configuration
const CANVAS_WIDTH = 300
const CANVAS_HEIGHT = 113 // Reduced from 150 to make canvas shorter

onMounted(() => {
  canvas.value!.width = CANVAS_WIDTH
  canvas.value!.height = CANVAS_HEIGHT
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
  lastSequence.value = seq
  lastSequenceAsString.value = seq.map((w) => `${w.soundToken}${w.identifier}`).join(' ')

  // Play the sequence and get the baked version
  const bakedSeq = await soundStore.playSequence(seq)
  lastBakedSequence.value = bakedSeq

  // Generate WAV file for the baked sequence
  lastSequenceWavDataUri.value = await sequenceToWav(bakedSeq)
}

const replaySequence = async () => {
  if (lastBakedSequence.value.length === 0) return

  soundStore.waviz?.visualizer?.simpleLine()
  soundStore.waviz?.input.initializePending()

  // Replay the already baked sequence
  for (const bakedWord of lastBakedSequence.value) {
    await soundStore.playPlaybackToken(bakedWord.playbackToken)
  }
}

const downloadWav = () => {
  if (!lastSequenceWavDataUri.value) return

  // Create a filename from the sequence string (replace spaces with dashes)
  const sequenceSuffix = lastSequenceAsString.value.replace(/\s+/g, '-') || 'empty'

  // Create a temporary link element
  const link = document.createElement('a')
  link.href = lastSequenceWavDataUri.value
  link.download = `robot-${sequenceSuffix}.wav`

  // Trigger the download
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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
      <button class="secondary" :disabled="lastBakedSequence.length === 0" @click="replaySequence">
        Replay
      </button>
      <button class="secondary" :disabled="!lastSequenceWavDataUri" @click="downloadWav">
        Download
      </button>
    </section>

    <section class="readout">
      <pre>{{ lastSequenceAsString || '&nbsp;' }}</pre>
    </section>

    <section class="audio-export" v-if="lastSequenceWavDataUri" style="display: none">
      <audio :src="lastSequenceWavDataUri" controls></audio>
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
  --mouth-bottom-offset: 10%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: var(--mouth-bottom-offset);
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

canvas {
  --canvas-width: 70%;
  position: absolute;
  width: var(--canvas-width);
  height: auto;
  image-rendering: pixelated;
  aspect-ratio: var(--aspect-ratio-canvas);
  border: var(--border-width-base) solid var(--color-accent);
  background: var(--color-surface-bright);
  box-shadow: var(--shadow-glow-accent);
}

/* Robot eyes - no animation, just bright */
.robot-eyes circle {
  --eye-brightness: 1.2;
  filter: brightness(var(--eye-brightness)); /* Always bright */
}

/* Eye tracking - no transition needed with requestAnimationFrame */
.robot-eyes rect {
  will-change: transform; /* Hint for GPU acceleration */
}

/* Antenna always glowing */
.robot-antenna circle {
  --antenna-glow-size: 8px;
  filter: drop-shadow(0 0 var(--antenna-glow-size) var(--color-primary));
}

/* Volume Control */
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

/* Audio Export */
.audio-export {
  --audio-max-width: 400px;
  display: flex;
  justify-content: center;
  margin: var(--space-lg) auto;
  max-width: var(--audio-max-width);
}

.audio-export audio {
  width: 100%;
  filter: hue-rotate(180deg) saturate(2);
}
</style>
