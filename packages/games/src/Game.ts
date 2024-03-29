import { GameType, BaseOptions } from './types'

export class Game<T extends GameType, V, G> {
  type: T
  baseOptions: BaseOptions

  data: V[]
  sampled: V[]
  guesses: G[] = []

  times: number[] = []
  correct = 0
  protected guessed = 0
  idx = 0
  timing: number

  constructor(type: T, data: V[], opts: BaseOptions) {
    this.type = type
    this.data = data
    this.baseOptions = opts
    const sampled: V[] = []
    const { count } = opts
    const available = data.map(v => (typeof v === 'object' && v !== null ? { ...v } : v))
    let withReplacement = opts.duplicates
    if (!opts.duplicates && count > available.length) {
      console.warn(
        `Trying to create game with count ${count} larger than available unique values ${data.length}`
      )
      withReplacement = true
    }
    for (let i = 0; i < count; i += 1) {
      const idx = Math.floor(Math.random() * available.length)
      if (withReplacement) {
        sampled.push(available[idx])
      } else {
        const val = available.splice(idx, 1)
        if (val.length > 0) {
          sampled.push(val[0])
        }
      }
    }
    this.sampled = sampled
    this.timing = performance.now()
  }
  get current() {
    return this.sampled[this.idx]
  }
  get latestGuess(): { target: V | undefined; guessed: G | undefined } {
    const target = this.sampled[this.idx - 1]
    const guessed = this.guesses[this.idx - 1]
    return { target, guessed }
  }
  get ended() {
    return this.sampled.length < this.idx + 1
  }
  get avgTime() {
    let avgMs = 0
    for (let i = 0; i < this.times.length; i += 1) {
      avgMs += this.times[i]
    }
    return Math.round(avgMs / 10 / this.times.length) / 100
  }
  protected addGuessed(value: G, result: boolean) {
    this.guesses.push(value)
    if (result) {
      this.correct += 1
    }
    this.idx += 1
    this.times.push(performance.now() - this.timing)
    return result
  }
  guess(_value: G): boolean {
    return false
  }
  startTime() {
    this.timing = performance.now()
  }
}
