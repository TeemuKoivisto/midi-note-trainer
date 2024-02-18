import { getRootNote } from '../notes'

describe('getRootNote', () => {
  it('should generate correct root notes', () => {
    const correct = {
      C: {
        note: 'C',
        semitones: 0,
        flats: 0,
        sharps: 0
      },
      'C♯': {
        note: 'C♯',
        semitones: 1,
        flats: 0,
        sharps: 1
      },
      'C♯♯': {
        note: 'C♯♯',
        semitones: 2,
        flats: 0,
        sharps: 2
      },
      Db: {
        note: 'Db',
        semitones: 1,
        flats: 1,
        sharps: 0
      },
      'F♭': {
        note: 'F♭',
        semitones: 4,
        flats: 1,
        sharps: 0
      },
      'F♭♭': {
        note: 'F♭♭',
        semitones: 3,
        flats: 2,
        sharps: 0
      },
      'A#': {
        note: 'A#',
        semitones: 10,
        flats: 0,
        sharps: 1
      },
      'B♯': {
        note: 'B♯',
        semitones: 0,
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
