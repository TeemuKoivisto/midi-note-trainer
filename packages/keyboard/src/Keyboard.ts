import en from 'simple-keyboard-layouts/build/layouts/english'

import { setNotesForMiddleRow } from './setNotes'
import { parseLayout } from './importLayout'

import type { ScaleNote } from '@/chords-and-scales'
import { KeyboardOptions, LayoutImport, Rows } from './types'
import { convertLayout } from 'convertLayout'

export class Keyboard {
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
    this.rows = convertLayout(hotkeydRows)
  }

  setNotes(notes: ScaleNote[]) {
    if (this.opts.hotkeydRows === 'middle-row') {
      this.rows = setNotesForMiddleRow(this.rows, notes)
    } else {
      throw Error('not implemented')
    }
  }
}
