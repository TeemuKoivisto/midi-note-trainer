import { get } from 'svelte/store'

import { gameActions } from '$stores/game'
import { keyboardActions, keyboardSettings } from '$stores/keyboard'
import { inputsActions } from '$stores/inputs'
import { scoreActions } from '$stores/score'

describe('keyboard & GameNotes', () => {
  beforeAll(() => {
    scoreActions.clearScore(true)
    inputsActions.setInputValue('useHotkeys', true)
    inputsActions.setInputValue('useAutoOctave', true)
    keyboardActions.toggleRows('middle-row')
    vi.unstubAllGlobals()
  })
  it('should parse C# from the hotkey map', () => {
    gameActions.play('notes', undefined)
    expect(get(keyboardSettings).kbdOpts.hotkeydRows).toEqual('middle-row')
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'C♯',
        octave: 4
      }
    })
    expect(keyboardActions.handleInput('KeyT', 't')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'F♯',
        octave: 4
      }
    })
  })
  it('should parse C6 when shift is pressed', () => {
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyK', 'K', true)).toEqual({
      e: 'guessed-note',
      data: {
        note: 'C',
        octave: 5
      }
    })
  })
  it('should parse C# from the hotkey map & octave', () => {
    inputsActions.setInputValue('useAutoOctave', false)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual({
      e: 'note',
      data: {
        flats: 0,
        note: 'C♯',
        semitones: 1,
        sharps: 1
      }
    })
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'C♯',
        octave: 4
      }
    })
  })
  it('should parse C# from the hotkey map and allow backspacing', () => {
    inputsActions.setInputValue('useAutoOctave', false)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual({
      e: 'note',
      data: {
        flats: 0,
        note: 'C♯',
        semitones: 1,
        sharps: 1
      }
    })
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual({ e: 'string', data: '' })
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual({
      e: 'note',
      data: {
        flats: 0,
        note: 'C♯',
        semitones: 1,
        sharps: 1
      }
    })
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'C♯',
        octave: 4
      }
    })
  })
  it('should parse C# when written directly', () => {
    inputsActions.setInputValue('useHotkeys', false)
    inputsActions.setInputValue('useAutoOctave', true)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyC', 'c')).toEqual({ e: 'string', data: 'C' })
    expect(keyboardActions.handleInput('KeyS', 's')).toEqual({ e: 'string', data: 'C♯' })
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'C♯',
        octave: 4
      }
    })
  })
  it("should parse B# even though it's not in the scale", () => {
    inputsActions.setInputValue('useHotkeys', false)
    inputsActions.setInputValue('useAutoOctave', true)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B' })
    expect(keyboardActions.handleInput('KeyS', 's')).toEqual({
      e: 'string',
      data: 'B♯'
    })
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'B♯',
        octave: 4
      }
    })
  })
  it('should parse C#8 without hotkeys & shift should not effect it', () => {
    inputsActions.setInputValue('useHotkeys', false)
    inputsActions.setInputValue('useAutoOctave', true)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyC', 'C', true)).toEqual({ e: 'string', data: 'C' })
    expect(keyboardActions.handleInput('KeyS', 'S', true)).toEqual({ e: 'string', data: 'C♯' })
    expect(keyboardActions.handleInput('Digit8', '8', true)).toEqual({
      e: 'guessed-note',
      data: {
        note: 'C♯',
        octave: 9
      }
    })
  })
  it("should parse Bb when written directly & autoOctave = false shouldn't change it", () => {
    inputsActions.setInputValue('useHotkeys', false)
    inputsActions.setInputValue('useAutoOctave', false)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B' })
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B♭' })
    expect(keyboardActions.handleInput('Digit3', '3')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'B♭',
        octave: 3
      }
    })
  })
  it('should parse Bb when written directly and allow backspacing', () => {
    inputsActions.setInputValue('useHotkeys', false)
    inputsActions.setInputValue('useAutoOctave', false)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(false)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B' })
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B♭' })
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual({
      e: 'string',
      data: 'B'
    })
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B♭' })
    expect(keyboardActions.handleInput('Digit3', '3')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'B♭',
        octave: 3
      }
    })
  })
})

describe('keyboard & GameNotes with two rows enabled', () => {
  beforeAll(() => {
    scoreActions.clearScore(true)
    inputsActions.setInputValue('useHotkeys', true)
    inputsActions.setInputValue('useAutoOctave', true)
    keyboardActions.toggleRows('two-rows')
    vi.unstubAllGlobals()
  })
  it('should parse Eb when mapped to Digit7 without messing up octaves', () => {
    expect(keyboardActions.handleInput('Digit7', '7')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'E♭',
        octave: 6
      }
    })
    expect(keyboardActions.handleInput('IntlBackslash', '§')).toEqual(false)
    expect(keyboardActions.handleInput('Digit9', '9')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'F♯',
        octave: 6
      }
    })
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual({
      e: 'guessed-note',
      data: {
        note: 'B',
        octave: 6
      }
    })
  })
})
