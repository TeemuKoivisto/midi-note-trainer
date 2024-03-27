import { CODES } from './codes'

import { HotkeydRows, LayoutImport, Rows } from './types'

/**
 * Converts imported layout from ANSI to ISO
 * https://en.wikipedia.org/wiki/Keyboard_layout#Physical,_visual,_and_functional_layouts
 * @param imported
 */
export function rowsFromImport(imported: LayoutImport, hotkeydRows: HotkeydRows): Rows {
  let cut2nd: string[] = []
  const letters: string[][] = imported.default.map((row, rowIndex) => {
    if (rowIndex === 0) {
      const split = row.split(' ').filter(v => v !== '{bksp}')
      while (split.length !== 13) {
        if (split.length < 13) {
          // Needed for czech
          split.unshift('{empty}')
        } else {
          // For belarusian
          split.shift()
        }
      }
      return [...split, '{bksp}']
    } else if (rowIndex === 1) {
      // Move the last letter from 2nd row since my keyboard is in double-tall Enter layout
      // to 3rd row
      const split = row.split(' ')
      cut2nd = split.slice(13)
      return [...split.slice(0, 13), '{enter}']
    } else if (rowIndex === 2) {
      return [
        ...row
          .split(' ')
          .slice(0, 13)
          .filter(v => v !== '{enter}'),
        ...cut2nd
      ].slice(0, 13)
    } else if (rowIndex === 3) {
      const split = [
        '{shift}',
        ...row
          .split(' ')
          .slice(1, 12)
          .filter(v => v !== '{shift}'),
        '{shift}'
      ]
      let side = 1
      while (split.length < 13) {
        split.splice(side, 0, '{empty}')
        side = side === 1 ? -1 : 1
      }
      return split
    } else {
      return row.split(' ')
    }
  })
  let codes: string[][]
  // Incase import used custom codes, parse the from the strings
  if (imported.codes) {
    codes = imported.codes.map(c => c.split(' '))
  } else {
    codes = CODES
  }
  const keys = [0, 1, 2, 3].map(idx =>
    letters[idx].map((key, keyIndex) => ({ key, code: codes[idx][keyIndex] }))
  )
  return [
    {
      keyType: hotkeydRows === 'two-rows' ? 'black' : null,
      // In ISO layout top row, there's 2 keys (§ and 1) that are to the left of Q -> offset by 2
      startNoteOffset: 2,
      availableNotes: 11,
      keys: keys[0]
    },
    {
      keyType: hotkeydRows === 'two-rows' ? 'white' : 'black',
      // In ISO keyboard, the Q key is to the left of A -> start black keys from W instead
      // If two rows is used however, start the white keys from Q
      startNoteOffset: hotkeydRows === 'two-rows' ? 1 : 2,
      availableNotes: 12,
      keys: keys[1]
    },
    {
      keyType: hotkeydRows === 'two-rows' ? 'black' : 'white',
      // Start from A
      startNoteOffset: 1,
      availableNotes: 12,
      keys: keys[2]
    },
    {
      keyType: hotkeydRows === 'two-rows' ? 'white' : null,
      // Start from < or whatever it's in different locales
      startNoteOffset: 1,
      availableNotes: 11,
      keys: keys[3]
    }
  ]
}
