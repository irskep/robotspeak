import type { RobotWord, SoundToken } from '@/types/sound'
import { randint, getIdentifier, weightedChoice, choice } from './utils'

interface GeneratorState {
  identifiersBySoundToken: Map<SoundToken, string[]>
  result: Array<RobotWord>
  n: number
}

type ExpressionState = GeneratorState

interface Expression {
  name: string
  getWeight: (opts: ExpressionState) => number
  generate: (opts: ExpressionState) => void
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

// Helper to generate a sequence with consistent identifiers for repeated tokens
function generateSequence(state: GeneratorState, tokens: SoundToken[]): void {
  // Track identifiers used in this sequence for consistency
  const sequenceIdentifiers = new Map<SoundToken, string>()

  for (const token of tokens) {
    // Reuse the same identifier for repeated tokens in this sequence
    let identifier = sequenceIdentifiers.get(token)
    if (!identifier) {
      identifier = getOrCreateIdentifier(state, token)
      sequenceIdentifiers.set(token, identifier)
    }

    state.result.push({
      soundToken: token,
      identifier,
    })
  }
}

const EXPRESSIONS: Expression[] = [
  // === CONTRAST PATTERNS ===
  {
    name: 'UpDown',
    getWeight: () => 1,
    generate: (state) => generateSequence(state, ['S', 's']),
  },
  {
    name: 'DownUp',
    getWeight: () => 1,
    generate: (state) => generateSequence(state, ['s', 'S']),
  },
  {
    name: 'HighLow',
    getWeight: () => 1,
    generate: (state) => generateSequence(state, ['B', 'b']),
  },
  {
    name: 'LowHigh',
    getWeight: () => 1,
    generate: (state) => generateSequence(state, ['b', 'B']),
  },
  {
    name: 'ArpeggioContrast',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['A', 'a'],
        ['a', 'A'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },

  // === BUILDING PATTERNS ===
  {
    name: 'Ascending',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['b', 'b', 'B'],
        ['b', 'b', 'b', 'B'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },
  {
    name: 'Descending',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['B', 'B', 'b'],
        ['B', 'B', 'B', 'b'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },
  {
    name: 'Pyramid',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['b', 'B', 'b'],
        ['B', 'b', 'B'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },
  {
    name: 'Staircase',
    getWeight: () => 1,
    generate: (state) => generateSequence(state, ['b', 'B', 'b', 'B']),
  },
  {
    name: 'Cascade',
    getWeight: () => 1,
    generate: (state) => generateSequence(state, ['B', 'b', 'B', 'b']),
  },

  // === RHYTHMIC PATTERNS ===
  {
    name: 'Stutter',
    getWeight: () => 1,
    generate: (state) => {
      const token = choice(['B', 'b']) as SoundToken
      generateSequence(state, [token, token, token])
    },
  },
  {
    name: 'Echo',
    getWeight: () => 1,
    generate: (state) => {
      const pairs = choice([
        ['B', '_', 'b'],
        ['S', '_', 's'],
      ]) as SoundToken[]
      generateSequence(state, pairs)
    },
  },
  {
    name: 'Morse',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['b', '_', 'b', '_', 'b', 'b', 'b'])
    },
  },
  {
    name: 'Heartbeat',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['B', 'b', '_', 'B', 'b'])
    },
  },
  {
    name: 'Gallop',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['b', 'B', 'B'],
        ['B', 'b', 'b'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },

  // === CHARACTER PATTERNS ===
  {
    name: 'Question',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['b', 'B', 'S'],
        ['b', 'b', 'S'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },
  {
    name: 'Exclamation',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['S', 'B', 'B'],
        ['A', 'B', 'B'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },
  {
    name: 'Confusion',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['w', 'z', 'w'],
        ['z', 'w', 'z'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },
  {
    name: 'Alarm',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['B', 'b', 'B', 'b'])
    },
  },
  {
    name: 'Thinking',
    getWeight: () => 1,
    generate: (state) => {
      const token = choice(['w', 'z']) as SoundToken
      generateSequence(state, [token, token, token])
    },
  },
  {
    name: 'Celebration',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['A', 'B', 'A'],
        ['S', 'B', 'S'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },

  // === MUSICAL PHRASES ===
  {
    name: 'CallResponse',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['B', 'B', '_', 'b', 'b'])
    },
  },
  {
    name: 'RisingQuestion',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['b', 'a', 's', 'S'])
    },
  },
  {
    name: 'FallingAnswer',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['B', 'A', 'S', 's'])
    },
  },
  {
    name: 'Interruption',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['w', 'w', 'B'],
        ['z', 'z', 'S'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },
  {
    name: 'Resolution',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['w', 'b', 'B'],
        ['z', 'a', 'A'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },

  // === TEXTURE PATTERNS ===
  {
    name: 'SmoothToRough',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['S', 'z', 'z'],
        ['A', 'w', 'w'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },
  {
    name: 'RoughToSmooth',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['z', 'z', 'S'],
        ['w', 'w', 'A'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },
  {
    name: 'Alternating',
    getWeight: () => 1,
    generate: (state) => {
      const pattern = choice([
        ['B', 'w', 'B', 'w'],
        ['S', 'z', 'S', 'z'],
      ]) as SoundToken[]
      generateSequence(state, pattern)
    },
  },

  // === COMPOUND PATTERNS ===
  {
    name: 'Countdown',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['B', 'B', 'B', 'b', 'b', 'b'])
    },
  },
  {
    name: 'Fanfare',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['b', 'B', 'B', 'A'])
    },
  },
  {
    name: 'Conversation',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['B', 'B', '_', 'b', '_', 'B', 'B', 'B', '_', 'b', 'b'])
    },
  },
  {
    name: 'RobotLaugh',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['B', 'b', 'B', 'b', 'B', 'b'])
    },
  },
  {
    name: 'BootSequence',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['b', '_', 'b', 'b', '_', 'b', 'b', 'b', '_', 'B'])
    },
  },

  // === EMOTIONAL ARCS ===
  {
    name: 'Surprise',
    getWeight: ({ result }) => (result.length > 2 ? 1 : 0), // Need room for silence at start
    generate: (state) => {
      generateSequence(state, ['_', '_', '_', 'B', 'S'])
    },
  },
  {
    name: 'Disappointment',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['B', 'b', 's'])
    },
  },
  {
    name: 'Discovery',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['w', 'w', 'w', 'A'])
    },
  },
  {
    name: 'Error',
    getWeight: () => 1,
    generate: (state) => {
      generateSequence(state, ['B', 'z', 'z', 'B'])
    },
  },

  // === Basic Wait for spacing ===
  {
    name: 'Wait',
    getWeight: ({ result, n }) => {
      // Don't wait at start, or after another wait
      if (result.length === 0) return 0
      if (result.length >= n - 1) return 0
      if (result[result.length - 1]?.soundToken === '_') return 0
      return 40
    },
    generate: (state) => {
      state.result.push({ soundToken: '_', identifier: getOrCreateIdentifier(state, '_') })
    },
  },
]

export function makeBeepBoopsUsingFancyGrammarAlgorithm(): RobotWord[] {
  // This is a RobotWord limit, not an expression limit
  const n = randint(1, 15)
  const result = new Array<RobotWord>()
  const identifiersBySoundToken = new Map<SoundToken, string[]>()

  const state: GeneratorState = {
    n,
    result,
    identifiersBySoundToken,
  }

  while (result.length < n) {
    const expr = weightedChoice(
      EXPRESSIONS,
      EXPRESSIONS.map((e) => e.getWeight(state)),
    )
    expr.generate(state)
  }

  return result
}
