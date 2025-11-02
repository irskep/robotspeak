<script setup lang="ts">
import { useSoundStore } from '@/stores/soundStore'
import { makeBeepBoopsUsingFancyGrammarAlgorithm } from './grammars/subphrasesGrammar'
import type { SoundToken, RobotWord, BakedRobotWord } from './types/sound'
import { sequenceToWav } from '@/modules/sequenceToWav'
import { onMounted, ref, watch } from 'vue'
import { useEyeTracking } from '@/composables/useEyeTracking'
import RobotDisplay from '@/components/RobotDisplay.vue'

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

// Eye tracking for robot pupils
const { leftPupilTransform, rightPupilTransform } = useEyeTracking(12)

// Canvas configuration
const CANVAS_WIDTH = 300
const CANVAS_HEIGHT = 113 // Reduced from 150 to make canvas shorter

onMounted(() => {
  canvas.value!.width = CANVAS_WIDTH
  canvas.value!.height = CANVAS_HEIGHT
  soundStore.initialize(canvas.value!)

  // Set initial volume after initialization
  soundStore.setVolume(volume.value)
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
      <RobotDisplay :leftPupilTransform="leftPupilTransform" :rightPupilTransform="rightPupilTransform">
        <canvas ref="canvas"></canvas>
      </RobotDisplay>
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
