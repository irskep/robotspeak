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
</script>

<template>
  <div class="app">
    <h1>Robot Sounds Generator</h1>
    <p>Click the button to generate an upward sweep sound</p>

    <button @click="playUpwardSweep">Play Upward Sweep (S)</button>
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

button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
