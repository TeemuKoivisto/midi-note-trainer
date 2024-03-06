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
  })
  it('should parse C# from the hotkey map', () => {
    gameActions.play('notes', undefined)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual({
      data: 61,
      e: 'note'
    })
  })
  it('should parse C6 when shift is pressed', () => {
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    expect(keyboardActions.handleInput('KeyK', 'K', true)).toEqual({
      data: 84,
      e: 'note'
    })
  })
  it('should parse C# from the hotkey map & octave', () => {
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
  it('should parse C# from the hotkey map and allow backspacing', () => {
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
  it('should parse C# when written directly', () => {
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
  it("should not parse B# as it's not in the scale", () => {
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
  it('should parse C#8 without hotkeys & shift should not effect it', () => {
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
  it("should parse Bb when written directly & autoOctave = false shouldn't change it", () => {
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
  it('should parse Bb when written directly and allow backspacing', () => {
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

describe('keyboard & GuessKeys', () => {
  beforeAll(() => {
    scoreActions.clearScore(true)
    keyboardActions.setKeyboardFocus(true)
    inputsActions.setInputValue('useHotkeys', true)
    inputsActions.setInputValue('useAutoOctave', true)
  })
  it('should parse major keys from the hotkey map', () => {
    vi.stubGlobal('Math', {
      floor: Math.floor,
      ceil: Math.ceil,
      random: () => 0.0
    })
    gameActions.play('keys-major', undefined)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    // The key and scale is set to A minor but it has no accidentals -> use default C#
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual({
      data: 'C♯',
      e: 'guessed-key'
    })
    expect(keyboardActions.handleInput('KeyE', 'e')).toEqual({
      data: 'E♭',
      e: 'guessed-key'
    })
    expect(keyboardActions.handleInput('KeyW', 'W', true)).toEqual({
      data: 'C♯',
      e: 'guessed-key'
    })
  })
  it('should parse minor keys from the hotkey map', () => {
    vi.stubGlobal('Math', {
      floor: Math.floor,
      ceil: Math.ceil,
      random: () => 0.999999
    })
    gameActions.play('keys-minor', undefined)
    inputsActions.setInputValue('useAutoOctave', false)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    // The key and scale is set to A# minor which creates a lot of accidented notes
    expect(keyboardActions.handleInput('Quote', 'Ä', true)).toEqual({
      data: 'E♯',
      e: 'guessed-key'
    })
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(false)
    expect(keyboardActions.handleInput('KeyE', 'e')).toEqual({
      data: 'D♯',
      e: 'guessed-key'
    })
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual({
      data: 'C♯',
      e: 'guessed-key'
    })
  })
  it('should parse major keys as written', () => {
    vi.stubGlobal('Math', {
      floor: Math.floor,
      ceil: Math.ceil,
      random: () => 0.0
    })
    inputsActions.setInputValue('useHotkeys', false)
    gameActions.play('keys-major', undefined)
    expect(keyboardActions.handleInput('KeyZ', 'z')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft', 'å')).toEqual(false)
    // The key and scale is set to A minor but it has no accidentals -> use default C#
    expect(keyboardActions.handleInput('KeyW', 'w')).toEqual(false)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('KeyW', 'W', true)).toEqual(false)
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(true)
    expect(keyboardActions.handleInput('KeyF', 'f')).toEqual(false)
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual({
      data: 'B',
      e: 'guessed-key'
    })
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(true)
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual(true)
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual({
      data: 'B♭♭',
      e: 'guessed-key'
    })
  })
})
