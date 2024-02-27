import { derived, get, writable } from 'svelte/store'
import { chordsFromJSON, createScale, createTriadChords } from '@/chords-and-scales'

import { inputsActions, midiRange, piano } from './inputs'
import { persist } from './persist'
import { scaleData, scoreActions } from './score'

import { GuessChords, GuessKeys, GuessNotes, type GameInstance, type GameType } from '@/games'

export type GuessState = 'waiting' | 'correct' | 'wrong' | 'ended'

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
// scores?

export const gameActions = {
  play(type: GameType): GameInstance {
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
      get(piano)?.noteOn(game.current)
    } else if (type === 'pitches') {
      game = new GuessNotes(type, baseOpts)
      scoreActions.setTarget()
      inputsActions.setInputValue('useSound', true)
      get(piano)?.noteOn(game.current)
    } else if (type === 'keys-major' || type == 'keys-minor') {
      game = new GuessKeys(type, baseOpts)
      keyAndScale = [game.current, type === 'keys-major' ? 'major' : 'minor']
    } else if (type === 'chords-play') {
      const basicChords = chords.filter(c => c.suffixes[0] === 'maj' || c.suffixes[0] === 'm')
      game = new GuessChords(type, baseOpts, {
        chords: basicChords
      })
    } else if (type === 'chords-write') {
      game = new GuessChords(type, baseOpts, {
        chords
      })
    } else if (type === 'chords-diatonic') {
      const chords = createTriadChords(scale.triads).map((c, idx) => ({
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
      scoreActions.setKeyAndScale(game.options.scale.key, game.options.scale.scale)
    }
    if (clearOptions) {
      gameOptions.set(DEFAULT_OPTIONS)
    }
    currentGame.set(undefined)
    guessState.set('waiting')
    scoreActions.clearScore()
  }
}
