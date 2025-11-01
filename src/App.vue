<script setup lang="ts">
import { useSoundStore } from '@/stores/soundStore'
import { ramble } from './grammars/subphrasesGrammar'
import type { SoundToken } from './types/sound'
import { onMounted, ref } from 'vue'

// Get sound store instance
const soundStore = useSoundStore()
const canvas = ref<HTMLCanvasElement>()
const lastSequenceAsString = ref('')

onMounted(() => {
  canvas.value!.width = 300
  canvas.value!.height = 150
  soundStore.initialize(canvas.value!)
})

const playRamble = async () => {
  soundStore.waviz?.visualizer?.simpleBars()
  soundStore.waviz?.input.initializePending()
  const seq = ramble()
  lastSequenceAsString.value = seq.map((w) => `${w.soundToken}${w.identifier}`).join(' ')
  soundStore.playSequence(seq)
}

const makeTokenPlayer = (s: SoundToken) => async () => {
  try {
    await soundStore.playSoundToken(s)
    console.log(`Played ${s}`)
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}
</script>

<template>
  <div class="app">
    <canvas ref="canvas"></canvas>

    <div class="button-container">
      <button @click="playRamble">Ramble</button>
    </div>

    <div>
      <pre>{{ lastSequenceAsString || '&nbsp;' }}</pre>
    </div>

    <div class="button-container">
      <button @click="makeTokenPlayer('S')">S</button>
      <button @click="makeTokenPlayer('s')">s</button>
      <button @click="makeTokenPlayer('A')">A</button>
      <button @click="makeTokenPlayer('a')">a</button>
      <button @click="makeTokenPlayer('B')">B</button>
      <button @click="makeTokenPlayer('b')">b</button>
      <button @click="makeTokenPlayer('w')">w</button>
      <button @click="makeTokenPlayer('z')">z</button>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

canvas {
  image-rendering: pixelated;
  aspect-ratio: 300 / 150;
  width: 100%;
  height: auto;
}
</style>
