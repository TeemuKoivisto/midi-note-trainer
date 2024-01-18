import { derived, get, writable } from 'svelte/store'
import { WebMidi } from 'webmidi'

import { midiRange } from './midi'

import { persist } from './persist'

import type { Input } from 'webmidi'
import type { Result } from '@/types'

class GuessGame {
  notes: number[]
  idx = 0
  constructor(notes: number[]) {
    this.notes = notes
  }
  get current() {
    return this.notes[this.idx]
  }
  get ended() {
    return this.notes.length === this.idx - 1
  }
  guess(note: number) {
    const result = this.current === note
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
    for (let i = 0; i < amount; i += 1) {
      notes.push(range[0] + Math.floor(Math.random() * (range[1] - range[0])))
    }
    const game = new GuessGame(notes)
    console.log('new game ', notes)
    currentGame.set(game)
    return game
  },
  endGame() {
    currentGame.set(undefined)
  }
}
