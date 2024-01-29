import { chords, createChord } from '@/chords-and-scales'

import type { Chord, Scale, ScaleNote } from '@/chords-and-scales'

export class GuessChords {
  scale: Scale
  chords: [string, ScaleNote[]][]
  times: number[] = []
  correct = 0
  latestGuess: { target: string; guessed: string } = { target: '', guessed: '' }
  idx = 0
  timing: number

  constructor(scale: Scale, chords: [string, Chord][], count = 10) {
    this.scale = scale
    const randomChords: [string, Chord][] = []
    const available: [string, Chord][] = chords.map(v => [v[0], { ...v[1] }])
    for (let i = 0; i < count; i += 1) {
      const idx = Math.floor(Math.random() * available.length)
      const val = available.splice(idx, 1)
      if (val.length > 0) {
        randomChords.push(val[0])
      }
    }
    // const c = chords.find(([k, c]) => k === 'm7b5')
    // if (c) {
    //   createChord(0, scale, c[1])
    // }
    // this.chords = []
    this.chords = randomChords.map(c => [c[0], createChord(0, scale, c[1])])
    console.log('CHORDS', this.chords)
    this.timing = performance.now()
  }
  get current() {
    return this.chords[this.idx]
  }
  get ended() {
    return this.chords.length === this.idx + 1
  }
  get avgTime() {
    let avgMs = 0
    for (let i = 0; i < this.times.length; i += 1) {
      avgMs += this.times[i]
    }
    return Math.round(avgMs / 10 / this.times.length) / 100
  }
  guess(key: string) {
    const result = this.current[0] === key
    if (result) {
      this.correct += 1
    }
    this.latestGuess = { target: this.current[0], guessed: key }
    this.idx += 1
    this.times.push(performance.now() - this.timing)
    return result
  }
  startTime() {
    this.timing = performance.now()
  }
}
