import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { sfxr, Params, type SynthParameters } from 'sfxr.js'
import type { RobotWord, SoundToken, PlaybackToken } from '@/types/sound'
import { bakeToken, getTokenRange } from '@/modules/tokenBaker'

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

  const getPlaybackToken = async (token: SoundToken): Promise<PlaybackToken> => {
    return bakeToken(token)
  }

  /**
   * Play a sound based on a token (generates fresh instance)
   */
  const playPlaybackToken = async (token: PlaybackToken): Promise<void> => {
    // Auto-initialize on first play attempt
    if (!isInitialized.value) {
      await initialize()
    }

    if (token.kind === 'BakedToken') {
      try {
        await playSoundWithParams(token.params)
      } catch (error) {
        console.error(`Failed to play token ${token}:`, error)
        throw error
      }
    } else if (token.kind === 'WaitToken') {
      await new Promise((resolve) => {
        setTimeout(resolve, token.durationMs)
      })
    }
  }

  const playSoundToken = async (token: SoundToken) => playPlaybackToken(await bakeToken(token))

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

        return new Promise((resolve) => (source.onended = () => resolve()))
      }
    } catch (error) {
      console.error('Error playing sound:', error)
      throw error
    }
  }

  const playSequence = async (words: RobotWord[]) => {
    console.log('Playing sequence:', JSON.stringify(words))
    const playbackTokensByRobotWordId = new Map<string, PlaybackToken>()

    const playbackTokenSequence = new Array<PlaybackToken>()

    for (const word of words) {
      const rwid = `${word.soundToken}${word.identifier}`
      if (!playbackTokensByRobotWordId.has(rwid)) {
        playbackTokensByRobotWordId.set(rwid, await bakeToken(word.soundToken))
      }
      playbackTokenSequence.push(playbackTokensByRobotWordId.get(rwid)!)
    }

    for (const playbackToken of playbackTokenSequence) {
      await playPlaybackToken(playbackToken)
    }
  }

  return {
    // State (exposed as refs)
    audioContext,
    isInitialized,

    // Getters
    isReady,

    // Actions
    initialize,
    playPlaybackToken,
    playSoundToken,
    playSequence,
    playSoundWithParams,
    getPlaybackToken,
  }
})
