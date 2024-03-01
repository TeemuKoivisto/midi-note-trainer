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

type RemoveSecondParam<T extends any[]> = T extends [infer T, T[1], ...infer O] ? [T, ...O] : never

export interface GameConstructors {
  notes: RemoveSecondParam<ConstructorParameters<typeof GuessNotes>>
  pitches: RemoveSecondParam<ConstructorParameters<typeof GuessNotes>>
  'keys-major': RemoveSecondParam<ConstructorParameters<typeof GuessKeys>>
  'keys-minor': RemoveSecondParam<ConstructorParameters<typeof GuessKeys>>
  'chords-write': RemoveSecondParam<ConstructorParameters<typeof GuessChords>>
  'chords-play': RemoveSecondParam<ConstructorParameters<typeof GuessChords>>
  'chords-diatonic': RemoveSecondParam<ConstructorParameters<typeof GuessChords>>
}
