import { derived, get, readable, writable } from 'svelte/store'

import { getOctave, type ScaleNote } from '@/chords-and-scales'
import { Keyboard, type KeyboardKey } from '@/keyboard'

import { currentGame } from './game'
import { inputs, midiRangeNotes } from './inputs'
import { scaleData, scoreActions } from './score'
import { persist } from './persist'

import { GuessChords, GuessKeys } from '@/games'

interface KeyboardOptions {
  layout: 'middle-row' | 'two-rows'
}

let debounced: boolean
const regexNote = /^[a-gA-G]$/
const regexAccidental = /^[♭Bb#♯sS]$/
const regexPosInt = /^[0-9]$/
let keyboardError = ''
let keyboardInput = ''
let inputtedNote: { note: string; semitones: number; flats: number; sharps: number } | undefined

// For determining whether to play notes unless text input has been already captured
export const keyboardFocused = writable<boolean>(true)
export const keyboardOptions = persist(
  writable<KeyboardOptions>({
    layout: 'middle-row'
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

interface ParsedKey {
  e: 'guessed-key'
  data: string
}
interface ParsedChord {
  e: 'guessed-chord'
  data: { note: string; flats: number; sharps: number; chord: string }
}
interface ParsedNote {
  e: 'note'
  data: number
}

function parseKey(code: string, key: string): ParsedKey | boolean {
  const { useHotkeys } = get(inputs)
  const found = get(keyMap).get(code)
  // console.log(`code ${code} input: "${keyboardInput}" `)
  if (useHotkeys && keyboardInput.length === 0 && found && found.note) {
    keyboardInput = ''
    return { e: 'guessed-key', data: found.note.note }
  } else if (!useHotkeys && keyboardInput.length === 0 && regexNote.test(key)) {
    // Parse the note letter directly from the input
    keyboardInput += key.toUpperCase()
    return true
  } else if (!useHotkeys && keyboardInput.length > 0 && regexAccidental.test(key)) {
    // Parse accidental from the input
    if (key === 'b' || key === 'B') {
      keyboardInput += '♭'
    } else {
      keyboardInput += '♯'
    }
    return true
  } else if (code === 'Backspace' && keyboardInput.length > 0) {
    keyboardInput = keyboardInput.slice(0, -1)
    return true
  } else if (code === 'Enter' && keyboardInput.length > 0) {
    const data = keyboardInput
    keyboardInput = ''
    return { e: 'guessed-key', data }
  }
  return false
}

function parseNotes(code: string, key: string, shift: boolean): ParsedNote | boolean {
  const { useAutoOctave, useHotkeys } = get(inputs)
  let octave
  const kmap = get(keyMap)
  const found = kmap.get(code)
  const pressed = found?.key || ''
  let handled = false
  if (!inputtedNote && useHotkeys && found?.note) {
    // Use the hotkey that directly maps the key to a note
    inputtedNote = found.note
    keyboardError = ''
    if (useAutoOctave) {
      octave = getOctave(get(midiRangeNotes)[0].midi)
    }
    handled = true
  } else if (!useHotkeys && keyboardInput.length === 0 && regexNote.test(key)) {
    // Parse the note letter directly from the input
    keyboardInput += key.toUpperCase()
    handled = true
  } else if (!useHotkeys && keyboardInput.length > 0 && regexAccidental.test(key)) {
    // Parse accidental from the input
    if (key === 'b' || key === 'B') {
      keyboardInput += '♭'
    } else {
      keyboardInput += '♯'
    }
    handled = true
  }
  if (regexPosInt.test(pressed)) {
    try {
      octave = parseInt(pressed)
    } catch (err: any) {}
  }
  // console.log(`${key} ${keyboardInput} o ${octave} s ${shift}`, inputtedNote)
  if (inputtedNote && octave !== undefined) {
    // Octave either set automatically or inputted with hotkeys enabled
    const midi = inputtedNote.semitones + (octave + 1 + (shift ? 1 : 0)) * 12
    inputtedNote = undefined
    return { e: 'note', data: midi }
  } else if (keyboardInput && octave !== undefined) {
    // Same as previous but without hotkeys
    const note = keyboardActions.findNote(keyboardInput)
    const midi = note ? note.semitones + (octave + 1) * 12 : undefined
    keyboardInput = ''
    if (midi !== undefined) {
      return { e: 'note', data: midi }
    }
    return true
  } else if (code === 'Backspace') {
    inputtedNote = undefined
    keyboardInput = keyboardInput.slice(0, -1)
    return true
  }
  return handled
}

export const keyboardActions = {
  setKeyboardFocus(val: boolean) {
    keyboardFocused.set(val)
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
  handleInput(
    code: string,
    key: string,
    shift = false
  ): ParsedKey | ParsedChord | ParsedNote | boolean | undefined {
    if (debounced || !get(keyboardFocused)) return undefined
    const game = get(currentGame)
    if (game instanceof GuessKeys) {
      return parseKey(code, key.toUpperCase())
    } else if (game instanceof GuessChords && game.type === 'chords-write') {
      if (code === 'Enter' && keyboardInput.length > 0) {
        const value = { note: '', flats: 0, sharps: 0, chord: '' }
        for (let i = 0; i < keyboardInput.length; i += 1) {
          if (i === 0) {
            value.note += keyboardInput[i]
          } else if (value.chord.length > 0) {
            value.chord += keyboardInput[i]
          } else if (keyboardInput[i] === 'b' || keyboardInput[i] === '♭') {
            value.flats += 1
          } else if (keyboardInput[i] === '#' || keyboardInput[i] === '♯') {
            value.sharps += 1
          } else {
            value.chord += keyboardInput[i]
          }
        }
        keyboardInput = ''
        return { e: 'guessed-chord', data: value }
      } else if (code === 'Backspace') {
        keyboardInput = keyboardInput.slice(0, -1)
        return true
      } else if (code.slice(0, 3) === 'Key') {
        keyboardInput += code
        if (keyboardInput.length === 1) {
          keyboardInput = keyboardInput.toUpperCase()
        }
        return true
      }
    } else if (get(inputs).useKeyboard) {
      return parseNotes(code, key.toUpperCase(), shift)
    }
    return false
  }
}
