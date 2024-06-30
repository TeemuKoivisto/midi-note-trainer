import { getOctave, getRootNote, normalizeKey } from '../notes'

describe('normalizeKey', () => {
  it('should parse raw and normalize raw keys', () => {
    expect(normalizeKey('C')).toEqual('C')
    expect(normalizeKey('Cb')).toEqual('C♭')
    expect(normalizeKey('D#')).toEqual('D♯')
    expect(normalizeKey('B#b')).toEqual('B♯♭')
    expect(normalizeKey('Hss')).toEqual('')
    expect(normalizeKey('Css')).toEqual('C♯♯')
    expect(normalizeKey('F♭')).toEqual('F♭')
    expect(normalizeKey('F♭4')).toEqual('F♭')
    expect(normalizeKey('F4#')).toEqual('F♯')
    expect(normalizeKey('H')).toEqual('')
    expect(normalizeKey('GB♭b')).toEqual('G♭♭♭')
    expect(normalizeKey('BBBBBBs')).toEqual('B♭♭♭♭♭♯')
    expect(normalizeKey('asSSABCS')).toEqual('A♯♯♯♭♯')
    expect(normalizeKey('axblöegpa')).toEqual('A♭')
    expect(normalizeKey('xblöegpa')).toEqual('')
  })
})

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
    // C0
    expect(getOctave({ midi: 12, flats: 0, sharps: 0 })).toEqual(0)
    // Cb0
    expect(getOctave({ midi: 11, flats: 1, sharps: 0 })).toEqual(0)
    expect(getOctave({ midi: 0, flats: 0, sharps: 0 })).toEqual(-1)
  })
})
