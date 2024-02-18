export interface Note {
  note: string
  semitones: number
  midi: number
  sharps: number
  flats: number
  parts: [string, string, number]
}
