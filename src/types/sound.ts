import type { SynthParameters } from 'sfxr.js'

// Sound token types
export type SoundToken = 'S' | 's' // S = Upward sweep, s = downward sweep (more tokens to be added)

// Parameter range for randomization
export interface ParameterRange {
  min: number
  max: number
}

// Token range definition - defines the possible parameter ranges for a token
export interface TokenRangeDefinition {
  token: SoundToken
  name: string
  // Wave types to randomly select from (0=square, 1=sawtooth, 2=sine, 3=noise)
  waveTypes?: number[]
  // Each parameter can be either a fixed value or a range
  params: {
    [K in keyof Partial<SynthParameters>]: number | ParameterRange
  }
}

// Baked token - a specific instance of a token with fixed parameters
export interface BakedToken {
  token: SoundToken
  params: Partial<SynthParameters>
  // Optional ID for caching/reference
  id?: string
}

// Legacy interface for backward compatibility (will be removed)
export interface TokenDefinition {
  token: SoundToken
  name: string
  params: Partial<SynthParameters>
}
