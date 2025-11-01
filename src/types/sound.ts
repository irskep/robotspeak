import type { SynthParameters } from 'sfxr.js'

// Sound token types
export type SoundToken = 'S' // Upward sweep (more tokens to be added)

// Token definition interface
export interface TokenDefinition {
  token: SoundToken
  name: string
  params: Partial<SynthParameters> // Use partial since we only override what we need
}
