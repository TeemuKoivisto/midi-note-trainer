import { CODES } from './codes'

import { LayoutImport, Rows } from './types'

export function layoutFromRows(rows: Rows): LayoutImport {
  const created = [...rows.map(row => row.keys.map(key => key.key).join(' '))] as [
    string,
    string,
    string,
    string
  ]
  const codes: [string, string, string, string] = ['', '', '', '']
  let nonStandard = false
  rows.forEach((row, rowIndex) => {
    const rowCodes = []
    // Parse codes from the layout and check whether it follows the default codes or not
    // NOTE: any {empty} keys will make this nonStandard which shouldn't be the case but oh well
    for (let i = 0; i < row.keys.length; i += 1) {
      rowCodes.push(row.keys[i].code)
      nonStandard = nonStandard || row.keys[i].code !== CODES[rowIndex][i]
    }
    codes[rowIndex] = rowCodes.join(' ')
  })
  if (nonStandard) {
    return {
      default: created,
      codes
    }
  }
  return {
    default: created
  }
}
