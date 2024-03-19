import { capturingHotkeys, keyboardSettings, keyboardActions } from '$stores/keyboard'
import { inputsActions } from '$stores/inputs'
import { scoreActions } from '$stores/score'
import { get } from 'svelte/store'

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
  it('should parse minor keys from the hotkey map', () => {
    expect(keyboardActions.handleInput('KeyS', 'S', true)).toEqual({
      data: 74,
      e: 'guessed-note'
    })
    expect(keyboardActions.handleInput('KeyD', 'D', true)).toEqual({
      data: 76,
      e: 'guessed-note'
    })
    expect(keyboardActions.handleInput('Tab', 'Tab', false)).toEqual(false)
    expect(get(capturingHotkeys)).toEqual(undefined)
    keyboardActions.setCustomLayout(true)
    keyboardActions.captureHotkeyRow(2)
    expect(get(capturingHotkeys)).toEqual({
      count: 12,
      nextIndex: 1,
      rowIndex: 2,
      row: [
        {
          code: 'Capslock',
          key: '{lock}'
        },
        {
          code: 'KeyA',
          key: 'a',
          note: {
            flats: 0,
            note: 'C',
            semitones: 0,
            sharps: 0
          }
        },
        {
          code: 'KeyS',
          key: 's',
          note: {
            flats: 0,
            note: 'D',
            semitones: 2,
            sharps: 0
          }
        },
        {
          code: 'KeyD',
          key: 'd',
          note: {
            flats: 0,
            note: 'E',
            semitones: 4,
            sharps: 0
          }
        },
        {
          code: 'KeyF',
          key: 'f',
          note: {
            flats: 0,
            note: 'F',
            semitones: 5,
            sharps: 0
          }
        },
        {
          code: 'KeyG',
          key: 'g',
          note: {
            flats: 0,
            note: 'G',
            semitones: 7,
            sharps: 0
          }
        },
        {
          code: 'KeyH',
          key: 'h',
          note: {
            flats: 0,
            note: 'A',
            semitones: 9,
            sharps: 0
          }
        },
        {
          code: 'KeyJ',
          key: 'j',
          note: {
            flats: 0,
            note: 'B',
            semitones: 11,
            sharps: 0
          }
        },
        {
          code: 'KeyK',
          key: 'k',
          note: {
            flats: 0,
            note: 'C',
            semitones: 12,
            sharps: 0
          }
        },
        {
          code: 'KeyL',
          key: 'l',
          note: {
            flats: 0,
            note: 'D',
            semitones: 14,
            sharps: 0
          }
        },
        {
          code: 'Semicolon',
          key: ';',
          note: {
            flats: 0,
            note: 'E',
            semitones: 16,
            sharps: 0
          }
        },
        {
          code: 'Quote',
          key: "'",
          note: {
            flats: 0,
            note: 'F',
            semitones: 17,
            sharps: 0
          }
        },
        {
          code: 'Backslash',
          key: '\\',
          note: {
            flats: 0,
            note: 'G',
            semitones: 19,
            sharps: 0
          }
        }
      ]
    })
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
      data: {
        code: 'EMPTY',
        key: '{empty}'
      },
      e: 'hotkeys-captured-key'
    })
    expect(get(capturingHotkeys)?.nextIndex).toEqual(4)
    expect(keyboardActions.handleInput('Space', 'Space', false)).toEqual({
      data: {
        code: 'EMPTY',
        key: '{empty}'
      },
      e: 'hotkeys-captured-key'
    })
    expect(get(capturingHotkeys)?.nextIndex).toEqual(5)
    const letters = 'FGHJKLÖÄ'.split('')
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
      data: 60,
      e: 'guessed-note'
    })
    expect(keyboardActions.handleInput('Tab', 'Tab', true)).toEqual({
      data: 74,
      e: 'guessed-note'
    })
    expect(keyboardActions.handleInput('KeyD', 'D', true)).toEqual(false)
    expect(get(keyboardSettings).customLayout[2]).toEqual([
      {
        code: 'Capslock',
        key: '{lock}'
      },
      {
        code: 'KeyS',
        key: 'S',
        note: {
          flats: 0,
          note: 'C',
          semitones: 0,
          sharps: 0
        }
      },
      {
        code: 'Tab',
        key: 'Tab',
        note: {
          flats: 0,
          note: 'D',
          semitones: 2,
          sharps: 0
        }
      },
      {
        code: 'EMPTY',
        key: '{empty}'
      },
      {
        code: 'EMPTY',
        key: '{empty}'
      },
      {
        code: 'KeyF',
        key: 'F',
        note: {
          flats: 0,
          note: 'G',
          semitones: 7,
          sharps: 0
        }
      },
      {
        code: 'KeyG',
        key: 'G',
        note: {
          flats: 0,
          note: 'A',
          semitones: 9,
          sharps: 0
        }
      },
      {
        code: 'KeyH',
        key: 'H',
        note: {
          flats: 0,
          note: 'B',
          semitones: 11,
          sharps: 0
        }
      },
      {
        code: 'KeyJ',
        key: 'J',
        note: {
          flats: 0,
          note: 'C',
          semitones: 12,
          sharps: 0
        }
      },
      {
        code: 'KeyK',
        key: 'K',
        note: {
          flats: 0,
          note: 'D',
          semitones: 14,
          sharps: 0
        }
      },
      {
        code: 'KeyL',
        key: 'L',
        note: {
          flats: 0,
          note: 'E',
          semitones: 16,
          sharps: 0
        }
      },
      {
        code: 'KeyÖ',
        key: 'Ö',
        note: {
          flats: 0,
          note: 'F',
          semitones: 17,
          sharps: 0
        }
      },
      {
        code: 'KeyÄ',
        key: 'Ä',
        note: {
          flats: 0,
          note: 'G',
          semitones: 19,
          sharps: 0
        }
      }
    ])
  })
})
