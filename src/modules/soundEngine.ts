import { sfxr, Params, type SynthParameters } from 'sfxr.js'
import type { SoundToken, TokenDefinition } from '@/types/sound'
import { TOKEN_DEFINITIONS } from '@/modules/tokenDefinitions'

class SoundEngine {
  private audioContext: AudioContext | null = null
  private isInitialized = false

  /**
   * Initialize the audio context (required for browser audio)
   * Must be called after user interaction due to browser policies
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      const AudioContextConstructor =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioContextConstructor) {
        throw new Error('Web Audio API not supported')
      }
      this.audioContext = new AudioContextConstructor()
      this.isInitialized = true
      console.log('Sound engine initialized')
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
      throw error
    }
  }

  /**
   * Play a sound based on a token
   */
  public async playToken(token: SoundToken): Promise<void> {
    // Auto-initialize on first play attempt
    if (!this.isInitialized) {
      await this.initialize()
    }

    const definition = TOKEN_DEFINITIONS[token]
    if (!definition) {
      console.warn(`Unknown token: ${token}`)
      return
    }

    try {
      await this.playSoundWithParams(definition.params)
    } catch (error) {
      console.error(`Failed to play token ${token}:`, error)
      throw error
    }
  }

  /**
   * Play a sound with specific parameters
   */
  private async playSoundWithParams(params: Partial<SynthParameters>): Promise<void> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized')
    }

    try {
      // Create a new Params object with defaults
      const sfxrParams = new Params()

      // Override with our custom params
      Object.assign(sfxrParams, params)

      // Use sfxr's toWebAudio helper to create an AudioBufferSourceNode
      const source = sfxr.toWebAudio(sfxrParams, this.audioContext)

      if (source) {
        // Connect the source to the audio context's destination
        source.connect(this.audioContext.destination)
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
  public getTokenVariation(token: SoundToken, _variationAmount = 0.1): Partial<SynthParameters> {
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
  public getTokenInfo(token: SoundToken): TokenDefinition | undefined {
    return TOKEN_DEFINITIONS[token]
  }

  /**
   * Check if sound engine is ready
   */
  public get isReady(): boolean {
    return this.isInitialized
  }
}

// Export singleton instance
export const soundEngine = new SoundEngine()

// Export for testing or multiple instances
export { SoundEngine }
