import { derived, get, writable } from 'svelte/store'
import { chords, createScale } from '@/chords-and-scales'

import { midiActions, midiRange, piano } from './inputs'
import { scoreActions } from './score'

import { GuessNotes } from '$utils/guess_notes'
import { getNote } from '$utils/midi'
import { GuessKeys } from '$utils/guess_keys'
import { persist } from './persist'
import { GuessChords } from '$utils/guess_chords'

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
      scoreActions.setTarget()
      midiActions.setInputValue('useSound', true)
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
    scoreActions.setTarget()
    scoreActions.clearPlayed()
    guessState.set('waiting')
    currentGame.set(game)
    return game
  },
  playGuessChords(count = 10) {
    const scale = createScale('C', 'major')
    if ('data' in scale) {
      const game = new GuessChords(scale.data, Array.from(chords.entries()), count)
    }
    // scoreActions.setKey(game.current)
    scoreActions.setTarget()
    scoreActions.clearPlayed()
    guessState.set('waiting')
    // currentGame.set(game)
    // return game
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
