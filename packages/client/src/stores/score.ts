import { derived, get, readable, writable } from 'svelte/store'
import { createScale } from '@/chords-and-scales'

import { inputs } from './inputs'

import type { MidiNote, Scale, ScaleNote } from '@/chords-and-scales'

export interface PlayedNote extends MidiNote {
  color: 'default' | 'correct' | 'wrong'
  started: number
}

let timeout: ReturnType<typeof setTimeout> | undefined

export const keyAndScale = writable<[string, string]>(['C', 'Major'])
export const scaleData = derived(keyAndScale, (val): Scale => {
  const res = createScale(val[0], val[1])
  if ('data' in res) {
    return res.data
  }
  return {
    key: val[0],
    scale: val[1],
    names: ['major'],
    flats: 0,
    sharps: 0,
    majorSignature: 'C',
    intervals: [],
    scaleNotes: [],
    trichords: [],
    notesMap: new Map()
  } as Scale
})
export const target = writable<MidiNote[]>([])
export const played = writable<PlayedNote[]>([])

function removePlayedNotes(notes: PlayedNote[], timeoutMs: number): PlayedNote[] {
  if (notes.length > 0) {
    const now = Date.now()
    let next = now
    const updated = notes.filter(n => {
      if (n.started + timeoutMs > now) {
        next = Math.min(next, n.started)
      }
      return n.started + timeoutMs > now
    })
    if (!timeout && updated.length > 0) {
      timeout = setTimeout(
        () => {
          timeout = undefined
          played.update(n => removePlayedNotes(n, timeoutMs))
        },
        timeoutMs - (now - next) + 100
      )
    }
    return updated
  }
  return notes
}

export const scoreActions = {
  setKey(k: string) {
    keyAndScale.update(v => [k, v[1]])
  },
  setScale(s: string) {
    keyAndScale.update(v => [v[0], s])
  },
  setKeyAndScale(k: string, s: string) {
    keyAndScale.set([k, s])
  },
  setTarget(val: MidiNote[] = []) {
    target.set(val)
  },
  getNote(midi: number) {
    return { ...get(scaleData).notesMap.get(midi % 12), midi } as MidiNote
  },
  pushPlayed(midi: number, correct?: boolean | undefined, timeoutMs?: number) {
    const snote = get(scaleData).notesMap.get(midi % 12) as ScaleNote
    const note = { ...snote, midi }
    const now = Date.now()
    const color = correct === undefined ? 'default' : correct ? 'correct' : 'wrong'
    played.update(v => {
      const old = v.findIndex(n => n.midi === midi)
      if (old >= 0) {
        v.splice(old, 1)
      }
      return [...v, { ...note, color: color, started: now }]
    })
    if (!timeout && timeoutMs !== -1) {
      const ms = timeoutMs ?? get(inputs).keyFadeTimeout
      timeout = setTimeout(() => {
        timeout = undefined
        played.update(n => removePlayedNotes(n, ms))
      }, ms)
    }
  },
  setPlayed(notes: MidiNote[], correct?: boolean | undefined, timeoutMs?: number) {
    const now = Date.now()
    const color = correct === undefined ? 'default' : correct ? 'correct' : 'wrong'
    played.update(v => [...notes.map(n => ({ ...n, color: color, started: now }) as PlayedNote)])
    if (!timeout && timeoutMs !== -1) {
      const ms = timeoutMs ?? get(inputs).keyFadeTimeout
      timeout = setTimeout(() => {
        timeout = undefined
        played.update(n => removePlayedNotes(n, ms))
      }, ms)
    }
  },
  clearPlayed() {
    played.set([])
    clearTimeout(timeout)
    timeout = undefined
  },
  clearScore(scaleAndKey = false) {
    if (scaleAndKey) {
      keyAndScale.set(['C', 'Major'])
    }
    target.set([])
    played.set([])
  }
}
