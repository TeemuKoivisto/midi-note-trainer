import { gameActions } from '$stores/game'
import { keyboardActions } from '$stores/keyboard'
import { inputsActions } from '$stores/inputs'
import { scoreActions } from '$stores/score'

describe('keyboard & GuessKeys', () => {
  beforeAll(() => {
    scoreActions.clearScore(true)
    inputsActions.setInputValue('useHotkeys', true)
    inputsActions.setInputValue('useAutoOctave', true)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
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
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B' })
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B♭' })
    expect(keyboardActions.handleInput('KeyW', 'W', true)).toEqual(false)
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual({
      e: 'string',
      data: 'B'
    })
    expect(keyboardActions.handleInput('KeyF', 'f')).toEqual(false)
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual({
      data: 'B',
      e: 'guessed-key'
    })
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B' })
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual({ e: 'string', data: '' })
    expect(keyboardActions.handleInput('Backspace', 'Backspace')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4', '4')).toEqual(false)
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B' })
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B♭' })
    expect(keyboardActions.handleInput('KeyB', 'b')).toEqual({ e: 'string', data: 'B♭♭' })
    expect(keyboardActions.handleInput('Enter', 'Enter')).toEqual({
      data: 'B♭♭',
      e: 'guessed-key'
    })
  })
})
