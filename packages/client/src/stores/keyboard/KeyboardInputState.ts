import { get, writable } from 'svelte/store'

import type { ScaleNote } from '@/chords-and-scales'
import type { ParsedChord, ParsedKey, ParsedNote } from './parseInput'

export type InputEvents = {
  'guessed-key': string
  'guessed-chord': { note: string; flats: number; sharps: number; chord: string }
  'guessed-note': { note: string; octave: number }
}
export type SubmitFn = (data: ParsedKey | ParsedChord | ParsedNote) => void

export class KeyboardInputState {
  keyboardInput = writable('')
  inputtedNote = writable<ScaleNote | undefined>()
  pressedKeys = new Set()

  private onSubmit: SubmitFn

  constructor(fn: SubmitFn) {
    this.onSubmit = fn
  }

  get isEmpty() {
    return get(this.keyboardInput).length === 0 && get(this.inputtedNote) === undefined
  }

  submit(parsed: ParsedKey | ParsedChord | ParsedNote) {
    this.onSubmit(parsed)
    this.keyboardInput.set('')
    this.inputtedNote.set(undefined)
  }

  handlePressedNote(data: ScaleNote) {
    this.inputtedNote.set(data)
  }

  handleInput(data: string) {
    this.keyboardInput.set(data)
  }

  addPressedKey(code: string) {
    this.pressedKeys.add(code)
  }

  deletePressedKey(code: string) {
    this.pressedKeys.delete(code)
  }
}
