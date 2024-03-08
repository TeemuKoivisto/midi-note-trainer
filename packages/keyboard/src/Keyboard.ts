import en from 'simple-keyboard-layouts/build/layouts/english'

import { setNotesForMiddleRow } from './setNotes'
import { parseLayout } from './importLayout'

import type { ScaleNote } from '@/chords-and-scales'
import { KeyboardKey, KeyboardOptions, LayoutImport, Rows } from './types'
import { rowsFromImport } from 'rowsFromImport'

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
    return this.loadRowsFromImport(this.opts.layout.imported)
  }

  setOptions(opts: Partial<KeyboardOptions>) {
    this.opts = { ...this.opts, ...opts }
  }

  loadRowsFromImport(imported: LayoutImport) {
    this.rows = rowsFromImport(imported)
    return this
  }

  setRows(rows: Rows) {
    this.rows = rows
    return this
  }

  setRowHotkeys(row: number, keys: KeyboardKey[]) {}

  setNotes(notes: ScaleNote[]) {
    if (this.opts.hotkeydRows === 'middle-row') {
      this.rows = setNotesForMiddleRow(this.rows, notes)
    } else {
      throw Error('not implemented')
    }
  }

  static createWithRows(opts: KeyboardOptions, rows: Rows) {
    return new Keyboard(opts).setRows(rows)
  }
}
