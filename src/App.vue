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
</script>

<template>
  <div class="app">
    <h1>Robot Sounds Generator</h1>
    <p>Click the buttons to generate robot sounds</p>

    <div class="button-container">
      <button @click="playUpwardSweep">Play Upward Sweep (S)</button>
      <button @click="playDownwardSweep">Play Downward Sweep (s)</button>
    </div>
  </div>
</template>

<style scoped>
.app {
  padding: 2rem;
  text-align: center;
}

h1 {
  margin-bottom: 1rem;
}

p {
  margin-bottom: 2rem;
}

.button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
