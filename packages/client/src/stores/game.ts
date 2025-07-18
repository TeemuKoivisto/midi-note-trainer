import { derived, get, writable } from 'svelte/store'
import { chordsFromJSON, createScale, createTrichords } from '@/chords-and-scales'

import { inputsActions, midiRange, piano } from './inputs'
import { persist } from './persist'
import { scaleData, scoreActions } from './score'

import { GuessChords, GuessKeys, GuessNotes } from '@/games'

import type { Chord } from '@/chords-and-scales'
import type { GameInstance, OptionsMap } from '@/games'

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
  waitSeconds: 1.5
}

export const guessState = writable<GuessState>('waiting')
export const gameOptions = persist(writable<GameOptions>(DEFAULT_OPTIONS), {
  key: 'game-options'
})
export const currentGame = writable<GameInstance | undefined>(undefined)
export const selectedChords = writable<SelectedChord[]>(
  chordsFromJSON().map(c => ({
    ...c,
    selected: true
  }))
)

type PlayArgs = { [K in keyof OptionsMap]: [type: K, options: OptionsMap[K]] }[keyof OptionsMap]

export const gameActions = {
  play(...[type, options]: PlayArgs): GameInstance {
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
    if (type === 'notes') {
      game = new GuessNotes(type, baseOpts)
      scoreActions.setTarget([scoreActions.getNote(game.current)])
      inputsActions.play(game.current, 80)
    } else if (type === 'pitches') {
      game = new GuessNotes(type, baseOpts)
      scoreActions.setTarget()
      inputsActions.setInputValue('useSound', true)
      inputsActions.play(game.current, 80)
    } else if (type === 'keys-major' || type == 'keys-minor') {
      game = new GuessKeys(type, baseOpts)
      keyAndScale = [game.current, type === 'keys-major' ? 'major' : 'minor']
    } else if (type === 'chords-play' || type === 'chords-write') {
      game = new GuessChords(type, baseOpts, options)
    } else if (type === 'chords-diatonic') {
      const chords = createTrichords(scale.trichords).map((c, idx) => ({
        ...c,
        allowed: new Set([scale.scaleNotes[idx].semitones])
      }))
      game = new GuessChords(type, baseOpts, {
        chords
      })
    } else {
      throw Error('Unknown game type: ' + type)
    }
    if (typeof game.current !== 'number' && typeof game.current !== 'string') {
      inputsActions.play(
        game.current.notes.map(n => n.midi),
        80
      )
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
  toggleChords(cb: (c: SelectedChord) => boolean) {
    selectedChords.update(v => v.map(c => ({ ...c, selected: cb(c) })))
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
      inputsActions.play(game.current, 80)
      gameActions.updateState('waiting')
      game.startTime()
    } else if (game instanceof GuessChords) {
      scoreActions.setTarget(game.current.notes)
      scoreActions.clearPlayed()
      inputsActions.play(
        game?.current.notes.map(n => n.midi),
        80
      )
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
