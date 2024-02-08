import { getRootNote } from '../utils'

describe('getRootNote', () => {
  it('should generate correct root notes', () => {
    const correct = {
      C: {
        note: 'C',
        order: 0,
        flats: 0,
        sharps: 0
      },
      'C♯': {
        note: 'C♯',
        order: 1,
        flats: 0,
        sharps: 1
      },
      'C♯♯': {
        note: 'C♯♯',
        order: 2,
        flats: 0,
        sharps: 2
      },
      Db: {
        note: 'Db',
        order: 1,
        flats: 1,
        sharps: 0
      },
      'F♭': {
        note: 'F♭',
        order: 4,
        flats: 1,
        sharps: 0
      },
      'F♭♭': {
        note: 'F♭♭',
        order: 3,
        flats: 2,
        sharps: 0
      },
      'A#': {
        note: 'A#',
        order: 10,
        flats: 0,
        sharps: 1
      },
      'B♯': {
        note: 'B♯',
        order: 0,
        flats: 0,
        sharps: 1
      },
      H: undefined
    }
    Object.entries(correct).forEach(([key, values]) => {
      expect(getRootNote(key)).toEqual(values)
    })
  })
})
