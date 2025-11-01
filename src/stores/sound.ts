import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { sfxr, Params, type SynthParameters } from 'sfxr.js'
import type { SoundToken, BakedToken } from '@/types/sound'
import { bakeToken, getTokenRange } from '@/modules/tokenBaker'

/**
 * Sound store for managing audio context and sound generation
 */
export const useSoundStore = defineStore('sound', () => {
  // State
  const audioContext = ref<AudioContext | null>(null)
  const isInitialized = ref(false)

  // Token cache - stores baked tokens for consistency within a phrase
  const tokenCache = reactive<Map<string, BakedToken>>(new Map())

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
   * Play a sound based on a token (generates fresh instance)
   */
  const playToken = async (token: SoundToken, useCache = false): Promise<void> => {
    // Auto-initialize on first play attempt
    if (!isInitialized.value) {
      await initialize()
    }

    let bakedToken: BakedToken

    if (useCache && tokenCache.has(token)) {
      // Use cached token for consistency
      bakedToken = tokenCache.get(token)!
    } else {
      // Bake a fresh token instance
      bakedToken = bakeToken(token)

      // Store in cache for potential reuse
      tokenCache.set(token, bakedToken)
    }

    try {
      await playSoundWithParams(bakedToken.params)
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
   * Clear the token cache (useful when starting a new phrase)
   */
  const clearTokenCache = (): void => {
    tokenCache.clear()
  }

  /**
   * Get a baked token from cache or create new
   */
  const getBakedToken = (token: SoundToken, forceNew = false): BakedToken => {
    if (!forceNew && tokenCache.has(token)) {
      return tokenCache.get(token)!
    }

    const bakedToken = bakeToken(token)
    tokenCache.set(token, bakedToken)
    return bakedToken
  }

  /**
   * Get information about a token's range
   */
  const getTokenInfo = (token: SoundToken) => {
    return getTokenRange(token)
  }

  return {
    // State (exposed as refs)
    audioContext,
    isInitialized,
    tokenCache,

    // Getters
    isReady,

    // Actions
    initialize,
    playToken,
    playSoundWithParams,
    clearTokenCache,
    getBakedToken,
    getTokenInfo,
  }
})
