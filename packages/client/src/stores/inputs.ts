import { derived, get, writable } from 'svelte/store'
import { WebMidi } from 'webmidi'

import { persist } from './persist'
import { getNote } from '$utils/getNote'
import { Piano } from '$utils/piano'

import type { Input } from 'webmidi'
import type { Note, Result } from '@/types'

interface Inputs {
  useSound: boolean
  useKeyboard: boolean
  useHotkeys: boolean
  useAutoOctave: boolean
}

export const midiInput = writable<Input | undefined>(undefined)
export const midiRange = persist(writable<[number, number]>([60, 84]), {
  key: 'midi-range',
  storage: 'session'
})
export const midiRangeNotes = derived(
  midiRange,
  r => [getNote(r[0]), getNote(r[1])] as [Note, Note]
)
export const piano = writable<Piano | undefined>(undefined)
export const inputs = persist(
  writable<Inputs>({
    useSound: true,
    useKeyboard: true,
    useHotkeys: true,
    useAutoOctave: false
  }),
  {
    key: 'inputs'
  }
)

inputs.subscribe(val => {
  if (val.useSound && typeof window !== 'undefined') {
    const p = new Piano(new AudioContext())
    p.load()
    piano.set(p)
  } else {
    piano.set(undefined)
  }
})

export const midiActions = {
  async openMidi(): Promise<Result<Input>> {
    return WebMidi.enable()
      .then(() => {
        if (WebMidi.inputs.length > 0) {
          midiInput.set(WebMidi.inputs[0])
          return { data: WebMidi.inputs[0] }
        } else {
          return { err: 'No MIDI device found.', code: 400 }
        }
      })
      .catch(err => ({ err: err.toString(), code: 403 }))
  },
  setMidiRange(range: [number, number]) {
    midiRange.set(range)
  },
  setInputValue(key: keyof Inputs, val: boolean) {
    inputs.update(v => ({ ...v, [key]: val }))
  }
}
