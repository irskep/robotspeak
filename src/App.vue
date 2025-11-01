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
  <div class="app">
    <div class="Robot">
      <svg viewBox="-100 0 200 200">
        <path d="M 0 50 A 80 80 0 0 130 5" stroke="blue" fill="transparent"></path>
        <circle cx="30" cy="5" r="5" fill="blue"></circle>
        <rect
          x="-100"
          y="50"
          width="200"
          height="150"
          rx="10"
          ry="10"
          stroke-width="1"
          stroke="blue"
          fill="deepskyblue"
        ></rect>
        <circle cx="-50" cy="80" r="20" stroke="orange" fill="yellow"></circle>
        <circle cx="50" cy="80" r="20" stroke="orange" fill="yellow"></circle>
      </svg>
      <div class="Robot__Mouth">
        <canvas ref="canvas"></canvas>
      </div>
    </div>

    <div class="button-container">
      <button @click="playRamble">Ramble</button>
    </div>

    <div>
      <pre>{{ lastSequenceAsString || '&nbsp;' }}</pre>
    </div>

    <div class="button-container">
      <button @click="playToken('S')">S</button>
      <button @click="playToken('s')">s</button>
      <button @click="playToken('A')">A</button>
      <button @click="playToken('a')">a</button>
      <button @click="playToken('B')">B</button>
      <button @click="playToken('b')">b</button>
      <button @click="playToken('w')">w</button>
      <button @click="playToken('z')">z</button>
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

.Robot {
  width: 50vw;
  position: relative;
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
  image-rendering: pixelated;
  aspect-ratio: 300 / 150;
  border: 1px solid yellow;
  background-color: darkblue;
}
</style>
