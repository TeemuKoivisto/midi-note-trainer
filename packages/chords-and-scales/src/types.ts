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
  notes: string[]
  type: ChordType
}
export interface Interval {
  seq: number
  flats: number
  sharps: number
}
export interface ScaleNote {
  note: string
  order: number
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
