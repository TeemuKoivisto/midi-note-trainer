import type { ScaleNote } from '@/chords-and-scales'

export type HotkeydRows = 'middle-row' | 'two-rows'
export interface KeyboardOptions {
  hotkeydRows?: HotkeydRows
  isCustom?: boolean
  layout?: Layout
}
export interface Layout {
  code: string
  name: string
  imported: LayoutImport
}
export interface LayoutImport {
  default: [string, string, string, string]
  codes?: [string, string, string, string]
}
export interface KeyboardKey {
  key: string
  code: string
  note?: ScaleNote
}
export interface Row {
  keyType: 'white' | 'black' | null
  startNoteOffset: number
  availableNotes: number
  keys: KeyboardKey[]
}
export type Rows = [Row, Row, Row, Row]
export type Ok<T> = {
  data: T
}
export type Err = {
  err: string
  code: number
}
export type Result<T> = Ok<T> | Err

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
