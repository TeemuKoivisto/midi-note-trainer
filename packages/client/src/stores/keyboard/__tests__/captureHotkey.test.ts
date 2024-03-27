import { get } from 'svelte/store'

import { capturingHotkeys, keyboardOptions, keyboardActions, keyboard } from '$stores/keyboard'
import { inputsActions } from '$stores/inputs'
import { scoreActions } from '$stores/score'

import capturingHotkeys0 from './__snapshots__/capturing-hotkeys-0.json'
import customLayout1 from './__snapshots__/custom-layout-1.json'
import customLayout2 from './__snapshots__/custom-layout-2.json'

describe('captureHotkey', () => {
  beforeAll(() => {
    scoreActions.clearScore(true)
    inputsActions.setInputValue('useHotkeys', true)
    inputsActions.setInputValue('useAutoOctave', true)
    keyboardActions.toggleRows('middle-row')
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })
  it('should capture hotkeys for the middle row', async () => {
    expect(keyboardActions.handleInput('KeyS', 'S', true)).toEqual({
      e: 'guessed-note',
      data: {
        note: 'D',
        octave: 5
      }
    })
    expect(keyboardActions.handleInput('KeyD', 'D', true)).toEqual({
      e: 'guessed-note',
      data: {
        note: 'E',
        octave: 5
      }
    })
    expect(keyboardActions.handleInput('Tab', 'Tab', false)).toEqual(false)
    expect(keyboardActions.handleInput('Quote', 'ä', false)).toEqual({
      e: 'guessed-note',
      data: {
        note: 'F',
        octave: 5
      }
    })
    expect(get(capturingHotkeys)).toEqual(undefined)

    // Start capturing
    await keyboardActions.setCustomLayout(true)
    keyboardActions.captureHotkeyRow(2)
    expect(get(capturingHotkeys)).toEqual(capturingHotkeys0)
    expect(get(capturingHotkeys)?.count).toEqual(12)
    expect(get(capturingHotkeys)?.nextIndex).toEqual(1)
    expect(keyboardActions.handleInput('KeyS', 'S', true)).toEqual({
      data: {
        code: 'KeyS',
        key: 'S'
      },
      e: 'hotkeys-captured-key'
    })
    expect(get(capturingHotkeys)?.nextIndex).toEqual(2)
    expect(keyboardActions.handleInput('KeyS', 'S', true)).toEqual({
      e: 'hotkeys-no-key'
    })
    expect(keyboardActions.handleInput('Tab', 'Tab', false)).toEqual({
      data: {
        code: 'Tab',
        key: 'Tab'
      },
      e: 'hotkeys-captured-key'
    })
    expect(keyboardActions.handleInput('Tab', 'Tab', false)).toEqual({
      e: 'hotkeys-no-key'
    })
    expect(get(capturingHotkeys)?.nextIndex).toEqual(3)
    expect(keyboardActions.handleInput('Space', 'Space', false)).toEqual({
      e: 'hotkeys-skip-key'
    })
    expect(get(capturingHotkeys)?.nextIndex).toEqual(4)
    expect(keyboardActions.handleInput('Space', 'Space', false)).toEqual({
      e: 'hotkeys-skip-key'
    })
    expect(get(capturingHotkeys)?.nextIndex).toEqual(5)
    let letters = 'FGHJKLÖÄ'.split('')
    letters.forEach((letter, idx) => {
      expect(keyboardActions.handleInput(`Key${letter}`, letter, false)).toEqual({
        data: {
          code: `Key${letter}`,
          key: letter
        },
        e: 'hotkeys-captured-key'
      })
      if (idx === letters.length - 1) {
        expect(get(capturingHotkeys)?.nextIndex).toEqual(undefined)
      } else {
        expect(get(capturingHotkeys)?.nextIndex).toEqual(6 + idx)
      }
    })
    expect(keyboardActions.handleInput('KeyA', 'A', true)).toEqual(false)
    expect(keyboardActions.handleInput('KeyS', 's', false)).toEqual({
      e: 'guessed-note',
      data: {
        note: 'C',
        octave: 4
      }
    })
    expect(keyboardActions.handleInput('Tab', 'Tab', true)).toEqual({
      e: 'guessed-note',
      data: {
        note: 'D',
        octave: 5
      }
    })
    expect(keyboardActions.handleInput('KeyD', 'D', true)).toEqual(false)
    expect(keyboardActions.handleInput('Quote', 'ä', false)).toEqual(false)
    expect(get(keyboard).rows).toEqual(customLayout1)
    expect(get(capturingHotkeys)).toEqual(undefined)

    // See that reinputting the same row works
    keyboardActions.captureHotkeyRow(2)
    expect(get(capturingHotkeys)?.count).toEqual(12)
    letters = "ASDFGHJKLÖÄ'".split('')
    letters.forEach((letter, idx) => {
      expect(keyboardActions.handleInput(`Key${letter}`, letter, false)).toEqual({
        data: {
          code: `Key${letter}`,
          key: letter
        },
        e: 'hotkeys-captured-key'
      })
      if (idx === letters.length - 1) {
        expect(get(capturingHotkeys)?.nextIndex).toEqual(undefined)
      } else {
        expect(get(capturingHotkeys)?.nextIndex).toEqual(2 + idx)
      }
    })
    expect(keyboardActions.handleInput('KeyA', 'A', true)).toEqual({
      e: 'guessed-note',
      data: {
        note: 'C',
        octave: 5
      }
    })
    expect(keyboardActions.handleInput('KeyS', 's', false)).toEqual({
      e: 'guessed-note',
      data: {
        note: 'D',
        octave: 4
      }
    })
    expect(keyboardActions.handleInput('Tab', 'Tab', true)).toEqual(false)
    expect(keyboardActions.handleInput('KeyD', 'D', true)).toEqual({
      e: 'guessed-note',
      data: {
        note: 'E',
        octave: 5
      }
    })
    expect(keyboardActions.handleInput('Quote', 'ä', false)).toEqual(false)
    expect(get(keyboard).rows).toEqual(customLayout2)
  })
})
