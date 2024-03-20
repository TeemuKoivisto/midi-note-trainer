import { chordsFromJSON } from '@/chords-and-scales'

import { gameActions } from '$stores/game'
import { keyboardActions } from '$stores/keyboard'
import { inputsActions } from '$stores/inputs'
import { scoreActions } from '$stores/score'

describe('keyboard & GuessChords', () => {
  const chords = chordsFromJSON()
  beforeAll(() => {
    scoreActions.clearScore(true)
    inputsActions.setInputValue('useHotkeys', true)
    inputsActions.setInputValue('useAutoOctave', true)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })
  it('should parse chords as written', () => {
    vi.stubGlobal('Math', {
      floor: Math.floor,
      ceil: Math.ceil,
      random: () => 0.0
    })
    gameActions.play('chords-write', { chords })
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual(false)
    expect(keyboardActions.handleInput('KeyS', 's')).toEqual(false)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B' })
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B♭' })
    expect(keyboardActions.handleInput('KeyS', 's')).toEqual({ e: 'string', data: 'B♭s' })
    expect(keyboardActions.handleInput('KeyU', 'U', true)).toEqual({ e: 'string', data: 'B♭sU' })
    expect(keyboardActions.handleInput('KeyS', 'S', true)).toEqual({ e: 'string', data: 'B♭sUS' })
    expect(keyboardActions.handleInput('KeyS', 'S', true)).toEqual({ e: 'string', data: 'B♭sUSS' })
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual({ e: 'string', data: 'B♭sUSS4' })
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual({
      e: 'guessed-chord',
      data: {
        chord: 'suss4',
        flats: 1,
        note: 'B♭',
        sharps: 0
      }
    })
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B' })
    expect(keyboardActions.handleInput('Digit3', '#')).toEqual({ e: 'string', data: 'B♯' })
    expect(keyboardActions.handleInput('Digit3', '#')).toEqual({ e: 'string', data: 'B♯#' })
    expect(keyboardActions.handleInput('Digit3', '#')).toEqual({ e: 'string', data: 'B♯##' })
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual({
      e: 'string',
      data: 'B♯#'
    })
    expect(keyboardActions.handleInput('KeyF', 'F', true)).toEqual({ e: 'string', data: 'B♯#F' })
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual({
      e: 'guessed-chord',
      data: {
        chord: '#f',
        flats: 0,
        note: 'B♯',
        sharps: 1
      }
    })
    expect(keyboardActions.handleInput('KeyF', 'F', true)).toEqual({ e: 'string', data: 'F' })
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual({
      e: 'guessed-chord',
      data: {
        chord: '',
        flats: 0,
        note: 'F',
        sharps: 0
      }
    })
  })
  it('should parse chords as written & hotkeys should not change it', () => {
    vi.stubGlobal('Math', {
      floor: Math.floor,
      ceil: Math.ceil,
      random: () => 0.999999
    })
    gameActions.play('chords-write', { chords })
    inputsActions.setInputValue('useHotkeys', false)
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual(false)
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual(false)
    expect(keyboardActions.handleInput('Quote', 'Ä', true)).toEqual(false)
    expect(keyboardActions.handleInput('KeyD', 'D', true)).toEqual({ e: 'string', data: 'D' })
    expect(keyboardActions.handleInput('Digit3', '#')).toEqual({ e: 'string', data: 'D♯' })
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual({
      e: 'string',
      data: 'D'
    })
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual({ e: 'string', data: '' })
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(false)
    expect(keyboardActions.handleInput('KeyD', 'D', true)).toEqual({ e: 'string', data: 'D' })
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'D♭' })
    expect(keyboardActions.handleInput('KeyS', 's')).toEqual({ e: 'string', data: 'D♭s' })
    expect(keyboardActions.handleInput('Digit7', '7')).toEqual({ e: 'string', data: 'D♭s7' })
    expect(keyboardActions.handleInput('Digit3', '#', true)).toEqual({ e: 'string', data: 'D♭s7#' })
    expect(keyboardActions.handleInput('Digit9', '9')).toEqual({ e: 'string', data: 'D♭s7#9' })
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual({
      e: 'guessed-chord',
      data: {
        chord: 's7#9',
        flats: 1,
        note: 'D♭',
        sharps: 0
      }
    })
  })
  it('should chords-play & chord-diatonic should just play notes', () => {
    vi.stubGlobal('Math', {
      floor: Math.floor,
      ceil: Math.ceil,
      min: Math.min,
      max: Math.max,
      random: () => 0.999999
    })
    gameActions.play('chords-play', { chords })
    inputsActions.setInputValue('useHotkeys', true)
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'C♯',
        octave: 4
      }
    })
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual(false)
    expect(keyboardActions.handleInput('Quote', 'Ä', true)).toEqual({
      e: 'guessed-note',
      data: {
        note: 'F',
        octave: 5
      }
    })
    scoreActions.clearScore(true)
    gameActions.play('chords-diatonic', { chords })
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'C♯',
        octave: 4
      }
    })
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(false)
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual(false)

    scoreActions.setKeyAndScale('Db', 'Diminished Whole-Half')
    gameActions.play('chords-write', { chords })
    expect(keyboardActions.handleInput('KeyD', 'D', true)).toEqual({ e: 'string', data: 'D' })
    expect(keyboardActions.handleInput('KeyS', 's')).toEqual({ e: 'string', data: 'Ds' })
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual({
      e: 'guessed-chord',
      data: {
        chord: 's',
        flats: 0,
        note: 'D',
        sharps: 0
      }
    })
  })
})
