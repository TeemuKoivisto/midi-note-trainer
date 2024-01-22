export class GuessGame {
  type: 'notes' | 'pitches'
  notes: number[]
  times: number[] = []
  correct = 0
  idx = 0
  timing: number

  constructor(type: 'notes' | 'pitches', notes: number[]) {
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
    this.idx += 1
    this.times.push(performance.now() - this.timing)
    return result
  }
  startTime() {
    this.timing = performance.now()
  }
}