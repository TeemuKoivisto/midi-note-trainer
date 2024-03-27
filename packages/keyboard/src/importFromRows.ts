import { LayoutImport, Rows } from './types'

export function layoutFromRows(rows: Rows): LayoutImport {
  const created = [...rows.map(row => row.keys.map(key => key.key).join(' ')), ''] as [
    string,
    string,
    string,
    string,
    string
  ]
  return {
    default: created,
    shift: created
  }
}
