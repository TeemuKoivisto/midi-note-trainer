import { CODES } from './codes'

import { LayoutImport, Rows } from './types'

/**
 * Converts imported layout from ANSI to ISO
 * https://en.wikipedia.org/wiki/Keyboard_layout#Physical,_visual,_and_functional_layouts
 * @param hotkeydRows
 */
export function rowsFromImport(hotkeydRows: LayoutImport): Rows {
  let cut2nd: string[] = []
  const letters: string[][] = hotkeydRows.default.map((row, rowIndex) => {
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
  return [
    letters[0].map((key, keyIndex) => ({ key, code: CODES[0][keyIndex] })),
    letters[1].map((key, keyIndex) => ({ key, code: CODES[1][keyIndex] })),
    letters[2].map((key, keyIndex) => ({ key, code: CODES[2][keyIndex] })),
    letters[3].map((key, keyIndex) => ({ key, code: CODES[3][keyIndex] }))
  ]
}
