import en from 'simple-keyboard-layouts/build/layouts/english'

import { CODES } from './codes'
import { setNotesForMiddleRow } from './setNotes'
import { parseLayout } from './importLayout'

import type { ScaleNote } from '@/chords-and-scales'
import { KeyboardKey, KeyboardOptions, Layout, LayoutImport } from './types'

type Rows = [KeyboardKey[], KeyboardKey[], KeyboardKey[], KeyboardKey[]]

export class Keyboard {
  language = 'en'
  opts: Required<KeyboardOptions>

  rows: Rows = [[], [], [], []]

  constructor(opts?: KeyboardOptions) {
    this.opts = {
      hotkeydRows: 'middle-row',
      layout: {
        code: 'en',
        name: 'English',
        imported: parseLayout(en)
      },
      ...opts
    }
    this.setLayout(this.opts.layout.imported)
  }

  setOptions(opts: Partial<KeyboardOptions>) {
    this.opts = { ...this.opts, ...opts }
  }

  setLayout(hotkeydRows: LayoutImport) {
    const rows: Rows = [[], [], [], []]
    hotkeydRows.default.forEach((v, rowIndex) => {
      let removed2ndRowKey: string | undefined
      v.split(' ').forEach((key, keyIndex) => {
        if (rowIndex === 1 && keyIndex === 13) {
          // Move the last letter from 2nd row since my keyboard is in double-tall Enter layout
          // to 3rd row
          removed2ndRowKey = key
          rows[rowIndex].push({ key: '{enter}', code: 'Enter' })
        } else if ((rowIndex === 1 && keyIndex >= 14) || (rowIndex === 2 && keyIndex >= 13)) {
        } else if (rowIndex === 2 && keyIndex === 12) {
          rows[rowIndex].push({ key: removed2ndRowKey || '?', code: 'mystery' })
        } else if (rowIndex < 4) {
          rows[rowIndex].push({ key, code: CODES[rowIndex][keyIndex] })
        }
        if (rowIndex === 3 && keyIndex === 0) {
          rows[rowIndex].push({ key: '>', code: 'Backquote' })
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
