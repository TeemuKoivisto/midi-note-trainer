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
export const scales = new Map<string, RawScale>([
  [
    'major',
    {
      name: 'Major',
      tones: [2, 2, 1, 2, 2, 2, 1],
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
    'harmonicMajor',
    {
      name: 'Harmonic Major',
      tones: [2, 2, 1, 2, 1, 3, 1],
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
      tones: [1, 3, 1, 2, 1, 3, 1],
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
      tones: [2, 1, 2, 2, 1, 2, 2],
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
    'harmonicMinor',
    {
      name: 'Harmonic Minor',
      tones: [2, 1, 2, 2, 1, 3, 1],
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
    'minor7b9',
    {
      name: 'Minor7b9',
      tones: [1, 2, 2, 2, 2, 1, 2],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'minor7b5',
    {
      name: 'Minor7b5',
      tones: [2, 1, 2, 1, 2, 2, 2],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'ionian',
    {
      name: 'Ionian',
      tones: [2, 2, 1, 2, 2, 2, 1],
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
    'aeolian',
    {
      name: 'Aeolian',
      tones: [2, 1, 2, 2, 1, 2, 2],
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
    'dorian',
    {
      name: 'Dorian',
      tones: [2, 1, 2, 2, 2, 1, 2],
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
      tones: [1, 2, 2, 2, 1, 2, 2],
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
      name: 'Phrygian dominant',
      tones: [1, 3, 1, 2, 1, 2, 2],
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
      tones: [2, 2, 2, 1, 2, 2, 1],
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
      tones: [2, 2, 2, 1, 2, 1, 2],
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
    'mixolydian',
    {
      name: 'Mixolydian',
      tones: [2, 2, 1, 2, 2, 1, 2],
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
      tones: [2, 2, 1, 2, 1, 2, 2],
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
      tones: [1, 2, 2, 1, 2, 2, 2],
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
    'superLocrian',
    {
      name: 'Super Locrian',
      tones: [1, 2, 1, 2, 2, 2, 2],
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
    'halfDiminished',
    {
      name: 'Half Diminished',
      tones: [2, 1, 2, 1, 2, 2, 2],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭2', seq: 2, flats: 1, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],

  [
    'byzantine',
    {
      name: 'Byzantine',
      tones: [1, 3, 1, 2, 1, 3, 1],
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
    'melodicMinorAscending',
    {
      name: 'Melodic Minor Ascending',
      tones: [2, 1, 2, 2, 2, 2, 1],
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
    'melodicMinorDescending',
    {
      name: 'Melodic Minor Descending',
      tones: [2, 2, 1, 2, 2, 1, 2],
      intervals: [
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
    'majorPentatonic',
    {
      name: 'Major Pentatonic',
      tones: [2, 2, 3, 2, 3],
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
      tones: [2, 1, 1, 3, 2, 3],
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
    'minorPentatonic',
    {
      name: 'Minor Pentatonic',
      tones: [3, 2, 2, 3, 2],
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
      tones: [3, 2, 1, 1, 3, 2],
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
      tones: [3, 2, 2, 2, 3],
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
    'suspendedPentatonic',
    {
      name: 'Suspended Pentatonic',
      synonyms: ['Egyptian'],
      tones: [2, 3, 2, 3, 2],
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
      tones: [2, 3, 2, 2, 3],
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
    'enigmaticMajor',
    {
      name: 'Enigmatic Major',
      tones: [1, 3, 2, 2, 2, 1, 1],
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
      tones: [1, 2, 3, 1, 3, 1, 1],
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
      tones: [2, 1, 2, 1, 2, 1, 2, 1],
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
      tones: [1, 2, 1, 2, 1, 2, 1, 2],
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
      tones: [2, 2, 2, 2, 2, 2],
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
      tones: [3, 1, 3, 1, 3, 1],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♯2', seq: 2, flats: 0, sharps: 1 },
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
      tones: [2, 3, 2, 2, 1, 2],
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
      tones: [2, 2, 2, 3, 1, 2],
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
      tones: [2, 2, 2, 1, 1, 2, 2],
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
      tones: [2, 2, 2, 2, 2, 1, 1],
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
      tones: [2, 2, 1, 2, 1, 1, 2, 1],
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
      tones: [2, 1, 1, 1, 2, 2, 1, 2],
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
      tones: [2, 2, 1, 2, 2, 1, 1, 1],
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
      tones: [1, 2, 2, 2, 2, 2, 1],
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
      tones: [1, 2, 2, 2, 1, 3, 1],
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
      tones: [3, 1, 2, 1, 2, 1, 2],
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
      tones: [2, 1, 3, 1, 1, 3, 1],
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
      tones: [2, 1, 3, 1, 1, 2, 2],
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
      tones: [1, 2, 1, 2, 2, 2, 2],
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
      tones: [1, 2, 1, 1, 1, 2, 2, 2],
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
      tones: [1, 3, 1, 2, 1, 2, 2],
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
    'hirojoshi',
    {
      name: 'Hirojoshi',
      tones: [2, 1, 4, 1, 4],
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
      tones: [1, 4, 1, 3, 3],
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
      tones: [2, 3, 1, 3, 3],
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
      tones: [2, 3, 2, 2, 3],
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
      tones: [1, 4, 2, 3, 2],
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
      tones: [1, 4, 1, 4, 2],
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
      tones: [1, 3, 1, 1, 3, 1, 2],
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
      tones: [1, 3, 1, 1, 2, 3, 1],
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
      tones: [2, 2, 1, 1, 2, 2, 2],
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
      tones: [1, 2, 4, 1, 4],
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
      tones: [2, 1, 4, 2, 2, 1],
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
      tones: [1, 2, 3, 1, 1, 4],
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
      tones: [2, 1, 2, 1, 1, 1, 3, 1],
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
      tones: [4, 2, 1, 4, 1],
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♯4', seq: 4, flats: 0, sharps: 1 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'mongolian',
    {
      name: 'Mongolian',
      tones: [2, 2, 3, 2, 3],
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
    'romanianMajor',
    {
      name: 'Romanian Major',
      tones: [1, 3, 2, 1, 2, 1, 2],
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
      tones: [2, 1, 3, 1, 2, 1, 2],
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
      tones: [2, 2, 1, 2, 1, 2, 2],
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
      tones: [1, 2, 1, 2, 1, 5],
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
      tones: [2, 1, 3, 1, 2, 1, 2],
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
