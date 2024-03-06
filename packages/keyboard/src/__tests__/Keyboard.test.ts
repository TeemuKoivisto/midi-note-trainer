import { createScaleUnsafe } from '@/chords-and-scales'

import { Keyboard } from '../Keyboard'

const cmajor = createScaleUnsafe('C', 'major')

describe('Keyboard', () => {
  it('should import english layout', async () => {
    const kbd = new Keyboard()
    kbd.setNotes(Array.from(cmajor.notesMap.values()))
    expect(kbd).toMatchSnapshot()
  })
})
