import { get } from 'svelte/store'

import { gameActions } from '../game'
import { keyboardActions } from '../keyboard'
import { inputsActions } from '../inputs'

describe('keyboard', () => {
  it('should parse C# from the hotkey map', async () => {
    keyboardActions.setKeyboardFocus(true)
    gameActions.play('notes', undefined)
    inputsActions.setInputValue('useHotkeys', true)
    inputsActions.setInputValue('useAutoOctave', true)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual({
      data: 61,
      e: 'note'
    })
  })
  it('should parse C6 when shift is pressed', async () => {
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyK', 'K', true)).toEqual({
      data: 84,
      e: 'note'
    })
  })
  it('should parse C# from the hotkey map & octave', async () => {
    inputsActions.setInputValue('useAutoOctave', false)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual(true)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual({
      data: 61,
      e: 'note'
    })
  })
  it('should parse C# from the hotkey map and allow backspacing', async () => {
    inputsActions.setInputValue('useAutoOctave', false)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual(true)
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(true)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual(true)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual({
      data: 61,
      e: 'note'
    })
  })
  it('should parse C# when written directly', async () => {
    inputsActions.setInputValue('useHotkeys', false)
    inputsActions.setInputValue('useAutoOctave', true)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyC', 'c')).toEqual(true)
    expect(keyboardActions.handleInput('KeyS', 's')).toEqual(true)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual({
      data: 61,
      e: 'note'
    })
  })
  it("should not parse B# as it's not in the scale", async () => {
    inputsActions.setInputValue('useHotkeys', false)
    inputsActions.setInputValue('useAutoOctave', true)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('KeyS', 's')).toEqual(true)
    // This resets whole inputtedNote to empty
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(true)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual({
      data: 71,
      e: 'note'
    })
  })
  it('should parse C#8 without hotkeys & shift should not effect it', async () => {
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyC', 'C', true)).toEqual(true)
    expect(keyboardActions.handleInput('KeyS', 'S', true)).toEqual(true)
    expect(keyboardActions.handleInput('Digit8', '8', true)).toEqual({
      data: 109,
      e: 'note'
    })
  })
  it("should parse Bb when written directly & autoOctave = false shouldn't change it", async () => {
    inputsActions.setInputValue('useHotkeys', false)
    inputsActions.setInputValue('useAutoOctave', false)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('Digit3', '3')).toEqual({
      data: 58,
      e: 'note'
    })
  })
  it('should parse Bb when written directly and allow backspacing', async () => {
    inputsActions.setInputValue('useHotkeys', false)
    inputsActions.setInputValue('useAutoOctave', false)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(true)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(true)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('Digit3', '3')).toEqual({
      data: 58,
      e: 'note'
    })
  })
})
