import type { RobotWord, BakedRobotWord, PlaybackToken } from '@/types/sound'
import { bakeToken } from '@/modules/tokenBaker'

/**
 * Bake a sequence of RobotWords into BakedRobotWords
 * Ensures consistent PlaybackTokens for the same identifier
 */
export const bakeSequence = async (words: RobotWord[]): Promise<BakedRobotWord[]> => {
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
