import { get } from 'svelte/store'

import { getOctave, type ScaleNote } from '@/chords-and-scales'

import { inputs, midiRangeNotes } from '../inputs'
import { keyMap, keyboardActions } from './store'

const regexNote = /^[a-gA-G]$/
const regexAccidental = /^[♭Bb#♯sS]$/
const regexPosInt = /^[0-9]$/
let keyboardError = ''
let keyboardInput = ''
let inputtedNote: ScaleNote | undefined

interface ParsedKey {
  e: 'guessed-key'
  data: string
}
interface ParsedChord {
  e: 'guessed-chord'
  data: { note: string; flats: number; sharps: number; chord: string }
}
interface ParsedNote {
  e: 'guessed-note'
  data: number
}
interface InputtedNote {
  e: 'note'
  data: ScaleNote
}
interface InputtedString {
  e: 'string'
  data: string
}
export type Parsed = ParsedKey | ParsedChord | ParsedNote | InputtedNote | InputtedString

export function parseKey(code: string, key: string): ParsedKey | InputtedString | false {
  const { useHotkeys } = get(inputs)
  const found = get(keyMap).get(code)
  // console.log(`code ${code} input: "${keyboardInput}" `)
  if (useHotkeys && keyboardInput.length === 0 && found && found.note) {
    keyboardInput = ''
    return { e: 'guessed-key', data: found.note.note }
  } else if (!useHotkeys && keyboardInput.length === 0 && regexNote.test(key)) {
    // Parse the note letter directly from the input
    keyboardInput += key.toUpperCase()
    return { e: 'string', data: keyboardInput }
  } else if (!useHotkeys && keyboardInput.length > 0 && regexAccidental.test(key)) {
    // Parse accidental from the input
    if (key === 'b' || key === 'B') {
      keyboardInput += '♭'
    } else {
      keyboardInput += '♯'
    }
    return { e: 'string', data: keyboardInput }
  } else if (code === 'Backspace' && keyboardInput.length > 0) {
    keyboardInput = keyboardInput.slice(0, -1)
    return { e: 'string', data: keyboardInput }
  } else if (code === 'Enter' && keyboardInput.length > 0) {
    const data = keyboardInput
    keyboardInput = ''
    return { e: 'guessed-key', data }
  }
  return false
}

export function parseChord(code: string, key: string): ParsedChord | InputtedString | false {
  if (code === 'Enter' && keyboardInput.length > 0) {
    const value = { note: '', flats: 0, sharps: 0, chord: '' }
    for (let i = 0; i < keyboardInput.length; i += 1) {
      if (i === 0) {
        value.note += keyboardInput[i]
      } else if (value.chord.length > 0) {
        value.chord += keyboardInput[i].toLowerCase()
      } else if (keyboardInput[i] === '♭') {
        value.note += keyboardInput[i]
        value.flats += 1
      } else if (keyboardInput[i] === '♯') {
        value.note += keyboardInput[i]
        value.sharps += 1
      } else {
        value.chord += keyboardInput[i].toLowerCase()
      }
    }
    keyboardInput = ''
    return { e: 'guessed-chord', data: value }
  } else if (code === 'Backspace' && keyboardInput.length > 0) {
    keyboardInput = keyboardInput.slice(0, -1)
    return { e: 'string', data: keyboardInput }
  } else if (keyboardInput.length === 0 && regexNote.test(key)) {
    keyboardInput += key.toUpperCase()
    return { e: 'string', data: keyboardInput }
  } else if (keyboardInput.length > 0 && key.length === 1) {
    if (keyboardInput.length === 1 && (key === 'b' || key === 'B')) {
      keyboardInput += '♭'
    } else if (keyboardInput.length === 1 && key === '#') {
      keyboardInput += '♯'
    } else {
      keyboardInput += key
    }
    return { e: 'string', data: keyboardInput }
  }
  return false
}

export function parseNotes(
  code: string,
  key: string,
  shift: boolean
): ParsedNote | InputtedNote | InputtedString | false {
  const { useAutoOctave, useHotkeys } = get(inputs)
  // console.log(`code ${code} key ${key} ${keyboardInput} s ${shift} inp ${inputtedNote}`)
  let octave
  const kmap = get(keyMap)
  const found = kmap.get(code)
  const pressed = found?.key || ''
  let returning: 'note' | 'input' | false = false
  if (!inputtedNote && useHotkeys && found?.note) {
    // Use the hotkey that directly maps the key to a note
    inputtedNote = found.note
    keyboardError = ''
    if (useAutoOctave) {
      octave = getOctave({ midi: get(midiRangeNotes)[0].midi, flats: 0, sharps: 0 })
    }
    returning = 'note'
  } else if (!useHotkeys && keyboardInput.length === 0 && regexNote.test(key)) {
    // Parse the note letter directly from the input
    keyboardInput += key.toUpperCase()
    returning = 'input'
  } else if (!useHotkeys && keyboardInput.length > 0 && regexAccidental.test(key)) {
    // Parse accidental from the input
    if (key === 'b' || key === 'B') {
      keyboardInput += '♭'
    } else {
      keyboardInput += '♯'
    }
    returning = 'input'
  }
  if (!returning && regexPosInt.test(pressed)) {
    try {
      octave = parseInt(pressed)
    } catch (err: any) {}
  }
  if (inputtedNote && octave !== undefined) {
    // Octave either set automatically or inputted with hotkeys enabled
    const midi = inputtedNote.semitones + (octave + 1 + (shift ? 1 : 0)) * 12
    inputtedNote = undefined
    return { e: 'guessed-note', data: midi }
  } else if (keyboardInput && octave !== undefined) {
    // Same as previous but without hotkeys
    const note = keyboardActions.findNote(keyboardInput)
    const midi = note ? note.semitones + (octave + 1) * 12 : undefined
    inputtedNote = undefined
    keyboardInput = ''
    if (midi !== undefined) {
      return { e: 'guessed-note', data: midi }
    }
    return { e: 'string', data: keyboardInput }
  } else if (code === 'Backspace' && (inputtedNote || keyboardInput.length > 0)) {
    inputtedNote = undefined
    keyboardInput = keyboardInput.slice(0, -1)
    return { e: 'string', data: keyboardInput }
  }
  if (returning === 'note') {
    return { e: 'note', data: inputtedNote as ScaleNote }
  } else if (returning === 'input') {
    return { e: 'string', data: keyboardInput }
  }
  return false
}
