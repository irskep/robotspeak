export function randint(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max + 1 - min))
}

export function choice<T>(arr: T[]): T {
  const i = randint(0, arr.length - 1)
  return arr[i]!
}

export function weightedChoice<T>(arr: T[], weights: number[]): T {
  if (arr.length !== weights.length) {
    throw new Error('Array and weights must be the same length')
  }
  if (arr.length === 0) {
    throw new Error('Array must not be empty')
  }

  let total = 0
  for (const w of weights) {
    if (w < 0 || !isFinite(w)) {
      throw new Error('Weights must be nonnegative and finite')
    }
    total += w
  }

  if (total === 0) {
    throw new Error('At least one weight must be positive')
  }

  let r = Math.random() * total
  for (let i = 0; i < arr.length; i++) {
    const w = weights[i]!
    if (w === 0) continue
    if (r < w) return arr[i]!
    r -= w
  }

  // Fallback for floating-point edge cases
  return arr[arr.length - 1]!
}

let nextId = 1
export function getIdentifier(): string {
  return `${nextId++}`
}
