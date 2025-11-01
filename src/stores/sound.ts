import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sfxr, Params, type SynthParameters } from 'sfxr.js'
import type { SoundToken, TokenDefinition } from '@/types/sound'
import { TOKEN_DEFINITIONS } from '@/modules/tokenDefinitions'

/**
 * Sound store for managing audio context and sound generation
 */
export const useSoundStore = defineStore('sound', () => {
  // State
  const audioContext = ref<AudioContext | null>(null)
  const isInitialized = ref(false)

  // Getters
  const isReady = computed(() => isInitialized.value)

  // Actions
  /**
   * Initialize the audio context (required for browser audio)
   * Must be called after user interaction due to browser policies
   */
  const initialize = async (): Promise<void> => {
    if (isInitialized.value) return

    try {
      const AudioContextConstructor =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioContextConstructor) {
        throw new Error('Web Audio API not supported')
      }
      audioContext.value = new AudioContextConstructor()
      isInitialized.value = true
      console.log('Sound engine initialized')
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
      throw error
    }
  }

  /**
   * Play a sound based on a token
   */
  const playToken = async (token: SoundToken): Promise<void> => {
    // Auto-initialize on first play attempt
    if (!isInitialized.value) {
      await initialize()
    }

    const definition = TOKEN_DEFINITIONS[token]
    if (!definition) {
      console.warn(`Unknown token: ${token}`)
      return
    }

    try {
      await playSoundWithParams(definition.params)
    } catch (error) {
      console.error(`Failed to play token ${token}:`, error)
      throw error
    }
  }

  /**
   * Play a sound with specific parameters
   */
  const playSoundWithParams = async (params: Partial<SynthParameters>): Promise<void> => {
    if (!audioContext.value) {
      throw new Error('Audio context not initialized')
    }

    try {
      // Create a new Params object with defaults
      const sfxrParams = new Params()

      // Override with our custom params
      Object.assign(sfxrParams, params)

      // Use sfxr's toWebAudio helper to create an AudioBufferSourceNode
      const source = sfxr.toWebAudio(sfxrParams, audioContext.value)

      if (source) {
        // Connect the source to the audio context's destination
        source.connect(audioContext.value.destination)
        // Start playing the sound
        source.start(0)
      }
    } catch (error) {
      console.error('Error playing sound:', error)
      throw error
    }
  }

  /**
   * Generate a random variation of a token's parameters
   * (for future use when we want slight variations)
   */
  const getTokenVariation = (
    token: SoundToken,
    _variationAmount = 0.1,
  ): Partial<SynthParameters> => {
    const baseParams = TOKEN_DEFINITIONS[token]?.params
    if (!baseParams) {
      throw new Error(`Unknown token: ${token}`)
    }

    // For now, return base params without variation
    // In the future, we can add random variations here
    return { ...baseParams }
  }

  /**
   * Get information about a token
   */
  const getTokenInfo = (token: SoundToken): TokenDefinition | undefined => {
    return TOKEN_DEFINITIONS[token]
  }

  return {
    // State (exposed as refs)
    audioContext,
    isInitialized,

    // Getters
    isReady,

    // Actions
    initialize,
    playToken,
    playSoundWithParams,
    getTokenVariation,
    getTokenInfo,
  }
})
