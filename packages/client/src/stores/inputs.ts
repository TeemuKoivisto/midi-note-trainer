import { derived, get, writable } from 'svelte/store'
import { WebMidi } from 'webmidi'
import { SplendidGrandPiano } from 'smplr'

import { isTabletOrPhone } from './media'
import { persist } from './persist'
import { getNote, type MidiNote } from '@/chords-and-scales'

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

const A0_MIDI = 21
const C8_MIDI = 108

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
export const piano = writable<SplendidGrandPiano | undefined>(undefined)
export const useVirtualPiano = writable<boolean>(get(isTabletOrPhone))
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
    midiRange.set([Math.max(range[0], A0_MIDI), Math.min(range[1], C8_MIDI)])
  },
  shiftMidiRange(up: boolean) {
    midiRange.update(v => [up ? v[0] + 12 : v[0] - 12, up ? v[1] + 12 : v[1] - 12])
  },
  setInputValue<K extends keyof Inputs>(key: K, val: Inputs[K]) {
    inputs.update(v => ({ ...v, [key]: val }))
    if (key === 'useSound' && !val) {
      piano.set(undefined)
    } else if (key === 'useSound' && !get(piano)) {
      this.initAudio()
    }
  },
  setUseVirtualPiano(val: boolean) {
    useVirtualPiano.set(val)
  },
  play(value: number | number[], velocity?: number) {
    const p = get(piano)
    const v = velocity ?? get(inputs).fixedVelocity
    if (p && Array.isArray(value)) {
      value.forEach(midi => {
        p.start({ note: midi, velocity: v })
      })
    } else if (p && typeof value === 'number') {
      p.start({ note: value, velocity: v })
    }
  },
  initAudio() {
    let ctx = get(audioContext)
    if (!ctx) {
      ctx = new AudioContext()
      audioContext.set(ctx)
    }
    if (!get(piano)) {
      piano.set(new SplendidGrandPiano(ctx))
    }
  }
}
