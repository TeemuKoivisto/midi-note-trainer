import { createScaleUnsafe } from '@/chords-and-scales'

import { Keyboard } from '../Keyboard'
import { importLayout } from 'importLayout'

const cmajor = createScaleUnsafe('C', 'major')

describe('Keyboard', () => {
  it('should import english layout', async () => {
    const kbd = new Keyboard()
    kbd.setNotes(Array.from(cmajor.notesMap.values()))
    expect(kbd).toMatchSnapshot()
  })

  it('should map notes to two rows correctly with english layout', async () => {
    const kbd = new Keyboard({ hotkeydRows: 'two-rows' })
    kbd.setNotes(Array.from(cmajor.notesMap.values()))
    expect(kbd).toMatchSnapshot()
  })

  it('should map notes to two rows correctly with swedish layout', async () => {
    const layout = await importLayout(['sv'])
    const kbd = new Keyboard({ hotkeydRows: 'two-rows', layout })
    kbd.setNotes(Array.from(cmajor.notesMap.values()))
    expect(kbd).toMatchSnapshot()
  })
})
