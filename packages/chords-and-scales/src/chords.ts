import type { Chord } from './types'

// https://en.wikipedia.org/wiki/List_of_chords
// https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns
export const chords = new Map<string, Chord>([
  [
    'maj',
    {
      name: 'Major Chord',
      type: 'major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'add6',
    {
      name: 'Major 6th Chord',
      type: 'major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    '6/9',
    {
      name: 'Major 6th/9th Chord',
      type: 'major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 },
        { str: '9', seq: 9, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'maj7',
    {
      name: 'Major 7th Chord',
      type: 'major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'maj9',
    {
      name: 'Major 9th Chord',
      type: 'major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 },
        { str: '9', seq: 9, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'maj11',
    {
      name: 'Major 11th Chord',
      type: 'major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 },
        { str: '9', seq: 9, flats: 0, sharps: 0 },
        { str: '11', seq: 11, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'maj13',
    {
      name: 'Major 13th Chord',
      type: 'major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '7', seq: 7, flats: 0, sharps: 0 },
        { str: '9', seq: 9, flats: 0, sharps: 0 },
        { str: '11', seq: 11, flats: 0, sharps: 0 },
        { str: '13', seq: 13, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'm',
    {
      name: 'Minor Chord',
      type: 'minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'm6',
    {
      name: 'Minor 6th Chord',
      type: 'minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '6', seq: 6, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'm7',
    {
      name: 'Minor 7th Chord',
      type: 'minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'm7b5',
    {
      name: 'Minor 7th Flat Five Chord',
      type: 'minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'm9',
    {
      name: 'Minor 9th Chord',
      type: 'minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 },
        { str: '9', seq: 9, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'm11',
    {
      name: 'Minor 11th Chord',
      type: 'minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 },
        { str: '9', seq: 9, flats: 0, sharps: 0 },
        { str: '11', seq: 11, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'm13',
    {
      name: 'Minor 13th Chord',
      type: 'minor',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 },
        { str: '9', seq: 9, flats: 0, sharps: 0 },
        { str: '11', seq: 11, flats: 0, sharps: 0 },
        { str: '13', seq: 13, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'sus2',
    {
      name: 'Suspended 2nd Chord',
      type: 'suspended',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '2', seq: 2, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'sus4',
    {
      name: 'Suspended 4th Chord',
      type: 'suspended',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭4', seq: 4, flats: 1, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    '7sus4',
    {
      name: 'Suspended 4th Seventh Chord',
      type: 'suspended',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '4', seq: 4, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    '7',
    {
      name: 'Dominant 7th Chord',
      type: 'major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    '9',
    {
      name: 'Dominant 9th Chord',
      type: 'major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 },
        { str: '9', seq: 9, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    '11',
    {
      name: 'Dominant 11th Chord',
      type: 'major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 },
        { str: '9', seq: 9, flats: 0, sharps: 0 },
        { str: '11', seq: 11, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    '13',
    {
      name: 'Dominant 13th Chord',
      type: 'major',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 },
        { str: '9', seq: 9, flats: 0, sharps: 0 },
        { str: '11', seq: 11, flats: 0, sharps: 0 },
        { str: '13', seq: 13, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'dim',
    {
      name: 'Diminished Chord',
      type: 'diminished',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    'dim7',
    {
      name: 'Diminished 7th Chord',
      type: 'diminished',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '♭3', seq: 3, flats: 1, sharps: 0 },
        { str: '♭5', seq: 5, flats: 1, sharps: 0 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ],
  [
    '5',
    {
      name: 'Power Chord',
      type: 'indeterminate',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '5', seq: 5, flats: 0, sharps: 0 }
      ]
    }
  ],
  [
    'aug',
    {
      name: 'Augmented Chord',
      type: 'augmented',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♯5', seq: 5, flats: 0, sharps: 1 }
      ]
    }
  ],
  [
    'aug7',
    {
      name: 'Augmented 7th Chord',
      type: 'augmented',
      intervals: [
        { str: '1', seq: 1, flats: 0, sharps: 0 },
        { str: '3', seq: 3, flats: 0, sharps: 0 },
        { str: '♯5', seq: 5, flats: 0, sharps: 1 },
        { str: '♭7', seq: 7, flats: 1, sharps: 0 }
      ]
    }
  ]
])
