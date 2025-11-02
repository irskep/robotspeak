<script setup lang="ts">
import { useSoundStore } from '@/stores/soundStore'
import { makeBeepBoopsUsingFancyGrammarAlgorithm } from './grammars/subphrasesGrammar'
import type { SoundToken, RobotWord, BakedRobotWord } from './types/sound'
import { sequenceToWav } from '@/modules/sequenceToWav'
import { onMounted, ref, watch } from 'vue'
import { useEyeTracking } from '@/composables/useEyeTracking'
import RobotDisplay from '@/components/RobotDisplay.vue'
import VolumeControl from '@/components/VolumeControl.vue'
import DiagnosticsPanel from '@/components/DiagnosticsPanel.vue'

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

    <VolumeControl v-model="volume" />

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

    <DiagnosticsPanel :wavDataUri="lastSequenceWavDataUri" @play-token="playToken" />
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
</style>
