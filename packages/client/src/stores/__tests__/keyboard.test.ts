import { get } from 'svelte/store'

import { gameActions } from '../game'
import { keyboardActions } from '../keyboard'
import { inputsActions } from '../inputs'

describe('keyboard', () => {
  it('should parse C# from the hotkey map', async () => {
    keyboardActions.setKeyboardFocus(true)
    gameActions.play('notes', undefined)
    expect(keyboardActions.handleInput('KeyZ')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft')).toEqual(false)
    expect(keyboardActions.handleInput('KeyW')).toEqual(true)
    expect(keyboardActions.handleInput('Digit4')).toEqual({
      data: 61,
      e: 'note'
    })
  })
  it('should parse C# when written directly', async () => {
    keyboardActions.setKeyboardFocus(true)
    gameActions.play('notes', undefined)
    inputsActions.setInputValue('useHotkeys', false)
    expect(keyboardActions.handleInput('KeyZ')).toEqual(false)
    expect(keyboardActions.handleInput('Digit4')).toEqual(false)
    expect(keyboardActions.handleInput('BracketLeft')).toEqual(false)
    expect(keyboardActions.handleInput('KeyC')).toEqual(true)
    expect(keyboardActions.handleInput('KeyS')).toEqual(true)
    expect(keyboardActions.handleInput('Digit4')).toEqual({
      data: 61,
      e: 'note'
    })
  })
})
