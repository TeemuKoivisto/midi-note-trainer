export interface Note {
  note: string
  absolute: string
  value: number
  octave: number
  sharp: boolean
  flat: boolean
  parts: [string, string, number]
}
