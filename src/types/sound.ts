import type { SynthParameters } from 'sfxr.js'

// Sound token types
export type SoundToken =
  | 'S' // upward sweep
  | 's' // downward sweep
  | 'A' // upward arpeggio
  | 'a' // downward arpeggio
  | 'B' // high beep
  | 'b' // low beep
  | 'w' // warble
  | 'z' // buzz
  | '_' // wait

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

export interface WaitToken {
  kind: 'WaitToken'
  durationMs: number
}

// Baked token - a specific instance of a token with fixed parameters
export interface BakedToken {
  kind: 'BakedToken'
  token: SoundToken
  params: Partial<SynthParameters>
  // Optional ID for caching/reference
  id?: string
}

export type PlaybackToken = WaitToken | BakedToken

export type RobotWord = { soundToken: SoundToken; identifier: string }
