export type ChordType =
  | 'major'
  | 'minor'
  | 'augmented'
  | 'diminished'
  | 'indeterminate'
  | 'predominant'
  | 'suspended'
  | 'M3+d5'
  | 'just'
  | 'bitonal'
  | 'atonal'

export interface Chord {
  name: string
  suffixes: string[]
  type: ChordType
  intervals: Interval[]
}
export type MidiChord = Chord & {
  rootNote: string
  chord: string
  notes: MidiNote[]
}
export interface Pitch {
  semitones: number // Semitones from C
  flats: number
  sharps: number
}
export type Interval = Pitch & {
  interval: string
  interval_seq: number
}
export interface RawScale {
  names: string[]
  intervals: Interval[]
  trichords: ScaleTrichord[]
}
export type ScaleNote = Pitch & {
  note: string
}
export type MidiNote = ScaleNote & { midi: number }
export interface ScaleTrichord {
  degree: number
  roman: string
  suffix: string
  major: boolean
  minor: boolean
  semitones: Set<number>
}
export interface Scale {
  key: string // eg C
  scale: string // eg major
  names: string[]
  flats: number
  sharps: number
  majorSignature: string // using standard diatonic accidentals
  intervals: Interval[]
  scaleNotes: ScaleNote[]
  trichords: ScaleTrichord[]
  notesMap: Map<number, ScaleNote> // all 12 semitones of octave
}
export type Ok<T> = {
  data: T
}
export type Err = {
  err: string
  code: number
}
export type Result<T> = Ok<T> | Err
