import { convertLayout } from '../convertLayout'
import { importLayout } from '../importLayout'

import { Rows } from '../types'

function lengths(rows: Rows) {
  return `${rows[0].length} ${rows[1].length} ${rows[2].length} ${rows[3].length}`
}

describe('convertLayout', () => {
  it('should convert english layout into ISO with one empty button', async () => {
    const layout = await importLayout(['en'])
    const converted = convertLayout(layout.imported)
    expect(lengths(converted)).toEqual('14 14 13 13')
    expect(converted[0].map(v => v.key).join(' ')).toEqual(layout.imported.default[0])
    expect(converted[1].map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[1].slice(0, 30)}{enter}`
    )
    expect(converted[2].map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[2].slice(0, 29)}\\`
    )
    const s = layout.imported.default[3]
    expect(converted[3].map(v => v.key).join(' ')).toEqual(`${s.slice(0, 7)} {empty} ${s.slice(8)}`)
  })
  it('should convert swedish layout into ISO with all keys kepts', async () => {
    const layout = await importLayout(['sv'])
    const converted = convertLayout(layout.imported)
    expect(lengths(converted)).toEqual('14 14 13 13')
    expect(converted[0].map(v => v.key).join(' ')).toEqual(layout.imported.default[0])
    expect(converted[1].map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[1].slice(0, 30)} {enter}`
    )
    expect(converted[2].map(v => v.key).join(' ')).toEqual(
      `${layout.imported.default[2].slice(0, 28)} '`
    )
    const s = layout.imported.default[3]
    expect(converted[3].map(v => v.key).join(' ')).toEqual(`${s.slice(0, 7)} < ${s.slice(10)}`)
  })
})
