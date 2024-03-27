import { derived, get, writable } from 'svelte/store'

import { Keyboard, importLayout, layoutFromRows } from '@/keyboard'

import { currentGame } from '../game'
import { inputs } from '../inputs'
import { scaleData } from '../score'
import { persist } from '../persist'
import { captureHotkey, type ParsedHotkey } from './captureHotkey'
import { parseKey, type Parsed, parseChord, parseNotes } from './parseInput'

import { GuessChords, GuessKeys } from '@/games'
import type { HotkeydRows, KeyboardKey, KeyboardOptions, Layout, Rows } from '@/keyboard'
import type { ScaleNote } from '@/chords-and-scales'

interface Captured {
  rowIndex: number
  nextIndex: number
  count: number
  scaleNotes: ScaleNote[]
}

const ENGLISH_LAYOUT: Layout = {
  code: 'en',
  name: 'English',
  imported: {
    default: [
      '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
      '{tab} q w e r t y u i o p [ ] \\',
      "{lock} a s d f g h j k l ; ' {enter}",
      '{shift} z x c v b n m , . / {shift}'
    ]
  }
}
const captured = new Set<string>()
export const DEFAULT_KEYBOARD = new Keyboard({
  layout: ENGLISH_LAYOUT
})
export const capturingHotkeys = writable<Captured | undefined>(undefined)
export const nextCaptured = derived(capturingHotkeys, c =>
  c ? [c.rowIndex, c.nextIndex] : [-1, -1]
)
export const keyboardOptions = persist(
  writable<Required<KeyboardOptions>>({
    isCustom: false,
    layout: ENGLISH_LAYOUT,
    hotkeydRows: 'middle-row'
  }),
  {
    key: 'keyboard-options'
  }
)
export const rows = writable<Rows>(DEFAULT_KEYBOARD.rows)
export const keyboard = writable(DEFAULT_KEYBOARD)
scaleData.subscribe(scale => {
  const kbd = get(keyboard)
  kbd.setNotes(Array.from(scale.notesMap.values()))
  rows.set(kbd.rows)
  keyboard.set(kbd)
})
keyboardOptions.subscribe(opts => {
  const kbd = new Keyboard(opts)
  const scale = get(scaleData)
  kbd.setNotes(Array.from(scale.notesMap.values()))
  rows.set(kbd.rows)
  keyboard.set(kbd)
})
export const keyMap = derived(
  keyboard,
  kbd =>
    new Map<string, KeyboardKey>([
      ...kbd.rows[0].keys.map(c => [c.code, c] as [string, KeyboardKey]),
      ...kbd.rows[1].keys.map(c => [c.code, c] as [string, KeyboardKey]),
      ...kbd.rows[2].keys.map(c => [c.code, c] as [string, KeyboardKey]),
      ...kbd.rows[3].keys.map(c => [c.code, c] as [string, KeyboardKey])
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
    const opts = get(keyboardOptions)
    if (layout.code !== opts.layout.code) {
      keyboardOptions.update(v => ({
        ...v,
        isCustom: false,
        layout
      }))
    }
  },
  async setCustomLayout(val: boolean) {
    if (val) {
      keyboardOptions.update(v => ({
        ...v,
        isCustom: val,
        layout: {
          code: 'custom',
          name: 'Custom',
          imported: v.layout.imported
        }
      }))
    } else {
      this.setLayout(navigator.languages)
    }
  },
  toggleRows(rows?: HotkeydRows) {
    keyboardOptions.update(v => ({
      ...v,
      hotkeydRows: rows ?? (v.hotkeydRows === 'middle-row' ? 'two-rows' : 'middle-row')
    }))
  },
  captureHotkeyRow(rowIndex: number) {
    const kbd = get(keyboard)
    const scale = get(scaleData)
    const { first, count } = kbd.startSetCustomRow(rowIndex)
    capturingHotkeys.set({
      nextIndex: first,
      rowIndex,
      count,
      scaleNotes: Array.from(scale.notesMap.values())
    })
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
    const kbd = get(keyboard)
    // console.log(`input: ${code} ${key} ${evt.e}`)
    let next: { key: KeyboardKey; index: number } | undefined
    const index = kbd.setCustomRow.nextKeyIdx
    if (evt.e === 'hotkeys-cancel') {
      capturingHotkeys.set(undefined)
      captured.clear()
    } else if (evt.e === 'hotkeys-skip-key') {
      next = kbd.skipNextCustomNote()
    } else if (evt.e === 'hotkeys-captured-key') {
      next = kbd.setNextCustomNote(evt.data.key, evt.data.code, cpt.scaleNotes)
    }
    const newRows = get(rows)
    if (next) {
      newRows[cpt.rowIndex].keys[index] = next.key
      rows.set(newRows)
      capturingHotkeys.update(v =>
        v
          ? {
              ...v,
              nextIndex: next!.index
            }
          : undefined
      )
    }
    if (cpt.count === index) {
      const layout = layoutFromRows(newRows)
      keyboardOptions.update(v => ({
        ...v,
        layout: {
          ...v.layout,
          imported: layout
        }
      }))
      capturingHotkeys.set(undefined)
      captured.clear()
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
  cancelCapture() {
    capturingHotkeys.set(undefined)
    captured.clear()
  },
  reset() {
    keyboardOptions.set({
      isCustom: false,
      layout: ENGLISH_LAYOUT,
      hotkeydRows: 'middle-row'
    })
    capturingHotkeys.set(undefined)
    captured.clear()
  }
}
