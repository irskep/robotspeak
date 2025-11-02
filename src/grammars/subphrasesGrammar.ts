import type { RobotWord, SoundToken } from '@/types/sound'
import { randint, getIdentifier, weightedChoice, choice } from './utils'

interface GeneratorState {
  identifiersBySoundToken: Map<SoundToken, string[]>
  n: number
  result: Array<RobotWord>
}

type ExpressionState = GeneratorState & { i: number }

interface Expression {
  name: string
  getWeight: (opts: ExpressionState) => number
  generate: (opts: ExpressionState) => void
}

function repeatWordSequenceRandomNumberOfTimes<RobotWord>(
  words: RobotWord[],
  range: [number, number] = [1, 3],
): RobotWord[] {
  const result = new Array<RobotWord>()
  const n = randint(range[0], range[1])
  for (let i = 0; i < n; i++) {
    // input sequence repeats
    result.push(words[i % words.length]!)
  }
  return result
}

/// Generates an array of length n by repeating /// two distinct RobotWords based on the same SoundToken
function repeatTokenVariants(s: SoundToken, n: number): RobotWord[] {
  const id1 = getIdentifier()
  const id2 = getIdentifier()
  return repeatWordSequenceRandomNumberOfTimes<RobotWord>(
    [
      { soundToken: s, identifier: id1 },
      { soundToken: s, identifier: id2 },
    ],
    [1, n],
  )
}

export const ALL_TOKENS: SoundToken[] = ['S', 's', 'A', 'a', 'B', 'b', 'w', 'z', '_']

function getOrCreateIdentifier(state: GeneratorState, s: SoundToken): string {
  const arr = state.identifiersBySoundToken.get(s) || []
  if (arr.length >= 3) {
    return choice(arr)
  } else {
    arr.push(getIdentifier())
    state.identifiersBySoundToken.set(s, arr)
    return arr[arr.length - 1]!
  }
}

const EXPRESSIONS: Expression[] = [
  {
    name: 'SimpleRepeatingSequence',
    getWeight: () => 1,
    generate: (state) => {
      const tok = choice(ALL_TOKENS.slice(0, ALL_TOKENS.length - 1))
      state.result.push(...repeatTokenVariants(tok, weightedChoice([1, 2, 3], [8, 2, 2])))
    },
  },
  {
    name: 'Wait',
    getWeight: ({ i, n, result }) => {
      // Don't wait at start, end, or after another wait
      if (i === 0) return 0
      if (i === n - 1) return 0
      if (result[i - 1]?.soundToken === '_') return 0
      return 1
    },
    generate: (state) => {
      state.result.push({ soundToken: '_', identifier: getOrCreateIdentifier(state, '_') })
    },
  },
]

export function makeBeepBoopsUsingFancyGrammarAlgorithm(): RobotWord[] {
  const n = randint(5, 11)
  const result = new Array<RobotWord>()
  const identifiersBySoundToken = new Map<SoundToken, string[]>()

  const state: GeneratorState = {
    n,
    result,
    identifiersBySoundToken,
  }

  for (let i = 0; i < n; i++) {
    const expressionState = { i, ...state }
    const expr = weightedChoice(
      EXPRESSIONS,
      EXPRESSIONS.map((e) => e.getWeight(expressionState)),
    )
    expr.generate(expressionState)
  }

  return result
}
