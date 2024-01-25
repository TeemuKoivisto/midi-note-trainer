import { derived, get, writable } from 'svelte/store'

import { midiActions, midiRange, piano } from './midi'
import { scoreActions } from './score'

import { GuessGame } from '$utils/guess_game'
import { getNote } from '$utils/midi'
import { persist } from './persist'

export type GuessState = 'waiting' | 'correct' | 'wrong' | 'ended'

export const guessState = writable<GuessState>('waiting')
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
    if (type === 'notes') {
      scoreActions.setTarget(getNote(game.current))
    } else if (type === 'pitches') {
      midiActions.setSound(true)
      // TODO doesnt work if sound is not currently on
      get(piano)?.noteOn(game.current, 80)
    }
    scoreActions.clearPlayed()
    guessState.set('waiting')
    currentGame.set(game)
    return game
  },
  updateState(state: GuessState) {
    guessState.set(state)
  },
  clearGame() {
    currentGame.set(undefined)
    guessState.set('waiting')
    scoreActions.clearScore()
  }
}
