import type { Scale, MidiNote } from '@/chords-and-scales'
import type { GuessChords } from './GuessChords'
import type { GuessKeys } from './GuessKeys'
import type { GuessNotes } from './GuessNotes'

export type GameType =
  | 'notes'
  | 'pitches'
  | 'keys-major'
  | 'keys-minor'
  | 'chords-write'
  | 'chords-play'
  | 'chords-diatonic'

export type GameInstance = GuessNotes | GuessKeys | GuessChords

export interface BaseOptions {
  scale: Scale
  range: [number, number]
  duplicates: boolean
  count: number
}
