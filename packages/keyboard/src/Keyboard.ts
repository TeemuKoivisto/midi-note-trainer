import en from './layouts/english'
import sw from './layouts/swedish'

import type { ScaleNote } from '@/chords-and-scales'
import { KeyboardKey, Layout } from './types'

type LayoutType = 'middle-row' | 'two-rows'
interface Options {
  layout: LayoutType
}

type Rows = [KeyboardKey[], KeyboardKey[], KeyboardKey[], KeyboardKey[]]

export class Keyboard {
  language = 'en'
  opts: Options

  rows: Rows = [[], [], [], []]

  constructor(opts: Options = { layout: 'middle-row' }) {
    this.opts = opts
    this.setLayout(sw)
  }

  setOptions(opts: Partial<Options>) {
    this.opts = { ...this.opts, ...opts }
  }

  setLayout(layout: Layout) {
    const rows: Rows = [[], [], [], []]
    layout.layout.default.forEach((v, rowIndex) => {
      v.split(' ').forEach((key, _keyIndex) => {
        if (rowIndex < 4) {
          rows[rowIndex].push({ key, code: 0 })
        }
      })
    })
    this.rows = rows
  }

  setNotes(notes: Map<number, ScaleNote>) {
    if (this.opts.layout === 'middle-row') {
      this.rows[1].forEach((_, idx) => {
        if (idx === 2) {
          this.rows[1][idx].note = notes.get(1)
        } else if (idx === 3) {
          this.rows[1][idx].note = notes.get(3)
        } else if (idx === 5) {
          this.rows[1][idx].note = notes.get(6)
        } else if (idx === 6) {
          this.rows[1][idx].note = notes.get(8)
        } else if (idx === 7) {
          this.rows[1][idx].note = notes.get(10)
        } else if (idx === 9) {
          this.rows[1][idx].note = notes.get(1)
        } else if (idx === 10) {
          this.rows[1][idx].note = notes.get(3)
        }
      })
      this.rows[2].forEach((_, idx) => {
        if (idx === 1) {
          this.rows[2][idx].note = notes.get(0)
        } else if (idx === 2) {
          this.rows[2][idx].note = notes.get(2)
        } else if (idx === 3) {
          this.rows[2][idx].note = notes.get(4)
        } else if (idx === 4) {
          this.rows[2][idx].note = notes.get(5)
        } else if (idx === 5) {
          this.rows[2][idx].note = notes.get(7)
        } else if (idx === 6) {
          this.rows[2][idx].note = notes.get(9)
        } else if (idx === 7) {
          this.rows[2][idx].note = notes.get(11)
        } else if (idx === 8) {
          this.rows[2][idx].note = notes.get(0)
        } else if (idx === 9) {
          this.rows[2][idx].note = notes.get(2)
        } else if (idx === 10) {
          this.rows[2][idx].note = notes.get(4)
        } else if (idx === 11) {
          this.rows[2][idx].note = notes.get(5)
        } else if (idx === 12) {
          this.rows[2][idx].note = notes.get(7)
        }
      })
    }
  }
}
