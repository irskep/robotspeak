import type { SynthParameters } from 'sfxr.js'
import type { SoundToken, TokenRangeDefinition, ParameterRange, PlaybackToken } from '@/types/sound'
import { TOKEN_RANGES } from '@/modules/tokenRanges'

/**
 * Generates a random value within a range
 */
function randomInRange(range: ParameterRange): number {
  return range.min + Math.random() * (range.max - range.min)
}

/**
 * Checks if a value is a ParameterRange
 */
function isParameterRange(value: number | ParameterRange): value is ParameterRange {
  return typeof value === 'object' && 'min' in value && 'max' in value
}

/**
 * Bakes a token from its range definition
 * Generates specific parameter values from the defined ranges
 */
export function bakeToken(token: SoundToken): PlaybackToken {
  const rangeDefinition = TOKEN_RANGES[token]
  if (!rangeDefinition) {
    return { kind: 'WaitToken', durationMs: 50 + Math.random() * 250 }
  }

  const bakedParams: Record<string, number> = {}

  // Handle wave type selection if specified
  if (rangeDefinition.waveTypes && rangeDefinition.waveTypes.length > 0) {
    const randomIndex = Math.floor(Math.random() * rangeDefinition.waveTypes.length)
    bakedParams.wave_type = rangeDefinition.waveTypes[randomIndex]!
  }

  // Iterate through all parameters and generate values
  for (const [key, value] of Object.entries(rangeDefinition.params)) {
    // Skip wave_type if already set from waveTypes array
    if (key === 'wave_type' && bakedParams.wave_type !== undefined) {
      continue
    }

    if (isParameterRange(value)) {
      // Generate random value within range
      bakedParams[key] = randomInRange(value)
    } else {
      // Use fixed value
      bakedParams[key] = value
    }
  }

  return {
    kind: 'BakedToken',
    token,
    params: bakedParams as Partial<SynthParameters>,
    id: `${token}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }
}

/**
 * Gets the range definition for a token
 */
export function getTokenRange(token: SoundToken): TokenRangeDefinition {
  const range = TOKEN_RANGES[token]
  if (!range) {
    throw new Error(`Unknown token: ${token}`)
  }
  return TOKEN_RANGES.z!
}
