export type ChordType =
  | 'major'
  | 'minor'
  | 'augmented'
  | 'diminished'
  | 'indeterminate'
  | 'predominant'
  | 'suspended'
  | 'M3+d5'
  | 'just'
  | 'bitonal'
  | 'atonal'

interface Chord {
  name: string
  shape: string[]
  type: ChordType
}
// https://en.wikipedia.org/wiki/List_of_chords
// https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns
export const chordsMap = new Map<string, Chord>([
  ['maj', { name: 'Major Chord', shape: ['1', '3', '5'], type: 'major' }],
  ['add6', { name: 'Major 6th Chord', shape: ['1', '3', '5', '6'], type: 'major' }],
  ['6/9', { name: 'Major 6th/9th Chord', shape: ['1', '3', '5', '6', '9'], type: 'major' }],
  ['maj7', { name: 'Major 7th Chord', shape: ['1', '3', '5', '7'], type: 'major' }],
  ['maj9', { name: 'Major 9th Chord', shape: ['1', '3', '5', '7', '9'], type: 'major' }],
  ['maj11', { name: 'Major 11th Chord', shape: ['1', '3', '5', '7', '9', '11'], type: 'major' }],
  [
    'maj13',
    { name: 'Major 13th Chord', shape: ['1', '3', '5', '7', '9', '11', '13'], type: 'major' }
  ],

  ['m', { name: 'Minor Chord', shape: ['1', '♭3', '5'], type: 'minor' }],
  ['m6', { name: 'Minor 6th Chord', shape: ['1', '♭3', '5', '6'], type: 'minor' }],
  ['m7', { name: 'Minor 7th Chord', shape: ['1', '♭3', '5', '♭7'], type: 'minor' }],
  ['m7b5', { name: 'Minor 7th Flat Five Chord', shape: ['1', '♭3', '♭5', '♭7'], type: 'minor' }],
  ['m9', { name: 'Minor 9th Chord', shape: ['1', '♭3', '5', '♭7', '9'], type: 'minor' }],
  ['m11', { name: 'Minor 11th Chord', shape: ['1', '♭3', '5', '♭7', '9', '11'], type: 'minor' }],
  [
    'm13',
    { name: 'Minor 13th Chord', shape: ['1', '♭3', '5', '♭7', '9', '11', '13'], type: 'minor' }
  ],

  ['sus2', { name: 'Suspended 2nd Chord', shape: ['1', '2', '5'], type: 'suspended' }],
  ['sus4', { name: 'Suspended 4th Chord', shape: ['1', '♭4', '5'], type: 'suspended' }],
  [
    '7sus4',
    { name: 'Suspended 4th Seventh Chord', shape: ['1', '4', '5', '♭7'], type: 'suspended' }
  ],

  ['7', { name: 'Dominant 7th Chord', shape: ['1', '3', '5', '♭7'], type: 'major' }],
  ['9', { name: 'Dominant 9th Chord', shape: ['1', '3', '5', '♭7', '9'], type: 'major' }],
  ['11', { name: 'Dominant 11th Chord', shape: ['1', '3', '5', '♭7', '9', '11'], type: 'major' }],
  [
    '13',
    { name: 'Dominant 13th Chord', shape: ['1', '3', '5', '♭7', '9', '11', '13'], type: 'major' }
  ],

  ['dim', { name: 'Diminished Chord', shape: ['1', '♭3', '♭5'], type: 'diminished' }],
  ['dim7', { name: 'Diminished 7th Chord', shape: ['1', '♭3', '♭5', '♭7'], type: 'diminished' }],

  ['5', { name: 'Power Chord', shape: ['1', '5'], type: 'indeterminate' }],
  ['aug', { name: 'Augmented Chord', shape: ['1', '3', '♯5'], type: 'augmented' }],
  ['aug7', { name: 'Augmented 7th Chord', shape: ['1', '3', '♯5', '♭7'], type: 'augmented' }]
])

export const chords = {
  maj: { name: 'Major Chord', shape: ['1', '3', '5'], type: 'major' },
  add6: { name: 'Major 6th Chord', shape: ['1', '3', '5', '6'], type: 'major' },
  '6/9': { name: 'Major 6th/9th Chord', shape: ['1', '3', '5', '6', '9'], type: 'major' },
  maj7: { name: 'Major 7th Chord', shape: ['1', '3', '5', '7'], type: 'major' },
  maj9: { name: 'Major 9th Chord', shape: ['1', '3', '5', '7', '9'], type: 'major' },
  maj11: { name: 'Major 11th Chord', shape: ['1', '3', '5', '7', '9', '11'], type: 'major' },
  maj13: { name: 'Major 13th Chord', shape: ['1', '3', '5', '7', '9', '11', '13'], type: 'major' },

  m: { name: 'Minor Chord', shape: ['1', '♭3', '5'], type: 'minor' },
  m6: { name: 'Minor 6th Chord', shape: ['1', '♭3', '5', '6'], type: 'minor' },
  m7: { name: 'Minor 7th Chord', shape: ['1', '♭3', '5', '♭7'], type: 'minor' },
  m7b5: { name: 'Minor 7th Flat Five Chord', shape: ['1', '♭3', '♭5', '♭7'], type: 'minor' },
  m9: { name: 'Minor 9th Chord', shape: ['1', '♭3', '5', '♭7', '9'], type: 'minor' },
  m11: { name: 'Minor 11th Chord', shape: ['1', '♭3', '5', '♭7', '9', '11'], type: 'minor' },
  m13: { name: 'Minor 13th Chord', shape: ['1', '♭3', '5', '♭7', '9', '11', '13'], type: 'minor' },

  sus2: { name: 'Suspended 2nd Chord', shape: ['1', '2', '5'], type: 'suspended' },
  sus4: { name: 'Suspended 4th Chord', shape: ['1', '♭4', '5'], type: 'suspended' },
  '7sus4': { name: 'Suspended 4th Seventh Chord', shape: ['1', '4', '5', '♭7'], type: 'suspended' },

  dominant: { name: 'Dominant', shape: ['1', '3', '5'], type: 'major' },
  7: { name: 'Dominant 7th Chord', shape: ['1', '3', '5', '♭7'], type: 'major' },
  9: { name: 'Dominant 9th Chord', shape: ['1', '3', '5', '♭7', '9'], type: 'major' },
  11: { name: 'Dominant 11th Chord', shape: ['1', '3', '5', '♭7', '9', '11'], type: 'major' },
  13: { name: 'Dominant 13th Chord', shape: ['1', '3', '5', '♭7', '9', '11', '13'], type: 'major' },

  dim: { name: 'Diminished Chord', shape: ['1', '♭3', '♭5'], type: 'diminished' },
  dim7: { name: 'Diminished 7th Chord', shape: ['1', '♭3', '♭5', '♭7'], type: 'diminished' },

  5: { name: 'Power Chord', shape: ['1', '5'], type: 'indeterminate' },
  aug: { name: 'Augmented Chord', shape: ['1', '3', '♯5'], type: 'augmented' },
  aug7: { name: 'Augmented 7th Chord', shape: ['1', '3', '♯5', '♭7'], type: 'augmented' }
} as const satisfies Record<string, Chord>
