import { derived, get, writable } from 'svelte/store'

import { midiRange } from './midi'

import { GuessGame } from '$utils/guess_game'
import { persist } from './persist'

export const currentGame = writable<GuessGame | undefined>(undefined)
// scores?

export const gameActions = {
  playGuessNotes(type: 'notes' | 'pitches', amount = 10) {
    const notes: number[] = []
    const range = get(midiRange)
    for (let i = 0; i < amount; i += 1) {
      let attempts = 0,
        val = range[1]
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
    const game = new GuessGame(type, notes)
    currentGame.set(game)
    return game
  },
  clearGame() {
    currentGame.set(undefined)
  }
}
