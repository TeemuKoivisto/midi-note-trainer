import { derived, get, writable } from 'svelte/store'
import { chords, createScale } from '@/chords-and-scales'

import { inputsActions, midiRange, midiRangeNotes, piano } from './inputs'
import { persist } from './persist'
import { scaleData, scoreActions } from './score'

import { getNote } from '$utils/getNote'
import { GuessKeys } from '$utils/guess_keys'
import { GuessChords } from '$utils/guess_chords'
import { GuessNotes } from '$utils/guess_notes'
import { PlayChordsGame } from '$utils/play_chords'

export type GuessState = 'waiting' | 'correct' | 'wrong' | 'ended'

export const guessState = writable<GuessState>('waiting')
export const currentGame = writable<
  GuessNotes | GuessKeys | GuessChords | PlayChordsGame | undefined
>(undefined)
// scores?

export const gameActions = {
  playGuessNotes(type: 'notes' | 'pitches', amount = 10) {
    const game = new GuessNotes(type, get(midiRange), amount)
    if (type === 'notes') {
      scoreActions.setTarget([getNote(game.current)])
    } else if (type === 'pitches') {
      scoreActions.setTarget()
      inputsActions.setInputValue('useSound', true)
      get(piano)?.noteOn(game.current)
    }
    scoreActions.clearPlayed()
    guessState.set('waiting')
    currentGame.set(game)
    return game
  },
  playGuessKeys(type: 'major' | 'minor', count = 10) {
    const game = new GuessKeys(type, count)
    scoreActions.setKeyAndScale(game.current, type)
    scoreActions.setTarget()
    scoreActions.clearPlayed()
    guessState.set('waiting')
    currentGame.set(game)
    return game
  },
  playGuessChords(type: 'write' | 'play', count = 10) {
    // const scale = createScale('B', 'enigmaticMajor')
    const scale = get(scaleData)
    const range = get(midiRangeNotes)
    if ('err' in scale) {
      return console.error(scale)
    }
    let game
    if (type === 'write') {
      game = new GuessChords(type, scale, Array.from(chords.entries()), range, count)
    } else {
      const basicChords = Array.from(chords.entries()).filter(c => c[0] === 'maj' || c[0] === 'm')
      game = new PlayChordsGame(scale, basicChords, range, count)
    }
    get(piano)?.playChord(game?.current.notes.map(n => n.midi))
    scoreActions.setKeyAndScale(scale.key, scale.scale)
    scoreActions.setTarget(game.current.notes)
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
