import { derived, get, writable } from 'svelte/store'

import type { Note } from '@/types'

export const key = writable<string>('C')
export const scale = writable<string>('Major')
export const target = writable<Note | undefined>(undefined)
export const played = writable<(Note & { correct: boolean }) | undefined>(undefined)
export const score = derived([key, target, played], ([k, t, p]) => ({
  key: k,
  target: t,
  played: p
}))

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
  setPlayed(val?: Note & { correct: boolean }) {
    played.set(val)
  },
  clearScore() {
    target.set(undefined)
    played.set(undefined)
  }
}
