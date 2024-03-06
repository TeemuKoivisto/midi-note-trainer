import { chordsFromJSON } from '@/chords-and-scales'

import { gameActions } from '../game'
import { keyboardActions } from '../keyboard'
import { inputsActions } from '../inputs'
import { scoreActions } from '../score'

describe('keyboard & GuessChords', () => {
  const chords = chordsFromJSON()
  beforeAll(() => {
    scoreActions.clearScore(true)
    keyboardActions.setKeyboardFocus(true)
    inputsActions.setInputValue('useHotkeys', true)
    inputsActions.setInputValue('useAutoOctave', true)
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
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('KeyS', 's')).toEqual(true)
    expect(keyboardActions.handleInput('KeyU', 'U', true)).toEqual(true)
    expect(keyboardActions.handleInput('KeyS', 'S', true)).toEqual(true)
    expect(keyboardActions.handleInput('KeyS', 'S', true)).toEqual(true)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(true)
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
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('Digit3', '#')).toEqual(true)
    expect(keyboardActions.handleInput('Digit3', '#')).toEqual(true)
    expect(keyboardActions.handleInput('Digit3', '#')).toEqual(true)
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(true)
    expect(keyboardActions.handleInput('KeyF', 'F', true)).toEqual(true)
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual({
      e: 'guessed-chord',
      data: {
        chord: '#f',
        flats: 0,
        note: 'B♯',
        sharps: 1
      }
    })
    expect(keyboardActions.handleInput('KeyF', 'F', true)).toEqual(true)
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
    expect(keyboardActions.handleInput('KeyD', 'D', true)).toEqual(true)
    expect(keyboardActions.handleInput('Digit3', '#')).toEqual(true)
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(true)
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(true)
    expect(keyboardActions.handleInput('KeyD', 'D', true)).toEqual(true)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('KeyS', 's')).toEqual(true)
    expect(keyboardActions.handleInput('Digit7', '7')).toEqual(true)
    expect(keyboardActions.handleInput('Digit3', '#', true)).toEqual(true)
    expect(keyboardActions.handleInput('Digit9', '9')).toEqual(true)
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
  it.only('should chords-play & chord-diatonic should just play notes', () => {
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
      data: 61,
      e: 'note'
    })
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual(false)
    expect(keyboardActions.handleInput('Quote', 'Ä', true)).toEqual({
      data: 89,
      e: 'note'
    })
    scoreActions.clearScore(true)
    gameActions.play('chords-diatonic', { chords })
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual({
      data: 61,
      e: 'note'
    })

    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(false)
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual(false)
    scoreActions.setKeyAndScale('Db', 'Diminished Whole-Half')
    gameActions.play('chords-write', { chords })
    expect(keyboardActions.handleInput('KeyD', 'D', true)).toEqual(true)
    expect(keyboardActions.handleInput('KeyS', 's')).toEqual(true)
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
