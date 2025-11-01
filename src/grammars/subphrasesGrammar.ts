import type { RobotWord, SoundToken } from '@/types/sound'

function randint(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max + 1 - min))
}

const counts = [0, 0, 0]
for (let i = 0; i < 100; i++) {
  counts[randint(0, 2)]! += 1
}
console.log(counts)

function choice<T>(arr: T[]): T {
  const i = randint(0, arr.length - 1)
  return arr[i]!
}

let nextId = 1
function getIdentifier(): string {
  return `${nextId++}`
}

function rpt<T>(s: T[], range: [number, number] = [1, 3]): T[] {
  const result = new Array<T>()
  const n = randint(range[0], range[1])
  for (let i = 0; i < n; i++) {
    result.push(s[i % s.length]!)
  }
  return result
}

function seq(s: SoundToken): RobotWord[] {
  const id1 = getIdentifier()
  const id2 = getIdentifier()
  return rpt<RobotWord>(
    [
      { soundToken: s, identifier: id1 },
      { soundToken: s, identifier: id2 },
    ],
    [1, choice([1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3])],
  )
}

export const ALL_TOKENS: SoundToken[] = ['S', 's', 'A', 'a', 'B', 'b', 'w', 'z', '_']

export function ramble(): RobotWord[] {
  const n = randint(5, 11)
  const result = new Array<RobotWord>()

  const identifiersBySoundToken = new Map<SoundToken, string[]>()

  function getOrCreateIdentifier(s: SoundToken): string {
    const arr = identifiersBySoundToken.get(s) || []
    if (arr.length >= 3) {
      return choice(arr)
    } else {
      arr.push(getIdentifier())
      identifiersBySoundToken.set(s, arr)
      return arr[arr.length - 1]!
    }
  }

  for (let i = 0; i < n; i++) {
    const opts =
      i === 0 || i === n - 1 || (i > 0 && result[result.length - 1]?.soundToken === '_')
        ? ALL_TOKENS.slice(0, ALL_TOKENS.length - 1)
        : ALL_TOKENS.concat(['_', '_', '_', '_', '_', '_'])

    const tok = choice(opts)

    if (tok === '_') {
      result.push({ soundToken: tok, identifier: getOrCreateIdentifier(tok) })
    } else {
      result.push(...seq(tok))
    }
  }

  return result
}
