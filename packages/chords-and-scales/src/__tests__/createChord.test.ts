import { chords } from '../chords'
import { createChord } from '../createChord'
import { createScale } from '../createScale'

describe('createChord', () => {
  it('should generate chords from root of C major scale', () => {
    const correct = {
      maj: ['C', 'E', 'G'],
      '6': ['C', 'E', 'G', 'A'],
      '6/9': ['C', 'E', 'G', 'A', 'D'],
      maj7: ['C', 'E', 'G', 'B'],
      maj9: ['C', 'E', 'G', 'B', 'D'],
      maj11: ['C', 'E', 'G', 'B', 'D', 'F'],
      maj13: ['C', 'E', 'G', 'B', 'D', 'F', 'A'],
      m: ['C', 'E♭', 'G'],
      m6: ['C', 'E♭', 'G', 'A'],
      m7: ['C', 'E♭', 'G', 'B♭'],
      m9: ['C', 'E♭', 'G', 'B♭', 'D'],
      m11: ['C', 'E♭', 'G', 'B♭', 'D', 'F'],
      m13: ['C', 'E♭', 'G', 'B♭', 'D', 'F', 'A'],
      sus2: ['C', 'D', 'G'],
      sus4: ['C', 'F♭', 'G'],
      '7sus4': ['C', 'F', 'G', 'B♭'],
      '7': ['C', 'E', 'G', 'B♭'],
      '7#9': ['C', 'E', 'G', 'B♭', 'D♯'],
      '9': ['C', 'E', 'G', 'B♭', 'D'],
      '11': ['C', 'E', 'G', 'B♭', 'D', 'F'],
      '13': ['C', 'E', 'G', 'B♭', 'D', 'F', 'A'],
      dim: ['C', 'E♭', 'G♭'],
      dim7: ['C', 'E♭', 'G♭', 'B♭♭'],
      m7b5: ['C', 'E♭', 'G♭', 'B♭'],
      '5': ['C', 'G'],
      aug: ['C', 'E', 'G♯'],
      aug7: ['C', 'E', 'G♯', 'B♭']
    }
    const created = createScale('C', 'major')
    if ('err' in created) {
      return expect(created.err).toEqual(undefined)
    }
    const scale = created.data
    const obj = Object.keys(correct).reduce(
      (acc, name) => {
        const chord = chords.get(name)
        if (!chord) {
          expect(chord).toBeTruthy()
        } else {
          const notes = createChord(0, scale, chord)
          acc[name] = notes.map(n => n.note)
        }
        return acc
      },
      {} as Record<string, string[]>
    )
    expect(obj).toEqual(correct)
  })
})
