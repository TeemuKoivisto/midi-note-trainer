import type { Scale } from '@/chords-and-scales'
import type { Note } from '@/types'

export type GameType =
  | 'notes'
  | 'pitches'
  | 'keys-major'
  | 'keys-minor'
  | 'chords-write'
  | 'chords-play'
  | 'chords-diatonic'

export interface BaseOptions {
  scale: Scale
  range: [Note, Note]
  duplicates: boolean
  count: number
}

export class Game<T> {
  type: GameType
  options: BaseOptions

  sampled: T[]
  played = new Set<number>()
  guesses: T[] = []

  protected times: number[] = []
  correct = 0
  protected guessed = 0
  protected idx = 0
  protected timing: number

  constructor(type: GameType, data: T[], opts: BaseOptions) {
    this.type = type
    this.options = opts
    const sampled: T[] = []
    const { count } = opts
    const available = data.map(v => (typeof v === 'object' && v !== null ? { ...v } : v))
    for (let i = 0; i < count; i += 1) {
      const idx = Math.floor(Math.random() * available.length)
      if (opts.duplicates) {
        sampled.push(available[idx])
      } else {
        const val = available.splice(idx, 1)
        if (val.length > 0) {
          sampled.push(val[0])
        }
      }
    }
    console.log(sampled)
    this.type = type
    this.sampled = sampled
    this.timing = performance.now()
  }
  get current() {
    return this.sampled[this.idx]
  }
  get latestGuess(): { target: T | undefined; guessed: T | undefined } {
    const target = this.sampled[this.idx - 1]
    const guessed = this.guesses[this.idx - 1]
    return { target, guessed }
  }
  get ended() {
    return this.sampled.length === this.idx + 1
  }
  get avgTime() {
    let avgMs = 0
    for (let i = 0; i < this.times.length; i += 1) {
      avgMs += this.times[i]
    }
    return Math.round(avgMs / 10 / this.times.length) / 100
  }
  protected addGuessed(value: T, result: boolean) {
    this.guesses.push(value)
    if (result) {
      this.correct += 1
    }
    this.idx += 1
    this.times.push(performance.now() - this.timing)
    return result
  }
  guess(value: T): boolean {
    return false
  }
  startTime() {
    this.timing = performance.now()
  }
}
