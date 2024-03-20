import { derived, get, writable } from 'svelte/store'

import { Keyboard, importLayout } from '@/keyboard'

import { currentGame } from '../game'
import { inputs } from '../inputs'
import { scaleData } from '../score'
import { persist } from '../persist'
import { captureHotkey, type ParsedHotkey } from './captureHotkey'
import { parseKey, type Parsed, parseChord, parseNotes } from './parseInput'

import { GuessChords, GuessKeys } from '@/games'
import type { HotkeydRows, KeyboardKey, KeyboardOptions, Layout, Rows } from '@/keyboard'
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

interface KeyboardSettings {
  useCustom: boolean
  customLayout: Rows
  kbdOpts: Required<KeyboardOptions>
}
interface Captured {
  row: KeyboardKey[]
  rowIndex: number
  nextIndex: number
  count: number
}
const captured = new Set<string>()
export const capturingHotkeys = writable<Captured | undefined>(undefined)
export const nextCaptured = derived(capturingHotkeys, c =>
  c ? [c.rowIndex, c.nextIndex] : [-1, -1]
)
export const keyboardSettings = persist(
  writable<KeyboardSettings>({
    useCustom: false,
    customLayout: [[], [], [], []],
    kbdOpts: {
      layout: ENGLISH_LAYOUT,
      hotkeydRows: 'middle-row'
    }
  }),
  {
    key: 'keyboard-settings'
  }
)
export const keyboard = derived([scaleData, keyboardSettings], ([scl, stg]) => {
  let kbd
  if (stg.useCustom && stg.customLayout) {
    kbd = Keyboard.createWithRows(stg.kbdOpts, stg.customLayout)
  } else {
    kbd = new Keyboard(stg.kbdOpts)
  }
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
// @TODO duplicate keys in keyMap???
export const kbdNotes = derived(keyMap, kmap =>
  Array.from(kmap.values())
    .map(k => k.note)
    .filter((v): v is ScaleNote => v !== undefined)
    .sort((a, b) => a.semitones - b.semitones)
)

export const keyboardActions = {
  async setLayout(languages: readonly string[]) {
    const layout = await importLayout(languages)
    keyboardSettings.update(v => ({
      ...v,
      kbdOpts: {
        ...v.kbdOpts,
        layout
      }
    }))
  },
  setCustomLayout(val: boolean) {
    if (val) {
      const kbd = get(keyboard)
      keyboardSettings.update(v => ({
        ...v,
        useCustom: val,
        customLayout: v.customLayout.map((l, rowIdx) => {
          if (l.length === 0) {
            return kbd.rows[rowIdx].map(v => ({ ...v }))
          }
          return l
        }) as Rows
      }))
    } else {
      keyboardSettings.update(v => ({ ...v, useCustom: val }))
    }
  },
  toggleRows(rows?: HotkeydRows) {
    keyboardSettings.update(v => ({
      ...v,
      kbdOpts: {
        ...v.kbdOpts,
        hotkeydRows: rows ?? (v.kbdOpts.hotkeydRows === 'middle-row' ? 'two-rows' : 'middle-row')
      }
    }))
  },
  captureHotkeyRow(rowIndex: number) {
    let nextIndex = -1
    let count = 0
    const row = get(keyboardSettings).customLayout[rowIndex].map((v, idx) => {
      const isSpecial = v.key.charAt(0) === '{' && v.key !== '{empty}'
      if (!isSpecial && nextIndex === -1) {
        nextIndex = idx
      }
      count += isSpecial ? 0 : 1
      return v
    })
    console.log('count', count)
    capturingHotkeys.set({ row, nextIndex, rowIndex, count })
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
  handleHotkeyInput(cpt: Captured, code: string, key: string) {
    const evt = captureHotkey(captured, code, key)
    // console.log(`input: ${code} ${key} ${evt.e}`)
    if (evt.e === 'hotkeys-cancel') {
      capturingHotkeys.set(undefined)
      captured.clear()
    } else if (evt.e === 'hotkeys-captured-key') {
      const row = cpt.row.map((v, idx) => (idx === cpt.nextIndex ? evt.data : v))
      if (cpt.nextIndex === cpt.count) {
        // console.log(
        //   'new rows',
        //   get(keyboardSettings).customLayout.map((r, idx) => (idx !== cpt.rowIndex ? r : row))
        // )
        keyboardSettings.update(v => ({
          ...v,
          customLayout: v.customLayout.map((r, idx) => (idx !== cpt.rowIndex ? r : row)) as Rows
        }))
        capturingHotkeys.set(undefined)
        captured.clear()
      } else if (row) {
        capturingHotkeys.set({
          ...cpt,
          nextIndex: cpt.nextIndex + 1,
          row
        })
      }
    }
    return evt
  },
  handleInput(code: string, key: string, shift = false): Parsed | ParsedHotkey | false {
    const game = get(currentGame)
    const cpt = get(capturingHotkeys)
    if (cpt) {
      return this.handleHotkeyInput(cpt, code, key)
    } else if (game instanceof GuessKeys) {
      return parseKey(code, key.toUpperCase())
    } else if (game instanceof GuessChords && game.type === 'chords-write') {
      return parseChord(code, key)
    } else if (get(inputs).useKeyboard) {
      return parseNotes(code, key.toUpperCase(), shift)
    }
    return false
  },
  reset() {
    keyboardSettings.set({
      useCustom: false,
      customLayout: [[], [], [], []],
      kbdOpts: {
        layout: ENGLISH_LAYOUT,
        hotkeydRows: 'middle-row'
      }
    })
  }
}