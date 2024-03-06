import type { ScaleNote } from '@/chords-and-scales'

export type HotkeydRows = 'middle-row' | 'two-rows'
export interface KeyboardOptions {
  hotkeydRows?: HotkeydRows
  layoutName?: string
}
export interface Layout {
  layout: {
    default: [string, string, string, string, string]
    shift: [string, string, string, string, string]
  }
}
export interface KeyboardKey {
  key: string
  code: string
  size?: number
  noteSeq?: number
  note?: ScaleNote
}

export type Ok<T> = {
  data: T
}
export type Err = {
  err: string
  code: number
}
export type Result<T> = Ok<T> | Err

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
