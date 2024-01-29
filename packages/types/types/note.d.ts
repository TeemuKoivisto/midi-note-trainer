export interface Note {
  note: string
  absolute: string
  order: number
  value: number
  octave: number
  sharp: boolean
  flat: boolean
  parts: [string, string, number]
}
