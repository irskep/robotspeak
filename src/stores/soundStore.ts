import Waviz from 'waviz/core'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sfxr, Params, type SynthParameters } from 'sfxr.js'
import type { RobotWord, SoundToken, PlaybackToken, BakedRobotWord } from '@/types/sound'
import { bakeToken } from '@/modules/tokenBaker'

/**
 * Sound store for managing audio context and sound generation
 */
export const useSoundStore = defineStore('sound', () => {
  // State
  const audioContext = ref<AudioContext | null>(null)
  const isInitialized = ref(false)
  const waviz = ref<Waviz | null>(null)
  const mediaStreamDest = ref<MediaStreamAudioDestinationNode | null>(null)
  const masterGain = ref<GainNode | null>(null)

  // Getters
  const isReady = computed(() => isInitialized.value)

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
      masterGain.value.gain.value = 0.15 // Default volume 15%
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

  const getPlaybackToken = async (token: SoundToken): Promise<PlaybackToken> => {
    return bakeToken(token)
  }

  /**
   * Play a sound based on a token (generates fresh instance)
   */
  const playPlaybackToken = async (token: PlaybackToken): Promise<void> => {
    // Auto-initialize on first play attempt
    if (!isInitialized.value) {
      throw new Error('Not initialized')
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

      if (source && masterGain.value) {
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
    } catch (error) {
      console.error('Error playing sound:', error)
      throw error
    }
  }

  /**
   * Bake a sequence of RobotWords into BakedRobotWords
   * Ensures consistent PlaybackTokens for the same identifier
   */
  const bakeSequence = async (words: RobotWord[]): Promise<BakedRobotWord[]> => {
    const playbackTokensByRobotWordId = new Map<string, PlaybackToken>()
    const bakedSequence: BakedRobotWord[] = []

    for (const word of words) {
      const rwid = `${word.soundToken}${word.identifier}`
      if (!playbackTokensByRobotWordId.has(rwid)) {
        playbackTokensByRobotWordId.set(rwid, await bakeToken(word.soundToken))
      }
      bakedSequence.push({
        soundToken: word.soundToken,
        identifier: word.identifier,
        playbackToken: playbackTokensByRobotWordId.get(rwid)!,
      })
    }

    return bakedSequence
  }

  const playSequence = async (words: RobotWord[]): Promise<BakedRobotWord[]> => {
    console.log('Playing sequence:', JSON.stringify(words))
    const bakedSequence = await bakeSequence(words)

    for (const bakedWord of bakedSequence) {
      await playPlaybackToken(bakedWord.playbackToken)
    }

    return bakedSequence
  }

  /**
   * Set the master volume (0-100)
   */
  const setVolume = (volume: number): void => {
    if (masterGain.value) {
      // Convert 0-100 to 0-1
      masterGain.value.gain.value = Math.max(0, Math.min(100, volume)) / 100
    }
  }

  return {
    // State (exposed as refs)
    audioContext,
    isInitialized,
    waviz,

    // Getters
    isReady,

    // Actions
    initialize,
    playPlaybackToken,
    playSoundToken,
    playSequence,
    bakeSequence,
    playSoundWithParams,
    getPlaybackToken,
    setVolume,
  }
})
