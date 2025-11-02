import type { BakedRobotWord, PlaybackToken } from '@/types/sound'
import { SoundEffect, Params, RiffWave } from 'sfxr.js'

const SAMPLE_RATE = 44100 // sfxr.js uses 44100 Hz sample rate

/**
 * Generates PCM samples for a single PlaybackToken
 * @param token - The PlaybackToken to generate samples for
 * @returns Array of PCM samples
 */
function getSamplesForPlaybackToken(token: PlaybackToken): number[] {
  if (token.kind === 'WaitToken') {
    // Generate silence samples for the wait duration
    const numSamples = Math.floor(SAMPLE_RATE * (token.durationMs / 1000))
    return Array.from({ length: numSamples }, () => 0)
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
 *
 * @param bakedWords - The sequence of BakedRobotWords to convert
 * @returns Data URI of the generated WAV file
 */
export async function sequenceToWav(bakedWords: BakedRobotWord[]): Promise<string> {
  // Collect all PCM samples from the sequence
  const allSamples: number[] = []

  for (const word of bakedWords) {
    const samples = getSamplesForPlaybackToken(word.playbackToken)
    allSamples.push(...samples)
  }

  // Create a single WAV file from the concatenated samples
  const finalWav = new RiffWave()
  finalWav.header.sampleRate = SAMPLE_RATE // Set correct sample rate
  finalWav.header.bitsPerSample = 8 // sfxr.js uses 8-bit samples
  finalWav.Make(allSamples) // Generate the WAV with correct headers
  return finalWav.dataURI
}