import { gameActions } from '../game'
import { keyboardActions } from '../keyboard'
import { inputsActions } from '../inputs'
import { scoreActions } from '../score'

describe('keyboard & GameNotes', () => {
  beforeAll(() => {
    scoreActions.clearScore(true)
    keyboardActions.setKeyboardFocus(true)
    inputsActions.setInputValue('useHotkeys', true)
    inputsActions.setInputValue('useAutoOctave', true)
    vi.unstubAllGlobals()
  })
  it('should parse C# from the hotkey map', () => {
    gameActions.play('notes', undefined)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual({
      data: 61,
      e: 'guessed-note'
    })
    expect(keyboardActions.handleInput('KeyT', 't')).toEqual({
      data: 66,
      e: 'guessed-note'
    })
  })
  it('should parse C6 when shift is pressed', () => {
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyK', 'K', true)).toEqual({
      data: 84,
      e: 'guessed-note'
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
      data: 61,
      e: 'guessed-note'
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
      data: 61,
      e: 'guessed-note'
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
      data: 61,
      e: 'guessed-note'
    })
  })
  it("should not parse B# as it's not in the scale", () => {
    inputsActions.setInputValue('useHotkeys', false)
    inputsActions.setInputValue('useAutoOctave', true)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B' })
    expect(keyboardActions.handleInput('KeyS', 's')).toEqual({ e: 'string', data: 'B♯' })
    // This resets whole inputtedNote to empty
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual({ e: 'string', data: '' })
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B' })
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual({
      data: 71,
      e: 'guessed-note'
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
      data: 109,
      e: 'guessed-note'
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
      data: 58,
      e: 'guessed-note'
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
      data: 58,
      e: 'guessed-note'
    })
  })
})
