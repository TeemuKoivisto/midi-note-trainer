import { derived, get, writable } from 'svelte/store'
import { chords, createScale } from '@/chords-and-scales'

import { midiActions, midiRange, midiRangeNotes, piano } from './inputs'
import { persist } from './persist'
import { scoreActions } from './score'

import { getNote } from '$utils/getNote'
import { GuessKeys } from '$utils/guess_keys'
import { GuessChords } from '$utils/guess_chords'
import { GuessNotes } from '$utils/guess_notes'

export type GuessState = 'waiting' | 'correct' | 'wrong' | 'ended'

export const guessState = writable<GuessState>('waiting')
export const currentGame = writable<GuessNotes | GuessKeys | GuessChords | undefined>(undefined)
// scores?

export const gameActions = {
  playGuessNotes(type: 'notes' | 'pitches', amount = 10) {
    const game = new GuessNotes(type, get(midiRange), amount)
    if (type === 'notes') {
      scoreActions.setTarget([getNote(game.current)])
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
    const range = get(midiRangeNotes)
    if ('err' in scale) {
      return console.error(scale)
    }
    const game = new GuessChords(scale.data, Array.from(chords.entries()), range, count)
    scoreActions.setTarget(game.currentNotes)
    scoreActions.setKey(scale.data.key)
    scoreActions.clearPlayed()
    guessState.set('waiting')
    currentGame.set(game)
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
