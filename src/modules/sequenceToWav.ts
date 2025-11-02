import type { BakedRobotWord, PlaybackToken } from '@/types/sound'
import { SoundEffect, Params, RiffWave } from 'sfxr.js'

const SAMPLE_RATE = 44100 // sfxr.js uses 44100 Hz sample rate
const FADE_DURATION_MS = 3 // 3ms fade to eliminate clicks
const FADE_SAMPLES = Math.floor(SAMPLE_RATE * FADE_DURATION_MS / 1000) // ~132 samples
const PCM_CENTER = 128 // 8-bit PCM center point (silence)

/**
 * Applies a fade-in to the start of a sample array
 * @param samples - The sample array to modify in-place
 * @param fadeLength - Number of samples to fade over
 */
function applyFadeIn(samples: number[], fadeLength: number): void {
  const actualFadeLength = Math.min(fadeLength, Math.floor(samples.length / 2))

  for (let i = 0; i < actualFadeLength; i++) {
    const fadeMultiplier = i / actualFadeLength
    const currentSample = samples[i]
    if (currentSample !== undefined) {
      // Scale the distance from center (128) by the fade multiplier
      samples[i] = PCM_CENTER + (currentSample - PCM_CENTER) * fadeMultiplier
    }
  }
}

/**
 * Applies a fade-out to the end of a sample array
 * @param samples - The sample array to modify in-place
 * @param fadeLength - Number of samples to fade over
 */
function applyFadeOut(samples: number[], fadeLength: number): void {
  const actualFadeLength = Math.min(fadeLength, Math.floor(samples.length / 2))
  const startIndex = samples.length - actualFadeLength

  for (let i = 0; i < actualFadeLength; i++) {
    const fadeMultiplier = 1 - (i / actualFadeLength)
    const sampleIndex = startIndex + i
    const currentSample = samples[sampleIndex]
    if (currentSample !== undefined) {
      // Scale the distance from center (128) by the fade multiplier
      samples[sampleIndex] = PCM_CENTER + (currentSample - PCM_CENTER) * fadeMultiplier
    }
  }
}

/**
 * Generates PCM samples for a single PlaybackToken
 * @param token - The PlaybackToken to generate samples for
 * @returns Array of PCM samples
 */
function getSamplesForPlaybackToken(token: PlaybackToken): number[] {
  if (token.kind === 'WaitToken') {
    // Generate silence samples for the wait duration
    const numSamples = Math.floor(SAMPLE_RATE * (token.durationMs / 1000))
    return Array.from({ length: numSamples }, () => PCM_CENTER) // Use PCM_CENTER for silence
  } else {
    // BakedToken - use sfxr to generate sound
    const params = new Params()
    Object.assign(params, token.params)

    const soundEffect = new SoundEffect(params)
    const riffWave = soundEffect.generate()

    // Return the raw PCM samples
    return riffWave.data
  }
}

/**
 * Converts a sequence of BakedRobotWords into a single WAV file.
 *
 * The exported WAV is at full volume regardless of the app's volume setting.
 * Applies fades to eliminate audio clicks at transitions.
 *
 * @param bakedWords - The sequence of BakedRobotWords to convert
 * @returns Data URI of the generated WAV file
 */
export async function sequenceToWav(bakedWords: BakedRobotWord[]): Promise<string> {
  // Collect samples for each segment
  const segments: number[][] = []

  for (const word of bakedWords) {
    const samples = getSamplesForPlaybackToken(word.playbackToken)
    segments.push(samples)
  }

  // Apply fades to eliminate clicks
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (!segment) continue

    const isWaitToken = segment.length > 0 && segment.every((s) => s === PCM_CENTER)

    // Skip fading silence/wait tokens - they're already at the center point
    if (isWaitToken) continue

    // Fade in (except for the very first segment)
    if (i > 0) {
      applyFadeIn(segment, FADE_SAMPLES)
    }

    // Fade out (except for the very last segment)
    if (i < segments.length - 1) {
      applyFadeOut(segment, FADE_SAMPLES)
    }
  }

  // Concatenate all segments
  const allSamples: number[] = []
  for (const segment of segments) {
    allSamples.push(...segment)
  }

  // Create a single WAV file from the concatenated samples
  const finalWav = new RiffWave()
  finalWav.header.sampleRate = SAMPLE_RATE // Set correct sample rate
  finalWav.header.bitsPerSample = 8 // sfxr.js uses 8-bit samples
  finalWav.Make(allSamples) // Generate the WAV with correct headers
  return finalWav.dataURI
}