<script setup lang="ts">
import { useSoundStore } from '@/stores/sound'
import { ramble } from './grammars/subphrasesGrammar'

// Get sound store instance
const soundStore = useSoundStore()

const playRamble = async () => {
  soundStore.playSequence(ramble())
}

// Play upward sweep sound
const playUpwardSweep = async () => {
  try {
    await soundStore.playSoundToken('S')
    console.log('Played upward sweep')
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

// Play downward sweep sound
const playDownwardSweep = async () => {
  try {
    await soundStore.playSoundToken('s')
    console.log('Played downward sweep')
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

// Play arpeggio up sound
const playArpeggioUp = async () => {
  try {
    await soundStore.playSoundToken('A')
    console.log('Played arpeggio up')
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

// Play arpeggio down sound
const playArpeggioDown = async () => {
  try {
    await soundStore.playSoundToken('a')
    console.log('Played arpeggio down')
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

// Play high beep sound
const playHighBeep = async () => {
  try {
    await soundStore.playSoundToken('B')
    console.log('Played high beep')
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

// Play low beep sound
const playLowBeep = async () => {
  try {
    await soundStore.playSoundToken('b')
    console.log('Played low beep')
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

// Play warble sound
const playWarble = async () => {
  try {
    await soundStore.playSoundToken('w')
    console.log('Played warble')
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

// Play buzz sound
const playBuzz = async () => {
  try {
    await soundStore.playSoundToken('z')
    console.log('Played buzz')
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
      <button @click="playUpwardSweep">S</button>
      <button @click="playDownwardSweep">s</button>
      <button @click="playArpeggioUp">A</button>
      <button @click="playArpeggioDown">a</button>
      <button @click="playHighBeep">B</button>
      <button @click="playLowBeep">b</button>
      <button @click="playWarble">w</button>
      <button @click="playBuzz">z</button>
    </div>

    <div class="button-container">
      <button @click="playRamble">Ramble</button>
    </div>
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
