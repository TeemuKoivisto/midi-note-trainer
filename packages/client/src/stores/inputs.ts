import { derived, get, writable } from 'svelte/store'
import { WebMidi } from 'webmidi'

import { persist } from './persist'
import { getNote, type MidiNote } from '@/chords-and-scales'
import { fetchSounds, Piano } from '@/midi-piano'
import { GH_BASE_URL } from '$config'

import type { Input } from 'webmidi'
import type { Result } from '@/types'

interface Inputs {
  fixedVelocity: number | undefined
  keyFadeTimeout: number
  useSound: boolean
  useKeyboard: boolean
  useHotkeys: boolean
  useAutoOctave: boolean
}

export const midiGranted = persist(writable<boolean>(false), {
  key: 'midi-access'
})
export const midiInput = writable<Result<Input>>({ err: 'Disabled', code: 400 })
export const midiRange = persist(writable<[number, number]>([60, 84]), {
  key: 'midi-range',
  storage: 'session'
})
export const midiRangeNotes = derived(
  midiRange,
  r => [getNote(r[0]), getNote(r[1])] as [MidiNote, MidiNote]
)
export const audioContext = writable<AudioContext | undefined>(undefined)
export const piano = writable<Piano | undefined>(undefined)
export const inputs = persist(
  writable<Inputs>({
    fixedVelocity: undefined,
    keyFadeTimeout: 1500,
    useSound: true,
    useKeyboard: true,
    useHotkeys: true,
    useAutoOctave: true
  }),
  {
    key: 'inputs'
  }
)

export const inputsActions = {
  async openMidi(): Promise<Result<Input>> {
    const res = await WebMidi.enable()
      .then(() => {
        midiGranted.set(true)
        if (WebMidi.inputs.length > 0) {
          return { data: WebMidi.inputs[0] }
        } else {
          return { err: 'No MIDI device found', code: 404 }
        }
      })
      .catch(err => ({ err: err.toString(), code: 403 }))
    if ('err' in res) {
      console.error(res.err)
    }
    midiInput.set(res)
    return res
  },
  disableMidi() {
    midiGranted.set(false)
    midiInput.set({ err: 'Disabled', code: 400 })
  },
  setMidiRange(range: [number, number]) {
    midiRange.set(range)
  },
  setInputValue<K extends keyof Inputs>(key: K, val: Inputs[K]) {
    inputs.update(v => ({ ...v, [key]: val }))
    if (key === 'useSound' && !val) {
      piano.set(undefined)
    } else if (key === 'useSound' && !get(piano)) {
      this.initAudio()
    }
  },
  async initAudio() {
    let ctx = get(audioContext)
    if (!ctx) {
      ctx = new AudioContext()
      audioContext.set(ctx)
    }
    if (!get(piano)) {
      const p = new Piano(ctx)
      const sounds = await fetchSounds(`${GH_BASE_URL}audio`, ctx)
      p.load(sounds)
      piano.set(p)
    }
  }
}
