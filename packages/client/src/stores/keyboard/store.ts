import { derived, get, writable } from 'svelte/store'

import { Keyboard, importLayout } from '@/keyboard'

import { currentGame } from '../game'
import { inputs } from '../inputs'
import { scaleData } from '../score'
import { persist } from '../persist'
import { parseKey, type Parsed, parseChord, parseNotes } from './parseInput'

import { GuessChords, GuessKeys } from '@/games'
import type { KeyboardKey, KeyboardOptions, Layout } from '@/keyboard'
import type { ScaleNote } from '@/chords-and-scales'

const ENGLISH_LAYOUT: Layout = {
  code: 'en',
  name: 'English',
  imported: {
    default: [
      '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
      '{tab} q w e r t y u i o p [ ] \\',
      "{lock} a s d f g h j k l ; ' {enter}",
      '{shift} z x c v b n m , . / {shift}',
      '.com @ {space}'
    ],
    shift: [
      '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
      '{tab} Q W E R T Y U I O P { } |',
      '{lock} A S D F G H J K L : " {enter}',
      '{shift} Z X C V B N M < > ? {shift}',
      '.com @ {space}'
    ]
  }
}

export const keyboardOptions = persist(
  writable<Required<KeyboardOptions>>({
    layout: ENGLISH_LAYOUT,
    hotkeydRows: 'middle-row'
  }),
  {
    key: 'keyboard-options'
  }
)
export const keyboard = derived([scaleData, keyboardOptions], ([scl, opts]) => {
  const kbd = new Keyboard(opts)
  kbd.setNotes(Array.from(scl.notesMap.values()))
  return kbd
})
export const keys = derived(keyboard, kbd =>
  kbd.rows.map(r =>
    r.map((c, idx) => {
      let size
      if (c.key === '{bksp}') {
        size = 2
      } else if (c.key === '{tab}') {
        size = 1.5
      } else if (c.key === '{enter}') {
        size = 2
      } else if (c.key === '{lock}') {
        size = 1.75
      } else if (c.key === '{shift}' && idx === 0) {
        size = 1.5
      } else if (c.key === '{shift}') {
        size = 2.5
      }
      if (size) {
        return { ...c, size }
      }
      return c
    })
  )
)
export const keyMap = derived(
  keyboard,
  kbd =>
    new Map<string, KeyboardKey>([
      ...kbd.rows[0].map(c => [c.code, c] as [string, KeyboardKey]),
      ...kbd.rows[1].map(c => [c.code, c] as [string, KeyboardKey]),
      ...kbd.rows[2].map(c => [c.code, c] as [string, KeyboardKey]),
      ...kbd.rows[3].map(c => [c.code, c] as [string, KeyboardKey])
    ])
)
export const kbdNotes = derived(
  keyMap,
  kmap =>
    Array.from(kmap.values())
      .map(k => k.note)
      .filter(v => v !== undefined) as ScaleNote[]
)

export const keyboardActions = {
  async setLayout(code: string) {
    const layout = await importLayout([code])
    keyboardOptions.update(v => ({
      ...v,
      layout
    }))
  },
  findNote(note: string): ScaleNote | undefined {
    return get(kbdNotes).find(n => {
      if (n.note.charAt(0) === note.charAt(0)) {
        const shifted = note
          .slice(1)
          .split('')
          .reduce(
            (acc, c) =>
              acc +
              (c.toLowerCase() === 'b' || c === '♭'
                ? -1
                : c.toLowerCase() === 's' || c === '#' || c === '♯'
                ? 1
                : 0),
            0
          )
        if (shifted > 0) {
          return n.sharps === shifted
        } else if (shifted < 0) {
          return n.flats === shifted * -1
        }
        return n.flats === 0 && n.sharps === 0
      }
    })
  },
  handleInput(code: string, key: string, shift = false): Parsed | false {
    const game = get(currentGame)
    // console.log(`${key} ${keyboardInput} s ${shift} inp ${inputtedNote}`)
    if (game instanceof GuessKeys) {
      return parseKey(code, key.toUpperCase())
    } else if (game instanceof GuessChords && game.type === 'chords-write') {
      return parseChord(code, key)
    } else if (get(inputs).useKeyboard) {
      return parseNotes(code, key.toUpperCase(), shift)
    }
    return false
  }
}
