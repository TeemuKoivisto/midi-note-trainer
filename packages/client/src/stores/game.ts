import { derived, get, writable } from 'svelte/store'
import { chordsFromJSON, createScale, createTriadChords } from '@/chords-and-scales'

import { inputsActions, midiRange, piano } from './inputs'
import { persist } from './persist'
import { scaleData, scoreActions } from './score'

import { GuessChords, GuessKeys, GuessNotes } from '@/games'

import type { Chord } from '@/chords-and-scales'
import type { GameInstance, GameType, GameConstructors } from '@/games'

export type GuessState = 'waiting' | 'correct' | 'wrong' | 'ended'
export interface SelectedChord extends Chord {
  selected: boolean
}

interface GameOptions {
  count: number
  duplicates: boolean
  autoplay: boolean
  waitSeconds: number
}

const DEFAULT_OPTIONS = {
  count: 10,
  duplicates: true,
  autoplay: true,
  waitSeconds: 3
}

const chords = chordsFromJSON()

export const guessState = writable<GuessState>('waiting')
export const gameOptions = persist(writable<GameOptions>(DEFAULT_OPTIONS), {
  key: 'game-options'
})
export const currentGame = writable<GameInstance | undefined>(undefined)
export const selectedChords = writable<SelectedChord[]>(
  chordsFromJSON().map(c => ({ ...c, selected: true }))
)

export const gameActions = {
  play<K extends GameType>(...args: GameConstructors[K]): GameInstance {
    let game
    const scale = get(scaleData)
    const range = get(midiRange)
    const opts = get(gameOptions)
    const baseOpts = {
      scale,
      range,
      duplicates: opts.duplicates,
      count: opts.count
    }
    let keyAndScale = [scale.key, scale.scale]
    if (args[0] === 'notes') {
      game = new GuessNotes(args[0], baseOpts)
      scoreActions.setTarget([scoreActions.getNote(game.current)])
      get(piano)?.noteOn(game.current)
    } else if (args[0] === 'pitches') {
      game = new GuessNotes(args[0], baseOpts)
      scoreActions.setTarget()
      inputsActions.setInputValue('useSound', true)
      get(piano)?.noteOn(game.current)
    } else if (args[0] === 'keys-major' || args[0] == 'keys-minor') {
      game = new GuessKeys(args[0], baseOpts)
      keyAndScale = [game.current, args[0] === 'keys-major' ? 'major' : 'minor']
    } else if (args[0] === 'chords-play' || args[0] === 'chords-write') {
      game = new GuessChords(args[0], baseOpts, args[1])
    } else if (args[0] === 'chords-diatonic') {
      const chords = createTriadChords(scale.triads).map((c, idx) => ({
        ...c,
        allowed: new Set([scale.scaleNotes[idx].semitones])
      }))
      game = new GuessChords(args[0], baseOpts, {
        chords
      })
    } else {
      throw Error('Unknown game type: ' + args[0])
    }
    if (typeof game.current !== 'number' && typeof game.current !== 'string') {
      get(piano)?.playChord(game.current.notes.map(n => n.midi))
      scoreActions.setTarget(game.current.notes)
    }
    scoreActions.setKeyAndScale(keyAndScale[0], keyAndScale[1])
    scoreActions.clearPlayed()
    guessState.set('waiting')
    currentGame.set(game)
    return game
  },
  updateState(state: GuessState) {
    guessState.set(state)
  },
  setOptionValue<K extends keyof GameOptions>(key: K, val: GameOptions[K]) {
    gameOptions.update(v => ({ ...v, [key]: val }))
  },
  toggleChord(chord: SelectedChord) {
    selectedChords.update(v =>
      v.map(c => (c.name === chord.name ? { ...c, selected: !c.selected } : c))
    )
  },
  toggleAllChords(selected: boolean) {
    selectedChords.update(v => v.map(c => ({ ...c, selected })))
  },
  nextGuess() {
    const game = get(currentGame)
    if (game?.ended) {
      guessState.set('ended')
    } else if (game instanceof GuessNotes) {
      if (game.type === 'notes') {
        scoreActions.setTarget([scoreActions.getNote(game.current)])
      } else {
        scoreActions.setTarget()
      }
      scoreActions.clearPlayed()
      get(piano)?.noteOn(game.current)
      gameActions.updateState('waiting')
      game.startTime()
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
  clearGame(clearOptions = false) {
    const game = get(currentGame)
    if (game) {
      scoreActions.setKeyAndScale(game.baseOptions.scale.key, game.baseOptions.scale.scale)
    }
    if (clearOptions) {
      gameOptions.set(DEFAULT_OPTIONS)
    }
    currentGame.set(undefined)
    guessState.set('waiting')
    scoreActions.clearScore()
  }
}
