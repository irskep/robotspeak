<script setup lang="ts">
import { useSoundStore } from '@/stores/soundStore'
import { makeBeepBoopsUsingFancyGrammarAlgorithm } from './grammars/subphrasesGrammar'
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
    </section>

    <section class="control-panel">
      <button class="primary" @click="playBeepBoops">Make with the beep boops</button>
    </section>

    <section class="readout" v-if="lastSequenceAsString">
      <pre>{{ lastSequenceAsString }}</pre>
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
</style>
