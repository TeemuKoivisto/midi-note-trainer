export const keys = {
  major: {
    C: { num: 0 },
    F: { acc: 'b', num: 1 },
    Bb: { acc: 'b', num: 2 },
    Eb: { acc: 'b', num: 3 },
    Ab: { acc: 'b', num: 4 },
    Db: { acc: 'b', num: 5 },
    Gb: { acc: 'b', num: 6 },
    Cb: { acc: 'b', num: 7 },
    G: { acc: '#', num: 1 },
    D: { acc: '#', num: 2 },
    A: { acc: '#', num: 3 },
    E: { acc: '#', num: 4 },
    B: { acc: '#', num: 5 },
    'F#': { acc: '#', num: 6 },
    'C#': { acc: '#', num: 7 }
  },
  minor: {
    A: { num: 0 },
    D: { acc: 'b', num: 1 },
    G: { acc: 'b', num: 2 },
    C: { acc: 'b', num: 3 },
    F: { acc: 'b', num: 4 },
    Bb: { acc: 'b', num: 5 },
    Eb: { acc: 'b', num: 6 },
    Ab: { acc: 'b', num: 7 },
    E: { acc: '#', num: 1 },
    B: { acc: '#', num: 2 },
    'F#': { acc: '#', num: 3 },
    'C#': { acc: '#', num: 4 },
    'G#': { acc: '#', num: 5 },
    'D#': { acc: '#', num: 6 },
    'A#': { acc: '#', num: 7 }
  }
}

export class GuessKeys {
  type: 'major' | 'minor'
  keys: string[]
  times: number[] = []
  correct = 0
  latestGuess: { target: string; guessed: string } = { target: '', guessed: '' }
  idx = 0
  timing: number

  constructor(type: 'major' | 'minor', count = 10) {
    this.type = type
    this.timing = performance.now()
    const scales: string[] = []
    const available = Object.keys(keys[type])
    for (let i = 0; i < count; i += 1) {
      const idx = Math.floor(Math.random() * available.length)
      const val = available.splice(idx, 1)
      if (val.length > 0) {
        scales.push(val[0])
      }
    }
    this.keys = scales
  }
  get current() {
    return this.keys[this.idx]
  }
  get ended() {
    return this.keys.length === this.idx + 1
  }
  get avgTime() {
    let avgMs = 0
    for (let i = 0; i < this.times.length; i += 1) {
      avgMs += this.times[i]
    }
    return Math.round(avgMs / 10 / this.times.length) / 100
  }
  guess(key: string) {
    const result = this.current === key
    if (result) {
      this.correct += 1
    }
    this.latestGuess = { target: this.current, guessed: key }
    this.idx += 1
    this.times.push(performance.now() - this.timing)
    return result
  }
  startTime() {
    this.timing = performance.now()
  }
}
