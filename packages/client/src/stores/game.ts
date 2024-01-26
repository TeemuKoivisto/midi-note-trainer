import { derived, get, writable } from 'svelte/store'

import { midiActions, midiRange, piano } from './inputs'
import { scoreActions } from './score'

import { GuessNotes } from '$utils/guess_notes'
import { getNote } from '$utils/midi'
import { GuessKeys } from '$utils/guess_keys'
import { persist } from './persist'

export type GuessState = 'waiting' | 'correct' | 'wrong' | 'ended'

export const guessState = writable<GuessState>('waiting')
export const currentGame = writable<GuessNotes | GuessKeys | undefined>(undefined)
// scores?

export const gameActions = {
  playGuessNotes(type: 'notes' | 'pitches', amount = 10) {
    const game = new GuessNotes(type, get(midiRange), amount)
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
  playGuessKeys(type: 'major' | 'minor', count = 10) {
    const game = new GuessKeys(type, count)
    scoreActions.setKey(game.current)
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
