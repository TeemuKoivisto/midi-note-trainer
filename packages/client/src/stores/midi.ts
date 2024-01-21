import { derived, get, writable } from 'svelte/store'
import { WebMidi } from 'webmidi'

import { persist } from './persist'
import { Piano } from '$utils/piano'

import type { Input } from 'webmidi'
import type { Result } from '@/types'

export const midiInput = writable<Input | undefined>(undefined)
export const midiRange = persist(writable<[number, number]>([60, 84]), {
  key: 'midi-range',
  storage: 'session'
})
export const piano = writable<Piano | undefined>(undefined)
export const useSound = persist(writable<boolean>(false), {
  key: 'use-sound'
})
export const useKeyboard = persist(writable<boolean>(false), {
  key: 'use-keyboard'
})

useSound.subscribe(val => {
  if (val) {
    piano.set(new Piano(new AudioContext()))
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
  setUseKeyboard(val: boolean) {
    useKeyboard.set(val)
  },
  setSound(val: boolean) {
    useSound.set(val)
  }
}
