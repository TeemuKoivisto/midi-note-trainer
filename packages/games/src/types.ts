import type { Chord, Scale, MidiNote, MidiChord } from '@/chords-and-scales'
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

export interface GuessChordsOptions {
  chords: (Chord & { allowed?: Set<number> })[]
  onlyScale?: boolean
}

export interface OptionsMap {
  notes: undefined
  pitches: undefined
  'keys-major': undefined
  'keys-minor': undefined
  'chords-write': GuessChordsOptions
  'chords-play': GuessChordsOptions
  'chords-diatonic': GuessChordsOptions
}
