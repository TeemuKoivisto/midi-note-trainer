import type { RawScale } from './types'

export function findScale(scaleName: string): RawScale | undefined {
  let scale = scales.get(scaleName)
  if (!scale) {
    const name = scaleName.toLowerCase()
    const found = Array.from(scales.entries()).find(
      ([k, v]) =>
        k.toLowerCase() === name ||
        v.name.toLowerCase() === name ||
        v.synonyms?.find(n => n.toLowerCase() === name)
    )
    if (found) {
      scale = found[1]
    }
  }
  return scale
}

// https://github.com/Zachacious/MusicTheoryJS/blob/65572a7bf58e0485f250bd92748fdd1e975f4a90/src/scale/scaleTemplates.ts
// All scales should equal to 12 semitones
// https://en.wikipedia.org/wiki/List_of_musical_scales_and_modes
// https://plucknplay.github.io/en/scale-list.html
// https://www.jazz-guitar-licks.com/pages/guitar-scales-modes/
// https://www.omnicalculator.com/other/music-scale
export const scales = new Map<string, RawScale>([
  [
    'major',
    {
      name: 'Major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'majorPentatonic',
    {
      name: 'Major Pentatonic',
      synonyms: ['Mongolian'],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'majorPentatonicBlues',
    {
      name: 'Major Pentatonic Blues',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'suspendedPentatonic',
    {
      name: 'Suspended Pentatonic',
      synonyms: ['Egyptian'],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'scottishPentatonic',
    {
      name: 'Scottish Pentatonic',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'harmonicMajor',
    {
      name: 'Harmonic Major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'doubleHarmonic',
    {
      name: 'Double Harmonic',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'minor',
    {
      name: 'Minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'minorPentatonic',
    {
      name: 'Minor Pentatonic',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'minorPentatonicBlues',
    {
      name: 'Minor Pentatonic Blues',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'minor6Pentatonic',
    {
      name: 'Minor 6th Pentatonic',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'harmonicMinor',
    {
      name: 'Harmonic Minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'melodicMinorAscending',
    {
      name: 'Melodic Minor Ascending',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'melodicMinorDescending',
    {
      name: 'Melodic Minor Descending',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '1', seq: 1, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'ionian',
    {
      name: 'Ionian',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'dorian',
    {
      name: 'Dorian',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'phrygian',
    {
      name: 'Phrygian',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'phrygianDominant',
    {
      name: 'Phrygian Dominant',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'lydian',
    {
      name: 'Lydian',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'lydianDominant',
    {
      name: 'Lydian Dominant',
      synonyms: ['Acoustic'],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'aeolian',
    {
      name: 'Aeolian',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'mixolydian',
    {
      name: 'Mixolydian',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'mixolydianFlat6',
    {
      name: 'Mixolydian Flat-6',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'locrian',
    {
      name: 'Locrian',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'locrianNatural2',
    {
      name: 'Locrian ♮2',
      synonyms: ['Half-Diminished'],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'superLocrian',
    {
      name: 'Super Locrian',
      synonyms: ['Altered scale'],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '♭4', seq: 4, flats: 1, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'doubleHarmonic',
    {
      name: 'Double Harmonic',
      synonyms: ['Byzantine', 'Arabic'],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'enigmaticMajor',
    {
      name: 'Enigmatic Major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '♯5', seq: 5, flats: 0, sharps: 1 },
        { str: '♯6', seq: 6, flats: 0, sharps: 1 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'enigmaticMinor',
    {
      name: 'Enigmatic Minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♯6', seq: 6, flats: 0, sharps: 1 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'diminishedWholeHalf',
    {
      name: 'Diminished Whole-Half',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'diminishedHalfWhole',
    {
      name: 'Diminished Half-Whole',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '♭4', seq: 4, flats: 1, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'wholeTone',
    {
      name: 'Whole Tone',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '♯5', seq: 5, flats: 0, sharps: 1 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'augmented',
    {
      name: 'Augmented',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♯5', seq: 5, flats: 0, sharps: 1 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'dominant7th',
    {
      name: 'Dominant 7th',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'prometheus',
    {
      name: 'Prometheus',
      synonyms: ['Mystic'],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'overtone',
    {
      name: 'Overtone',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'leadingTone',
    {
      name: 'Leading Tone',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'bebopMajor',
    {
      name: 'Bebop Major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♯5', seq: 5, flats: 0, sharps: 1 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'bebopMinor',
    {
      name: 'Bebop Minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'bebopDominant',
    {
      name: 'Bebop Dominant',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'neapolitanMajor',
    {
      name: 'Neapolitan Major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'neapolitanMinor',
    {
      name: 'Neapolitan Minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'hungarianMajor',
    {
      name: 'Hungarian Major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♯2', seq: 2, flats: 0, sharps: 1 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'hungarianMinor',
    {
      name: 'Hungarian Minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'hungarianGypsy',
    {
      name: 'Hungarian Gypsy',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'spanish',
    {
      name: 'Spanish',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'spanishEightTone',
    {
      name: 'Spanish Eight Tone',
      synonyms: ['Jewish Eight Tone'],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'spanishGypsy',
    {
      name: 'Spanish Gypsy',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'hirajoshi',
    {
      name: 'Hirajoshi',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'japaneseA',
    {
      name: 'Japanese A',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'japaneseB',
    {
      name: 'Japanese B',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'yo',
    {
      name: 'Yo',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'insen',
    {
      name: 'Insen',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'iwato',
    {
      name: 'Iwato',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'oriental',
    {
      name: 'Oriental',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'persian',
    {
      name: 'Persian',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'arabian',
    {
      name: 'Arabian',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '♯5', seq: 5, flats: 0, sharps: 1 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'balinese',
    {
      name: 'Balinese',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'kumoi',
    {
      name: 'Kumoi',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'pelog',
    {
      name: 'Pelog',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'algerian',
    {
      name: 'Algerian',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'chinese',
    {
      name: 'Chinese',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'romanianMajor',
    {
      name: 'Romanian Major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'romanianMinor',
    {
      name: 'Romanian Minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'hindu',
    {
      name: 'Hindu',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭6', seq: 6, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'istrian',
    {
      name: 'Istrian',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '♭4', seq: 4, flats: 1, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'ukrainianDorian',
    {
      name: 'Ukrainian Dorian',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ]
])
