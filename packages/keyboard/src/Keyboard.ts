import en from 'simple-keyboard-layouts/build/layouts/english'

import { getNote, setNotes } from './setNotes'
import { parseLayout } from './importLayout'

import type { ScaleNote } from '@/chords-and-scales'
import { KeyboardKey, KeyboardOptions, LayoutImport, Row, Rows } from './types'
import { rowsFromImport } from 'rowsFromImport'

interface SetCustomRow {
  row: Row
  rowIndex: number
  nextKeyIdx: number
  nextNoteOffset: number
}

const EMPTY_ROWS: Rows = [
  { keyType: undefined, startNoteOffset: 0, availableNotes: 0, keys: [] },
  { keyType: undefined, startNoteOffset: 0, availableNotes: 0, keys: [] },
  { keyType: undefined, startNoteOffset: 0, availableNotes: 0, keys: [] },
  { keyType: undefined, startNoteOffset: 0, availableNotes: 0, keys: [] }
]

export class Keyboard {
  opts: Required<KeyboardOptions>
  rows: Rows = EMPTY_ROWS
  setCustomRow: SetCustomRow = {
    row: EMPTY_ROWS[0],
    rowIndex: 0,
    nextKeyIdx: -1,
    nextNoteOffset: 0
  }

  constructor(opts?: KeyboardOptions) {
    this.opts = {
      hotkeydRows: 'middle-row',
      isCustom: false,
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
    this.rows = rowsFromImport(imported, this.opts.hotkeydRows)
    return this
  }

  setRows(rows: Rows) {
    this.rows = rows
    return this
  }

  setNotes(notes: ScaleNote[]) {
    if (this.opts.hotkeydRows === 'middle-row') {
      const { firstIndex } = setNotes(this.rows[2], notes)
      setNotes(this.rows[1], notes, 1 + firstIndex)
    } else {
      const { firstIndex: bottomFirstWhite, lastIndex } = setNotes(this.rows[3], notes)
      setNotes(this.rows[2], notes, bottomFirstWhite)
      const { firstIndex: topFirstWhite } = setNotes(this.rows[1], notes, 0, lastIndex + 1)
      setNotes(this.rows[0], notes, 1 + topFirstWhite, lastIndex + 1)
    }
  }

  startSetCustomRow(rowIndex: number) {
    const row = {
      ...this.rows[rowIndex],
      keys: this.rows[rowIndex].keys.map(r => ({ ...r }))
    }
    const { availableNotes: count, startNoteOffset: first } = row
    this.setCustomRow = {
      row,
      rowIndex,
      nextKeyIdx: first,
      nextNoteOffset: 0
    }
    console.log('this.setCustomRow', this.setCustomRow)
    return { first, count }
  }

  setNextCustomNote(key: string, code: string, notes: ScaleNote[]) {
    let rowKey
    const { nextKeyIdx, nextNoteOffset, row } = this.setCustomRow
    const index = nextKeyIdx - nextNoteOffset - row.startNoteOffset
    const note = getNote(row, notes, index)
    if (note) {
      rowKey = { key, code, note }
    } else {
      rowKey = { key, code }
    }
    this.setCustomRow.nextKeyIdx += 1
    return {
      index: this.setCustomRow.nextKeyIdx,
      key: rowKey
    }
  }

  skipNextCustomNote() {
    this.setCustomRow.nextKeyIdx += 1
    this.setCustomRow.nextNoteOffset += 1
    return {
      index: this.setCustomRow.nextKeyIdx,
      key: { code: 'EMPTY', key: '{empty}' }
    }
  }
}
