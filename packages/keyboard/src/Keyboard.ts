import en from 'simple-keyboard-layouts/build/layouts/english'

import { getNote, setNotes } from './setNotes'
import { parseLayout } from './importLayout'

import type { ScaleNote } from '@/chords-and-scales'
import { KeyboardKey, KeyboardOptions, LayoutImport, Rows } from './types'
import { rowsFromImport } from 'rowsFromImport'

interface SetCustomRow {
  row: KeyboardKey[]
  rowIndex: number
  startKeyIndex: number
  nextKeyIdx: number
  nextNoteOffset: number
  whiteKeys: boolean
}

export class Keyboard {
  opts: Required<KeyboardOptions>
  rows: Rows = [[], [], [], []]
  setCustomRow: SetCustomRow = {
    row: [],
    rowIndex: 0,
    startKeyIndex: 0,
    nextKeyIdx: -1,
    nextNoteOffset: 0,
    whiteKeys: false
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
    this.rows = rowsFromImport(imported)
    return this
  }

  setRows(rows: Rows) {
    this.rows = rows
    return this
  }

  setNotes(notes: ScaleNote[]) {
    if (this.opts.hotkeydRows === 'middle-row') {
      setNotes(this.rows[1], notes, false)
      setNotes(this.rows[2], notes, true)
    } else {
      setNotes(this.rows[2], notes, false)
      const last = setNotes(this.rows[3], notes, true)
      setNotes(this.rows[0], notes, false, last - 1)
      setNotes(this.rows[1], notes, true, last)
    }
  }

  startSetCustomRow(rowIndex: number) {
    let first = -1
    let count = 0
    const row = this.rows[rowIndex].map(r => ({ ...r }))
    for (let i = 0; i < row.length; i += 1) {
      const isSpecial = row[i].key.charAt(0) === '{' && row[i].key !== '{empty}'
      if (!isSpecial && first === -1) {
        first = i
      }
      count += isSpecial ? 0 : 1
    }
    if (first === -1) {
      console.error(row)
      throw Error('No valid keyboard key found!')
    }
    this.setCustomRow = {
      row,
      rowIndex,
      startKeyIndex: first,
      nextKeyIdx: first,
      nextNoteOffset: 0,
      whiteKeys: true
    }
    return { first, count }
  }

  setNextCustomNote(key: string, code: string, notes: ScaleNote[]) {
    let rowKey
    const { startKeyIndex, nextKeyIdx, nextNoteOffset, whiteKeys } = this.setCustomRow
    const note = getNote(nextKeyIdx - nextNoteOffset - startKeyIndex, notes, whiteKeys)
    if (note) {
      rowKey = { key, code, note }
    } else {
      rowKey = { key, code }
    }
    this.setCustomRow.nextKeyIdx += 1
    return {
      index: this.setCustomRow.nextKeyIdx,
      key: rowKey,
      done: this.setCustomRow.nextKeyIdx >= this.setCustomRow.row.length
    }
  }

  skipNextCustomNote() {
    this.setCustomRow.nextKeyIdx += 1
    this.setCustomRow.nextNoteOffset += 1
    return {
      index: this.setCustomRow.nextKeyIdx,
      key: { code: 'EMPTY', key: '{empty}' },
      done: this.setCustomRow.nextKeyIdx >= this.setCustomRow.row.length
    }
  }

  static createWithRows(opts: KeyboardOptions, rows: Rows) {
    return new Keyboard(opts).setRows(rows)
  }
}
