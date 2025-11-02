<script setup lang="ts">
import type { SoundToken } from '@/types/sound'

defineProps<{
  wavDataUri: string
}>()

const emit = defineEmits<{
  'play-token': [token: SoundToken]
}>()

const playToken = (token: SoundToken) => {
  emit('play-token', token)
}
</script>

<template>
  <!-- Hidden audio element for testing WAV export -->
  <section v-if="wavDataUri" class="audio-export" style="display: none">
    <audio :src="wavDataUri" controls></audio>
  </section>

  <!-- Debug buttons for testing individual sound tokens -->
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
</template>

<style scoped>
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

.diagnostics {
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: var(--border-width-thin) solid var(--color-white-alpha-10);
  text-align: center;
}
</style>
