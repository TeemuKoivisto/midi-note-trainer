import { derived, get, writable } from 'svelte/store'

import { persist } from './persist'

import type { Note } from '@/types'

let timeout: ReturnType<typeof setTimeout> | undefined

export const fadeTimeout = persist(writable(1500), {
  key: 'fade-timeout'
})
export const key = writable<string>('C')
export const scale = writable<string>('Major')
export const target = writable<Note | undefined>(undefined)
export const played = writable<(Note & { started: number })[]>([])
export const score = derived([key, target, played], ([k, t, p]) => ({
  key: k,
  target: t,
  played: p
}))

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
    target.set(undefined)
    played.set([])
  }
}
