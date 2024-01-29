export class GuessNotes {
  type: 'notes' | 'pitches'
  notes: number[]
  times: number[] = []
  correct = 0
  guessed = 0
  idx = 0
  timing: number

  constructor(type: 'notes' | 'pitches', range: [number, number], count = 10) {
    const notes: number[] = []
    const available = Array.from(new Array(range[1] - range[0])).map((_, i) => range[0] + i)
    for (let i = 0; i < count; i += 1) {
      const idx = Math.floor(Math.random() * available.length)
      const val = available.splice(idx, 1)
      if (val.length > 0) {
        notes.push(val[0])
      }
    }
    this.type = type
    this.notes = notes
    this.timing = performance.now()
  }
  get current() {
    return this.notes[this.idx]
  }
  get ended() {
    return this.notes.length === this.idx + 1
  }
  get avgTime() {
    let avgMs = 0
    for (let i = 0; i < this.times.length; i += 1) {
      avgMs += this.times[i]
    }
    return Math.round(avgMs / 10 / this.times.length) / 100
  }
  guess(note: number) {
    const result = this.current === note
    if (result) {
      this.correct += 1
    }
    this.guessed = note
    this.idx += 1
    this.times.push(performance.now() - this.timing)
    return result
  }
  startTime() {
    this.timing = performance.now()
  }
}
