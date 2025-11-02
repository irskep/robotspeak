<script setup lang="ts">
import { useSoundStore } from '@/stores/soundStore'
import { usePlaybackStore } from '@/stores/playbackStore'
import RobotDisplay from '@/components/RobotDisplay.vue'
import VolumeControl from '@/components/VolumeControl.vue'
import DiagnosticsPanel from '@/components/DiagnosticsPanel.vue'

// Get store instances
const soundStore = useSoundStore()
const playbackStore = usePlaybackStore()
</script>

<template>
  <main class="console">
    <header class="interface-header">
      <h1>Talk to TRN5-F0RMR</h1>
    </header>

    <section class="primary-display">
      <RobotDisplay />
    </section>

    <VolumeControl v-model="soundStore.volume" />

    <section class="control-panel">
      <button class="primary" @click="playbackStore.playNew()">Make with the beep boops</button>
      <button class="secondary" :disabled="!playbackStore.canReplay" @click="playbackStore.replay()">
        Replay
      </button>
      <button class="secondary" :disabled="!playbackStore.canDownload" @click="playbackStore.download()">
        Download
      </button>
    </section>

    <section class="readout">
      <pre>{{ playbackStore.sequenceAsString || '&nbsp;' }}</pre>
    </section>

    <DiagnosticsPanel />
  </main>
</template>
