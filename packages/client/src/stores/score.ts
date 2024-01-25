import { derived, get, writable } from 'svelte/store'

import type { Note } from '@/types'

const PLAYED_DURATION = 1500

let timeout: ReturnType<typeof setTimeout> | undefined

export const key = writable<string>('C')
export const scale = writable<string>('Major')
export const target = writable<Note | undefined>(undefined)
export const played = writable<(Note & { started: number })[]>([])
export const score = derived([key, target, played], ([k, t, p]) => ({
  key: k,
  target: t,
  played: p
}))

function removePlayedNotes(notes: (Note & { started: number })[]): (Note & { started: number })[] {
  if (notes.length > 0) {
    const now = Date.now()
    let next = now
    const updated = notes.filter(n => {
      if (n.started + PLAYED_DURATION <= now) {
        next = Math.min(next, n.started)
      }
      return n.started + PLAYED_DURATION > now
    })
    if (!timeout) {
      timeout = setTimeout(
        () => {
          timeout = undefined
          played.update(removePlayedNotes)
        },
        now - next + 100
      )
    }
    return updated
  }
  return notes
}

export const scoreActions = {
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
  pushPlayed(note: Note) {
    played.update(v => [...v, { ...note, started: Date.now() }])
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = undefined
        played.update(removePlayedNotes)
      }, 2000)
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
