<script setup lang="ts">
import { useSoundStore } from '@/stores/sound'
import { ramble } from './grammars/subphrasesGrammar'
import type { SoundToken } from './types/sound'
import { onMounted, ref } from 'vue'

// Get sound store instance
const soundStore = useSoundStore()

const canvas = ref<HTMLCanvasElement>()

onMounted(() => soundStore.initialize(canvas.value!))

const playRamble = async () => {
  soundStore.waviz?.visualizer?.simpleBars()
  soundStore.waviz?.input.initializePending()
  soundStore.playSequence(ramble())
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
    <h1>Robot Sounds Generator</h1>
    <p>Click the buttons to generate robot sounds</p>

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

    <div class="button-container">
      <button @click="playRamble">Ramble</button>
    </div>

    <canvas ref="canvas"></canvas>
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
</style>
