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
export interface Interval {
  str: string
  seq: number
  flats: number
  sharps: number
}
export interface RawScale {
  name: string
  synonyms?: string[]
  tones: number[]
  intervals: Interval[]
}
export interface ScaleNote {
  note: string
  order: number // convert to semitones from C???
  flats: number
  sharps: number
}
export interface Scale {
  key: string // eg C
  scale: string // eg major
  keySignature: string // using standard diatonic accidentals
  intervals: Interval[]
  scaleNotes: ScaleNote[]
  notesMap: Map<number, ScaleNote> // all 12 semitones of octave
}
