import { derived, get, readable, writable } from 'svelte/store'
import { createScale } from '@/chords-and-scales'

import { persist } from './persist'

import type { MidiNote, Scale, ScaleNote } from '@/chords-and-scales'

export interface PlayedNote extends MidiNote {
  color: 'default' | 'correct' | 'wrong'
  started: number
}

let timeout: ReturnType<typeof setTimeout> | undefined

export const defaultKeyMap = readable({
  A: { note: 'C', semitones: 0, flats: 0, sharps: 0 },
  W: { note: 'C♯', semitones: 1, flats: 0, sharps: 1 },
  S: { note: 'D', semitones: 2, flats: 0, sharps: 0 },
  E: { note: 'E♭', semitones: 3, flats: 1, sharps: 0 },
  D: { note: 'E', semitones: 4, flats: 0, sharps: 0 },
  F: { note: 'F', semitones: 5, flats: 0, sharps: 0 },
  T: { note: 'F♯', semitones: 6, flats: 0, sharps: 1 },
  G: { note: 'G', semitones: 7, flats: 0, sharps: 0 },
  Y: { note: 'G♯', semitones: 8, flats: 0, sharps: 1 },
  H: { note: 'A', semitones: 9, flats: 0, sharps: 0 },
  U: { note: 'B♭', semitones: 10, flats: 1, sharps: 0 },
  J: { note: 'B', semitones: 11, flats: 0, sharps: 0 },
  K: { note: 'C', semitones: 12, flats: 0, sharps: 0 },
  O: { note: 'C♯', semitones: 13, flats: 0, sharps: 1 },
  L: { note: 'D', semitones: 14, flats: 0, sharps: 0 },
  P: { note: 'E♭', semitones: 15, flats: 1, sharps: 0 },
  Ö: { note: 'E', semitones: 16, flats: 0, sharps: 0 },
  Ä: { note: 'F', semitones: 17, flats: 0, sharps: 0 },
  Å: { note: 'F♯', semitones: 18, flats: 0, sharps: 1 }
})
export const fadeTimeout = persist(writable(1500), {
  key: 'fade-timeout'
})
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
    triads: [],
    notesMap: new Map()
  } as Scale
})
export const keyMap = derived([scaleData, defaultKeyMap], ([scl, kmap]) => {
  const map = { ...kmap }
  Object.entries(kmap).forEach(([key, vals]) => {
    const note = scl.notesMap.get(vals.semitones % 12)
    if (note) {
      map[key as keyof typeof map] = {
        note: note.note,
        flats: note.flats,
        sharps: note.sharps,
        semitones: vals.semitones
      }
    }
  })
  return map
})
export const target = writable<MidiNote[]>([])
export const played = writable<PlayedNote[]>([])

function removePlayedNotes(notes: PlayedNote[], timeoutMs: number): PlayedNote[] {
  if (notes.length > 0) {
    const now = Date.now()
    let next = now
    const updated = notes.filter(n => {
      if (n.started + timeoutMs <= now) {
        next = Math.min(next, n.started)
      }
      return n.started + timeoutMs > now
    })
    if (!timeout) {
      timeout = setTimeout(
        () => {
          timeout = undefined
          played.update(n => removePlayedNotes(n, timeoutMs))
        },
        now - next + 100
      )
    }
    return updated
  }
  return notes
}

export const scoreActions = {
  setFadeTimeout(ms: number) {
    fadeTimeout.set(ms)
  },
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
  findNote(note: string): ScaleNote | undefined {
    return Object.values(get(keyMap)).find(n => {
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
  getNote(midi: number) {
    return { ...get(scaleData).notesMap.get(midi % 12), midi } as MidiNote
  },
  pushPlayed(midi: number, correct?: boolean | undefined, timeoutMs?: number) {
    const snote = get(scaleData).notesMap.get(midi % 12) as ScaleNote
    const note = { ...snote, midi }
    const now = Date.now()
    const color = correct === undefined ? 'default' : correct ? 'correct' : 'wrong'
    played.update(v =>
      [...v, { ...note, color: color, started: now } as PlayedNote].filter(
        n => n.midi !== note.midi || n.started === now
      )
    )
    if (!timeout) {
      const ms = timeoutMs ?? get(fadeTimeout)
      timeout = setTimeout(() => {
        timeout = undefined
        played.update(n => removePlayedNotes(n, ms))
      }, ms)
    }
  },
  pushPlayedNotes() {},
  setPlayed(notes: MidiNote[], correct?: boolean | undefined, timeoutMs?: number) {
    const now = Date.now()
    const color = correct === undefined ? 'default' : correct ? 'correct' : 'wrong'
    played.update(v => [...notes.map(n => ({ ...n, color: color, started: now }) as PlayedNote)])
    if (!timeout) {
      const ms = timeoutMs ?? get(fadeTimeout)
      timeout = setTimeout(() => {
        timeout = undefined
        played.update(n => removePlayedNotes(n, ms))
      }, ms)
    }
  },
  clearPlayed() {
    played.set([])
  },
  clearScore() {
    // keyAndScale.set(['C', 'Major'])
    target.set([])
    played.set([])
  }
}
