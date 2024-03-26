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
      const { firstIndex } = setNotes(this.rows[2], notes, true)
      // In ISO keyboard, the Q key is to the left of A -> start black keys from W instead
      setNotes(this.rows[1], notes, false, 1 + firstIndex)
    } else {
      const { firstIndex: bottomFirstWhite, lastIndex } = setNotes(this.rows[3], notes, true)
      // In ISO, the middle row is to the right of bottom row -> no offset needed EXCEPT
      // of course the shift from the first white key (incase it's empty)
      setNotes(this.rows[2], notes, false, bottomFirstWhite)
      const { firstIndex: topFirstWhite } = setNotes(this.rows[1], notes, true, 0, lastIndex + 1)
      // For the top row, there's 2 keys (§ and 1) that are to the left of Q -> offset by 2
      setNotes(this.rows[0], notes, false, 1 + topFirstWhite, lastIndex + 1)
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
    const { hotkeydRows } = this.opts
    const whiteKeys = hotkeydRows === 'two-rows' ? rowIndex === 1 || rowIndex === 3 : rowIndex === 2
    this.setCustomRow = {
      row,
      rowIndex,
      startKeyIndex: first,
      nextKeyIdx: first,
      nextNoteOffset: 0,
      whiteKeys
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

  static createWithRows(opts: KeyboardOptions, rows: Rows) {
    return new Keyboard(opts).setRows(rows)
  }
}
