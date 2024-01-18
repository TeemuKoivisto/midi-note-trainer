import { derived, get, writable } from 'svelte/store'

import { midiRange } from './midi'

import { persist } from './persist'

class GuessGame {
  notes: number[]
  correct = 0
  idx = 0
  constructor(notes: number[]) {
    this.notes = notes
  }
  get current() {
    return this.notes[this.idx]
  }
  get ended() {
    return this.notes.length === this.idx + 1
  }
  guess(note: number) {
    const result = this.current === note
    if (result) {
      this.correct += 1
    }
    this.idx += 1
    return result
  }
  next() {
    this.idx += 1
  }
}

export const currentGame = writable<GuessGame | undefined>(undefined)
// scores?

export const gameActions = {
  playGuessNotes(amount = 10) {
    const notes: number[] = []
    const range = get(midiRange)
    console.log('range', range)
    for (let i = 0; i < amount; i += 1) {
      notes.push(range[0] + Math.floor(Math.random() * (range[1] - range[0])))
    }
    const game = new GuessGame(notes)
    console.log('new game ', notes)
    currentGame.set(game)
    return game
  },
  clearGame() {
    currentGame.set(undefined)
  }
}
