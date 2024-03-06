import en from './layouts/english'
import sw from './layouts/swedish'

import { CODES } from './codes'
import { setNotesForMiddleRow } from './setNotes'

import type { ScaleNote } from '@/chords-and-scales'
import { KeyboardKey, KeyboardOptions, Layout } from './types'

type Rows = [KeyboardKey[], KeyboardKey[], KeyboardKey[], KeyboardKey[]]

export class Keyboard {
  language = 'en'
  opts: Required<KeyboardOptions>

  rows: Rows = [[], [], [], []]

  constructor(opts?: KeyboardOptions) {
    this.opts = {
      hotkeydRows: 'middle-row',
      layoutName: 'en',
      ...opts
    }
    this.setLayout(sw)
  }

  setOptions(opts: Partial<KeyboardOptions>) {
    this.opts = { ...this.opts, ...opts }
  }

  setLayout(hotkeydRows: Layout) {
    const rows: Rows = [[], [], [], []]
    hotkeydRows.layout.default.forEach((v, rowIndex) => {
      v.split(' ').forEach((key, keyIndex) => {
        if (rowIndex < 4) {
          rows[rowIndex].push({ key, code: CODES[rowIndex][keyIndex] })
        }
      })
    })
    this.rows = rows
  }

  setNotes(notes: ScaleNote[]) {
    if (this.opts.hotkeydRows === 'middle-row') {
      this.rows = setNotesForMiddleRow(this.rows, notes)
    } else {
      throw Error('not implemented')
    }
  }
}
