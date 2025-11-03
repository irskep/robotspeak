import Waviz from 'waviz/core'
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { sfxr, Params, type SynthParameters } from 'sfxr.js'
import type { SoundToken, PlaybackToken } from '@/types/sound'
import { bakeToken } from '@/modules/tokenBaker'

/**
 * Sound store for managing low-level audio context and sound generation
 */
export const useSoundStore = defineStore('sound', () => {
  // State
  const audioContext = ref<AudioContext | null>(null)
  const isInitialized = ref(false)
  const waviz = ref<Waviz | null>(null)
  const mediaStreamDest = ref<MediaStreamAudioDestinationNode | null>(null)
  const masterGain = ref<GainNode | null>(null)
  const volume = ref(15) // Default volume at 15%

  // Getters
  const isReady = computed(() => isInitialized.value)

  // Watch volume changes and sync to master gain
  watch(volume, (newVolume) => {
    if (masterGain.value) {
      masterGain.value.gain.value = Math.max(0, Math.min(100, newVolume)) / 100
    }
  })

  // Actions
  /**
   * Initialize the audio context (required for browser audio)
   * Must be called after user interaction due to browser policies
   */
  const initialize = async (canvas: HTMLCanvasElement): Promise<void> => {
    if (isInitialized.value) return

    try {
      const AudioContextConstructor =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioContextConstructor) {
        throw new Error('Web Audio API not supported')
      }
      audioContext.value = new AudioContextConstructor()
      masterGain.value = audioContext.value.createGain()
      masterGain.value.gain.value = volume.value / 100
      mediaStreamDest.value = audioContext.value.createMediaStreamDestination()
      masterGain.value.connect(audioContext.value.destination)
      // Don't connect masterGain to mediaStreamDest - we want pre-volume signal for viz
      waviz.value = new Waviz(canvas, mediaStreamDest.value.stream)
      isInitialized.value = true
      console.log('Sound engine initialized')
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
      throw error
    }
  }

  /**
   * Play a sound based on a PlaybackToken
   */
  const playToken = async (token: PlaybackToken): Promise<void> => {
    if (!isInitialized.value) {
      throw new Error('Not initialized')
    }

    if (token.kind === 'BakedToken') {
      await playSoundWithParams(token.params)
    } else if (token.kind === 'WaitToken') {
      await new Promise((resolve) => {
        setTimeout(resolve, token.durationMs)
      })
    }
  }

  /**
   * Convenience method: bake and play a SoundToken in one call
   */
  const playSoundToken = async (token: SoundToken): Promise<void> => {
    const playbackToken = await bakeToken(token)
    await playToken(playbackToken)
  }

  /**
   * Play a sound with specific parameters (low-level primitive)
   */
  const playSoundWithParams = async (params: Partial<SynthParameters>): Promise<void> => {
    if (!audioContext.value) {
      throw new Error('Audio context not initialized')
    }

    // Create a new Params object with defaults
    const sfxrParams = new Params()

    // Override with our custom params
    Object.assign(sfxrParams, params)

    // Use sfxr's toWebAudio helper to create an AudioBufferSourceNode
    const source = sfxr.toWebAudio(sfxrParams, audioContext.value)

    if (!source) {
      throw new Error('Failed to create audio source')
    }

    if (!masterGain.value) {
      throw new Error('Master gain not initialized')
    }

    // Connect the source through the master gain for audio output
    source.connect(masterGain.value)
    // Also connect directly to mediaStreamDest for pre-volume visualization
    if (mediaStreamDest.value) {
      source.connect(mediaStreamDest.value)
    }
    // Start playing the sound
    source.start(0)

    return new Promise((resolve) => (source.onended = () => resolve()))
  }

  /**
   * Reset visualization to initial state
   */
  const resetVisualization = (): void => {
    waviz.value?.visualizer?.simpleLine()
    waviz.value?.input.initializePending()
  }

  return {
    // Public state
    volume,
    isReady,

    // Actions
    initialize,
    playToken,
    playSoundToken,
    resetVisualization,
  }
})
