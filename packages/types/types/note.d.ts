export interface Note {
  note: string
  order: number
  midi: number
  sharps: number
  flats: number
  parts: [string, string, number]
}
