import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RobotWord, BakedRobotWord, SoundToken } from '@/types/sound'
import { useSoundStore } from '@/stores/soundStore'
import { makeBeepBoopsUsingFancyGrammarAlgorithm } from '@/grammars/subphrasesGrammar'
import { sequenceToWav } from '@/modules/sequenceToWav'
import { bakeSequence } from '@/modules/sequenceBaker'

/**
 * Playback store for managing application-level playback state
 * Orchestrates soundStore (low-level audio) with high-level playback logic
 */
export const usePlaybackStore = defineStore('playback', () => {
  const soundStore = useSoundStore()

  // State
  const currentSequence = ref<RobotWord[]>([])
  const currentBaked = ref<BakedRobotWord[]>([])
  const currentWavDataUri = ref<string>('')
  const isPlaying = ref(false)

  // Computed properties
  const sequenceAsString = computed(() =>
    currentSequence.value.map((w) => `${w.soundToken}${w.identifier}`).join(' '),
  )

  const canReplay = computed(() => currentBaked.value.length > 0 && !isPlaying.value)

  const canDownload = computed(() => currentWavDataUri.value !== '' && !isPlaying.value)

  // Actions

  /**
   * Generate and play a new robot sound sequence
   */
  const playNew = async (): Promise<void> => {
    isPlaying.value = true
    try {
      soundStore.resetVisualization()

      const seq = makeBeepBoopsUsingFancyGrammarAlgorithm()
      currentSequence.value = seq

      // Bake the sequence
      const bakedSeq = await bakeSequence(seq)
      currentBaked.value = bakedSeq

      // Play the baked sequence
      for (const bakedWord of bakedSeq) {
        await soundStore.playToken(bakedWord.playbackToken)
      }

      // Generate WAV file for the baked sequence
      currentWavDataUri.value = await sequenceToWav(bakedSeq)
    } finally {
      isPlaying.value = false
    }
  }

  /**
   * Replay the current baked sequence
   */
  const replay = async (): Promise<void> => {
    if (currentBaked.value.length === 0) return

    isPlaying.value = true
    try {
      soundStore.resetVisualization()

      // Replay the already baked sequence
      for (const bakedWord of currentBaked.value) {
        await soundStore.playToken(bakedWord.playbackToken)
      }
    } finally {
      isPlaying.value = false
    }
  }

  /**
   * Download the current WAV file
   */
  const download = (): void => {
    if (!currentWavDataUri.value) return

    // Create a filename from the sequence string (replace spaces with dashes)
    const sequenceSuffix = sequenceAsString.value.replace(/\s+/g, '-') || 'empty'

    // Create a temporary link element
    const link = document.createElement('a')
    link.href = currentWavDataUri.value
    link.download = `robot-${sequenceSuffix}.wav`

    // Trigger the download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Play a single debug sound token
   */
  const playDebugToken = async (token: SoundToken): Promise<void> => {
    try {
      await soundStore.playSoundToken(token)
      console.log(`Played ${token}`)
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }

  return {
    // State
    currentSequence,
    currentBaked,
    currentWavDataUri,
    isPlaying,

    // Computed
    sequenceAsString,
    canReplay,
    canDownload,

    // Actions
    playNew,
    replay,
    download,
    playDebugToken,
  }
})
