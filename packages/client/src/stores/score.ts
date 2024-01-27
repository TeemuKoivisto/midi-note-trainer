import { derived, get, readable, writable } from 'svelte/store'
import { createScale } from '@/music-scales'

import { persist } from './persist'

import type { Note } from '@/types'

let timeout: ReturnType<typeof setTimeout> | undefined

export const defaultKeyMap = readable({
  A: { defaultNote: 'C', order: 0 },
  W: { defaultNote: 'C♯', order: 1 },
  S: { defaultNote: 'D', order: 2 },
  E: { defaultNote: 'E♭', order: 3 },
  D: { defaultNote: 'E', order: 4 },
  F: { defaultNote: 'F', order: 5 },
  R: { defaultNote: 'F♯', order: 6 },
  G: { defaultNote: 'G', order: 7 },
  T: { defaultNote: 'G♯', order: 8 },
  H: { defaultNote: 'A', order: 9 },
  U: { defaultNote: 'B♭', order: 10 },
  J: { defaultNote: 'B', order: 11 },
  K: { defaultNote: 'C', order: 12 },
  O: { defaultNote: 'C♯', order: 13 },
  L: { defaultNote: 'D', order: 14 },
  P: { defaultNote: 'E♭', order: 15 },
  Ö: { defaultNote: 'E', order: 16 },
  Ä: { defaultNote: 'F', order: 17 },
  Å: { defaultNote: 'F♯', order: 18 }
})
export const fadeTimeout = persist(writable(1500), {
  key: 'fade-timeout'
})
export const key = writable<string>('C')
export const scale = writable<string>('Major')
export const scaleNotes = derived([key, scale], ([k, s]) => {
  const res = createScale(k, s)
  if ('data' in res) {
    return res.data
  }
  return []
})
export const hotKeyMap = derived([scaleNotes, defaultKeyMap], ([notes, kmap]) => {
  const map = { ...kmap }
  console.log(notes)
  notes.forEach(note => {
    const found = Object.entries(kmap).find(([_, vals]) => note.order === vals.order)
    if (found) {
      const key = found[0] as keyof typeof map
      map[key] = { ...found[1], defaultNote: note.note }
    }
  })
  return map
})
export const target = writable<Note | undefined>(undefined)
export const played = writable<(Note & { started: number })[]>([])

function removePlayedNotes(
  notes: (Note & { started: number })[],
  timeoutMs: number
): (Note & { started: number })[] {
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
  setKey(v: string) {
    key.set(v)
  },
  setScale(v: string) {
    scale.set(v)
  },
  // setScore(v: any[]) {
  //   score.set(v)
  // },
  setTarget(val?: Note) {
    target.set(val)
  },
  pushPlayed(note: Note, timeoutMs?: number) {
    const now = Date.now()
    played.update(v =>
      [...v, { ...note, started: now }].filter(n => n.value !== note.value || n.started === now)
    )
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
    key.set('C')
    target.set(undefined)
    played.set([])
  }
}
