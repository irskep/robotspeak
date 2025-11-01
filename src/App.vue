<script setup lang="ts">
import { useSoundStore } from '@/stores/sound'

// Get sound store instance
const soundStore = useSoundStore()

// Play upward sweep sound
const playUpwardSweep = async () => {
  try {
    await soundStore.playToken('S')
    console.log('Played upward sweep')
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

// Play downward sweep sound
const playDownwardSweep = async () => {
  try {
    await soundStore.playToken('s')
    console.log('Played downward sweep')
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

// Play arpeggio up sound
const playArpeggioUp = async () => {
  try {
    await soundStore.playToken('A')
    console.log('Played arpeggio up')
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

// Play arpeggio down sound
const playArpeggioDown = async () => {
  try {
    await soundStore.playToken('a')
    console.log('Played arpeggio down')
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

// Play high beep sound
const playHighBeep = async () => {
  try {
    await soundStore.playToken('B')
    console.log('Played high beep')
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
