import en from './layouts/english'
import sw from './layouts/swedish'

import { CODES } from './codes'
import { setNotesForMiddleRow } from './setNotes'

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
      v.split(' ').forEach((key, keyIndex) => {
        if (rowIndex < 4) {
          rows[rowIndex].push({ key, code: CODES[rowIndex][keyIndex] })
        }
      })
    })
    this.rows = rows
  }

  setNotes(notes: ScaleNote[]) {
    if (this.opts.layout === 'middle-row') {
      this.rows = setNotesForMiddleRow(this.rows, notes)
    }
  }
}
