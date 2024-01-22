import { derived, get, writable } from 'svelte/store'

import { midiActions, midiRange, piano } from './midi'

import { GuessGame } from '$utils/guess_game'
import { getNote } from '$utils/midi'
import { persist } from './persist'

import type { Note } from '@/types'

type GuessState = 'waiting' | 'correct' | 'wrong' | 'ended'

export const target = writable<Note | undefined>(undefined)
export const played = writable<(Note & { correct: boolean }) | undefined>(undefined)
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
      target.set({ ...getNote(game.current), value: game.current })
    } else if (type === 'pitches') {
      midiActions.setSound(true)
      // TODO doesnt work if sound is not currently on
      get(piano)?.noteOn(game.current, 80)
    }
    guessState.set('waiting')
    currentGame.set(game)
    return game
  },
  updateState(state: GuessState) {
    guessState.set(state)
  },
  setTarget(val?: Note) {
    target.set(val)
  },
  setPlayed(val?: Note & { correct: boolean }) {
    played.set(val)
  },
  clearGame() {
    currentGame.set(undefined)
    guessState.set('waiting')
    target.set(undefined)
    played.set(undefined)
  }
}
