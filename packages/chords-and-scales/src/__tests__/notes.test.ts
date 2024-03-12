import { getOctave, getRootNote } from '../notes'

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

describe('getOctave', () => {
  it('should return correct octaves for notes', () => {
    // C4
    expect(getOctave({ midi: 60, flats: 0, sharps: 0 })).toEqual(4)
    // C#4
    expect(getOctave({ midi: 61, flats: 0, sharps: 1 })).toEqual(4)
    // Cb4
    expect(getOctave({ midi: 59, flats: 1, sharps: 0 })).toEqual(4)

    expect(getOctave({ midi: 71, flats: 1, sharps: 0 })).toEqual(5)
    expect(getOctave({ midi: 12, flats: 0, sharps: 0 })).toEqual(1)
    expect(getOctave({ midi: 11, flats: 1, sharps: 0 })).toEqual(1)
  })
})
