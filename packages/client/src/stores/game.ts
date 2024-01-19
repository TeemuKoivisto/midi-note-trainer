import { derived, get, writable } from 'svelte/store'

import { midiRange } from './midi'

import { persist } from './persist'

class GuessGame {
  notes: number[]
  times: number[] = []
  correct = 0
  idx = 0
  timing: number

  constructor(notes: number[]) {
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

export const currentGame = writable<GuessGame | undefined>(undefined)
// scores?

export const gameActions = {
  playGuessNotes(amount = 10) {
    const notes: number[] = []
    const range = get(midiRange)
    for (let i = 0; i < amount; i += 1) {
      let attempts = 0,
        val: number = range[1]
      // Try having all values unique
      while (attempts < 5) {
        attempts += 1
        val = range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1))
        if (!notes.includes(val)) {
          attempts = 5
        }
      }
      notes.push(val)
    }
    const game = new GuessGame(notes)
    currentGame.set(game)
    return game
  },
  clearGame() {
    currentGame.set(undefined)
  }
}
