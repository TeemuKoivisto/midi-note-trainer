import { LayoutItem } from 'simple-keyboard-layouts/build/interfaces'

import { rowsFromImport } from '../rowsFromImport'
import { importLayout, LAYOUTS, parseLayout } from '../importLayout'

import { Rows } from '../types'

function lengths(rows: Rows) {
  return `${rows[0].keys.length} ${rows[1].keys.length} ${rows[2].keys.length} ${rows[3].keys.length}`
}

describe('rowsFromImport', () => {
  it('should convert english layout into ISO with one empty button', async () => {
    const layout = await importLayout(['en'])
    const rows = rowsFromImport(layout.imported, 'middle-row')
    expect(lengths(rows)).toEqual('14 14 13 13')
    expect(rows[0].keys.map(v => v.key).join(' ')).toEqual(layout.imported.default[0])
    expect(rows[1].keys.map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[1].slice(0, 30)}{enter}`
    )
    expect(rows[2].keys.map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[2].slice(0, 29)}\\`
    )
    const s = layout.imported.default[3]
    expect(rows[3].keys.map(v => v.key).join(' ')).toEqual(`${s.slice(0, 7)} {empty} ${s.slice(8)}`)
  })
  it('should convert swedish layout into ISO with all keys kepts', async () => {
    const layout = await importLayout(['sv'])
    const rows = rowsFromImport(layout.imported, 'middle-row')
    expect(lengths(rows)).toEqual('14 14 13 13')
    expect(rows[0].keys.map(v => v.key).join(' ')).toEqual(layout.imported.default[0])
    expect(rows[1].keys.map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[1].slice(0, 30)} {enter}`
    )
    expect(rows[2].keys.map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[2].slice(0, 28)} '`
    )
    const s = layout.imported.default[3]
    expect(rows[3].keys.map(v => v.key).join(' ')).toEqual(`${s.slice(0, 7)} < ${s.slice(10)}`)
  })
  it('should convert belarusian layout into ISO which has more keys than normal', async () => {
    const layout = await importLayout(['be'])
    const rows = rowsFromImport(layout.imported, 'middle-row')
    expect(lengths(rows)).toEqual('14 14 13 13')
    expect(rows[0].keys.map(v => v.key).join(' ')).toEqual(`${layout.imported.default[0].slice(2)}`)
    expect(rows[1].keys.map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[1].slice(0, 29)} {enter}`
    )
    expect(rows[2].keys.map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[2].slice(0, 30)}`
    )
    const s = layout.imported.default[3]
    expect(rows[3].keys.map(v => v.key).join(' ')).toEqual(`${s.slice(0, 30)}{shift}`)
  })
  it('should convert czech layout into ISO which one missing key in 1st row', async () => {
    const layout = await importLayout(['cs'])
    const rows = rowsFromImport(layout.imported, 'middle-row')
    expect(lengths(rows)).toEqual('14 14 13 13')
    expect(rows[0].keys.map(v => v.key).join(' ')).toEqual(
      `{empty} ${layout.imported.default[0].slice(0, 23)} {bksp}`
    )
    expect(rows[1].keys.map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[1].slice(0, 29)} {enter}`
    )
    expect(rows[2].keys.map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[2].slice(0, 28)} ¨`
    )
    const s = layout.imported.default[3]
    expect(rows[3].keys.map(v => v.key).join(' ')).toEqual(`${s.slice(0, 30)}{shift}`)
  })
  it('should convert hindi layout into ISO which has two missing keys in 3rd row', async () => {
    const layout = await importLayout(['hi'])
    const rows = rowsFromImport(layout.imported, 'middle-row')
    expect(lengths(rows)).toEqual('14 14 13 13')
    expect(rows[0].keys.map(v => v.key).join(' ')).toEqual(`${layout.imported.default[0]}`)
    expect(rows[1].keys.map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[1].slice(0, 29)} {enter}`
    )
    expect(rows[2].keys.map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[2].slice(0, 28)} ॉ`
    )
    const s = layout.imported.default[3]
    expect(rows[3].keys.map(v => v.key).join(' ')).toEqual(
      `{shift} {empty} ${s.slice(8, 25)} {empty} {shift}`
    )
  })
  it('should produce 14 14 13 13 rows for all layouts', async () => {
    const rows = await Promise.all(
      Object.values(LAYOUTS).map(v => v.import.then(v => parseLayout(v.default as LayoutItem)))
    )
    expect(rows.map(v => lengths(rowsFromImport(v, 'middle-row')))).toEqual(
      rows.map(_ => '14 14 13 13')
    )
  })
})
