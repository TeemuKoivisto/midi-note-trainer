import { derived, get, writable } from 'svelte/store'
import { chordsFromJSON, createScale, createTriadChords } from '@/chords-and-scales'

import { inputsActions, midiRange, midiRangeNotes, piano } from './inputs'
import { persist } from './persist'
import { scaleData, scoreActions } from './score'

import { GuessKeys } from '$games/GuessKeys'
import { GuessChords } from '$games/GuessChords'
import { GuessNotes } from '$games/GuessNotes'

export type GuessState = 'waiting' | 'correct' | 'wrong' | 'ended'
export type GameType =
  | 'notes'
  | 'pitches'
  | 'keys-major'
  | 'keys-minor'
  | 'chords-write'
  | 'chords-play'
  | 'chords-diatonic'
export type GameInstance = GuessNotes | GuessKeys | GuessChords

const chords = chordsFromJSON()

export const guessState = writable<GuessState>('waiting')
export const playNextTimeoutMs = writable<number>(-1)
export const currentGame = writable<GameInstance | undefined>(undefined)
// scores?

export const gameActions = {
  play(type: GameType, count = 10): GameInstance {
    let game
    if (type === 'notes') {
      game = new GuessNotes(type, get(midiRange), count)
      scoreActions.setTarget([scoreActions.getNote(game.current)])
      console
    } else if (type === 'pitches') {
      game = new GuessNotes(type, get(midiRange), count)
      scoreActions.setTarget()
      inputsActions.setInputValue('useSound', true)
      get(piano)?.noteOn(game.current)
    } else if (type === 'keys-major' || type == 'keys-minor') {
      game = new GuessKeys(type, {
        scale: get(scaleData),
        range: get(midiRangeNotes),
        duplicates: true,
        count
      })
      scoreActions.setKeyAndScale(game.current, type === 'keys-major' ? 'major' : 'minor')
      playNextTimeoutMs.set(3000)
    } else if (type === 'chords-play') {
      const basicChords = chords.filter(c => c.suffixes[0] === 'maj' || c.suffixes[0] === 'm')
      game = new GuessChords(type, {
        scale: get(scaleData),
        chords: basicChords,
        range: get(midiRangeNotes),
        count
      })
      playNextTimeoutMs.set(3000)
    } else if (type === 'chords-write') {
      game = new GuessChords(type, {
        scale: get(scaleData),
        chords,
        range: get(midiRangeNotes),
        count
      })
      playNextTimeoutMs.set(3000)
    } else if (type === 'chords-diatonic') {
      const scale = get(scaleData)
      // scoreActions.setKeyAndScale(scale.key, scale.scale)
      const chords = createTriadChords(scale.triads).map((c, idx) => ({
        ...c,
        allowed: new Set([scale.scaleNotes[idx].semitones])
      }))
      game = new GuessChords(type, {
        scale: get(scaleData),
        chords,
        range: get(midiRangeNotes),
        count
      })
    } else {
      throw Error('Unknown game type: ' + type)
    }
    if (typeof game.current !== 'number' && typeof game.current !== 'string') {
      get(piano)?.playChord(game.current.notes.map(n => n.midi))
      scoreActions.setTarget(game.current.notes)
    }
    scoreActions.clearPlayed()
    guessState.set('waiting')
    currentGame.set(game)
    return game
  },
  updateState(state: GuessState) {
    guessState.set(state)
  },
  setAutoPlayNext(val?: number) {
    if (val === undefined) {
      playNextTimeoutMs.set(-1)
    } else {
      playNextTimeoutMs.set(val)
    }
  },
  nextGuess() {
    const game = get(currentGame)
    if (game?.ended) {
      guessState.set('ended')
      console.log('ended')
    } else if (game instanceof GuessChords) {
      scoreActions.setTarget(game.current.notes)
      scoreActions.clearPlayed()
      get(piano)?.playChord(game?.current.notes.map(n => n.midi))
      guessState.set('waiting')
      game.startTime()
    } else if (game instanceof GuessKeys) {
      scoreActions.setKey(game.current)
      guessState.set('waiting')
      game.startTime()
    }
  },
  clearGame() {
    currentGame.set(undefined)
    guessState.set('waiting')
    scoreActions.clearScore()
  }
}
