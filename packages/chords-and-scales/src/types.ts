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
  intervals: Interval[]
  type: ChordType
}
export type MidiChord = Chord & {
  note: string
  short: string
  notes: MidiNote[]
}
export interface Interval {
  str: string
  seq: number
  flats: number
  sharps: number
}
export interface RawScale {
  name: string
  synonyms?: string[]
  intervals: Interval[]
}
export interface ScaleNote {
  note: string
  order: number // convert to semitones from C???
  flats: number
  sharps: number
}
export interface ScaleTriad {
  parts: [string, string]
  degree: number
  major: boolean
  minor: boolean
  semitones: Set<number>
}
export type MidiNote = ScaleNote & { midi: number }
export interface Scale {
  key: string // eg C
  scale: string // eg major
  flats: number
  sharps: number
  majorSignature: string // using standard diatonic accidentals
  intervals: Interval[]
  scaleNotes: ScaleNote[]
  triads: ScaleTriad[]
  notesMap: Map<number, ScaleNote> // all 12 semitones of octave
}
