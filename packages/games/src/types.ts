import type { Scale, MidiNote } from '@/chords-and-scales'

export type GameType =
  | 'notes'
  | 'pitches'
  | 'keys-major'
  | 'keys-minor'
  | 'chords-write'
  | 'chords-play'
  | 'chords-diatonic'

export interface BaseOptions {
  scale: Scale
  range: [number, number]
  duplicates: boolean
  count: number
}
