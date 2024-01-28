// https://github.com/Zachacious/MusicTheoryJS/blob/65572a7bf58e0485f250bd92748fdd1e975f4a90/src/scale/scaleTemplates.ts
// All scales should equal to 12 semitones
// https://en.wikipedia.org/wiki/List_of_musical_scales_and_modes
// https://plucknplay.github.io/en/scale-list.html
// https://www.jazz-guitar-licks.com/pages/guitar-scales-modes/
export const scales = {
  wholeTone: {
    name: 'Whole Tone',
    tones: [2, 2, 2, 2, 2, 2],
    form: ['1', '2', '3', '4♯', '5♯', '♭7']
  },
  // major
  major: { name: 'Major', tones: [2, 2, 1, 2, 2, 2, 1], form: ['1', '2', '3', '4', '5', '6', '7'] },
  // modes
  ionian: {
    name: 'Ionian',
    tones: [2, 2, 1, 2, 2, 2, 1],
    form: ['1', '2', '3', '4', '5', '6', '7']
  }, // == major
  aeolian: {
    name: 'Aeolian',
    tones: [2, 1, 2, 2, 1, 2, 2],
    form: ['1', '2', '♭3', '4', '5', '♭6', '♭7']
  }, // == minor
  dorian: {
    name: 'Dorian',
    tones: [2, 1, 2, 2, 2, 1, 2],
    form: ['1', '2', '♭3', '4', '5', '6', '♭7']
  },
  phrygian: {
    name: 'Phrygian',
    tones: [1, 2, 2, 2, 1, 2, 2],
    form: ['1', '♭2', '♭3', '4', '5', '♭6', '♭7']
  },
  // https://en.wikipedia.org/wiki/Phrygian_dominant_scale
  phrygianDominant: {
    name: 'Phrygian dominant',
    tones: [1, 3, 1, 2, 1, 2, 2],
    form: ['1', '♭2', '3', '4', '5', '♭6', '♭7']
  },
  lydian: {
    name: 'Lydian',
    tones: [2, 2, 2, 1, 2, 2, 1],
    form: ['1', '2', '3', '♯4', '5', '6', '7']
  },
  lydianDominant: {
    name: 'Lydian Dominant',
    tones: [2, 2, 2, 1, 2, 1, 2],
    form: ['1', '2', '3', '♯4', '5', '6', '♭7']
  },
  /* <- EQUAL -> */
  acoustic: {
    name: 'Acoustic',
    tones: [2, 2, 2, 1, 2, 1, 2],
    form: ['1', '2', '3', '♯4', '5', '6', '♭7']
  },
  mixolydian: {
    name: 'Mixolydian',
    tones: [2, 2, 1, 2, 2, 1, 2],
    form: ['1', '2', '3', '4', '5', '6', '♭7']
  },
  mixolydianFlat6: {
    name: 'Mixolydian Flat-6',
    tones: [2, 2, 1, 2, 1, 2, 2],
    form: ['1', '2', '3', '4', '5', '♭6', '♭7']
  },
  locrian: {
    name: 'Locrian',
    tones: [1, 2, 2, 1, 2, 2, 2],
    form: ['1', '♭2', '♭3', '4', '♭5', '♭6', '♭7']
  },
  // https://en.wikipedia.org/wiki/Altered_scale
  superLocrian: {
    name: 'Super Locrian',
    tones: [1, 2, 1, 2, 2, 2, 2],
    form: ['1', '♭2', '♭3', '♭4', '♭5', '♭6', '♭7']
  },
  // minor
  minor: {
    name: 'Minor',
    tones: [2, 1, 2, 2, 1, 2, 2],
    form: ['1', '2', '♭3', '4', '5', '♭6', '♭7']
  },
  minor7b9: {
    name: 'Minor7b9',
    tones: [1, 2, 2, 2, 2, 1, 2],
    form: ['1', '♭2', '♭3', '4', '5', '6', '♭7']
  },
  minor7b5: {
    name: 'Minor7b5',
    tones: [2, 1, 2, 1, 2, 2, 2],
    form: ['1', '♭2', '♭3', '3', '♭5', '6', '♭7']
  },
  /* <- EQUAL -> */
  halfDiminished: {
    name: 'Half Diminished',
    tones: [2, 1, 2, 1, 2, 2, 2],
    form: ['1', '♭2', '♭3', '3', '♭5', '6', '♭7']
  },
  // harmonic https://en.wikipedia.org/wiki/Harmonic_major_scale
  harmonicMajor: {
    name: 'Harmonic Major',
    tones: [2, 2, 1, 2, 1, 3, 1],
    form: ['1', '2', '3', '4', '5', '♭6', '7']
  },
  harmonicMinor: {
    name: 'Harmonic Minor',
    tones: [2, 1, 2, 2, 1, 3, 1],
    form: ['1', '2', '♭3', '4', '5', '♭6', '7']
  },
  doubleHarmonic: {
    name: 'Double Harmonic',
    tones: [1, 3, 1, 2, 1, 3, 1],
    form: ['1', '♭2', '3', '4', '5', '♭6', '7']
  },
  byzantine: {
    name: 'Byzantine',
    tones: [1, 3, 1, 2, 1, 3, 1],
    form: ['1', '♭2', '3', '4', '5', '♭6', '7']
  },
  // melodic
  melodicMinorAscending: {
    name: 'Melodic Minor Ascending',
    tones: [2, 1, 2, 2, 2, 2, 1],
    form: ['1', '2', '♭3', '4', '5', '♭6', '7']
  },
  melodicMinorDescending: {
    name: 'Melodic Minor Descending',
    tones: [2, 2, 1, 2, 2, 1, 2],
    form: ['♭7', '♭6', '5', '4', '♭3', '2', '1']
  },
  // pentatonic
  // https://en.wikipedia.org/wiki/Pentatonic_scale
  // https://www.jazz-guitar-licks.com/pages/guitar-scales-modes/pentatonic-scales/
  majorPentatonic: {
    name: 'Major Pentatonic',
    tones: [2, 2, 3, 2, 3],
    form: ['1', '2', '3', '5', '6']
  },
  majorPentatonicBlues: {
    name: 'Major Pentatonic Blues',
    tones: [2, 1, 1, 3, 2, 3],
    form: ['1', '2', '♭3', '3', '5', '6']
  },
  minorPentatonic: {
    name: 'Minor Pentatonic',
    tones: [3, 2, 2, 3, 2],
    form: ['1', '♭3', '4', '5', '♭7']
  },
  minorPentatonicBlues: {
    name: 'Minor Pentatonic Blues',
    tones: [3, 2, 1, 1, 3, 2],
    form: ['1', '♭3', '4', '♭5', '5', '♭7']
  },
  minor6Pentatonic: {
    name: 'Minor 6th Pentatonic',
    tones: [3, 2, 2, 2, 3],
    form: ['1', '♭3', '4', '5', '6']
  },
  suspendedPentatonic: {
    name: 'Suspended Pentatonic',
    tones: [2, 3, 2, 3, 2],
    form: ['1', '2', '4', '5', '♭7']
  },
  scottishPentatonic: {
    name: 'Scottish Pentatonic',
    tones: [2, 3, 2, 2, 3],
    form: ['1', '2', '4', '5', '6']
  },
  // enigmatic https://en.wikipedia.org/wiki/Enigmatic_scale
  enigmaticMajor: {
    name: 'Enigmatic Major',
    tones: [1, 3, 2, 2, 2, 1, 1],
    form: ['1', '♭2', '3', '♯4', '♯5', '♯6', '7']
  },
  enigmaticMinor: {
    name: 'Enigmatic Minor',
    tones: [1, 2, 3, 1, 3, 1, 1],
    form: ['1', '♭2', '♭3', '♯4', '5', '♯6', '7']
  },
  // https://en.wikipedia.org/wiki/Octatonic_scale
  diminishedWholeHalf: {
    name: 'Diminished Whole-Half',
    tones: [2, 1, 2, 1, 2, 1, 2, 1],
    form: ['1', '2', '♭3', '4', '♭5', '♭6', '6', '7']
  },
  diminishedHalfWhole: {
    name: 'Diminished Half-Whole',
    tones: [1, 2, 1, 2, 1, 2, 1, 2],
    form: ['1', '♭2', '♭3', '♭4', '♭5', '5', '6', '♭7']
  },
  augmented: {
    name: 'Augmented',
    tones: [3, 1, 3, 1, 3, 1],
    form: ['1', '♯2', '3', '5', '♯5', '7']
  },
  dominant7th: {
    name: 'Dominant 7th',
    tones: [2, 3, 2, 2, 1, 2],
    form: ['1', '2', '4', '5', '6', '♭7']
  },
  prometheus: {
    name: 'Prometheus',
    tones: [2, 2, 2, 3, 1, 2],
    form: ['1', '2', '3', '♯4', '6', '♭7']
  },
  overtone: {
    name: 'Overtone',
    tones: [2, 2, 2, 1, 1, 2, 2],
    form: ['1', '2', '3', '♯4', '5', '6', '♭7']
  },
  leadingTone: {
    name: 'Leading Tone',
    tones: [2, 2, 2, 2, 2, 1, 1],
    form: ['1', '2', '3', '♯4', '♭6', '♭7', '7']
  },
  // bebop
  bebopMajor: {
    name: 'Bebop Major',
    tones: [2, 2, 1, 2, 1, 1, 2, 1],
    form: ['1', '2', '3', '4', '5', '♯5', '6', '7']
  },
  bebopMinor: {
    name: 'Bebop Minor',
    tones: [2, 1, 1, 1, 2, 2, 1, 2],
    form: ['1', '2', '♭3', '3', '4', '5', '6', '♭7']
  },
  bebopDominant: {
    name: 'Bebop Dominant',
    tones: [2, 2, 1, 2, 2, 1, 1, 1],
    form: ['1', '2', '3', '4', '5', '6', '♭7', '7']
  },
  // neapolitan
  neapolitanMajor: {
    name: 'Neapolitan Major',
    tones: [1, 2, 2, 2, 2, 2, 1],
    form: ['1', '♭2', '♭3', '4', '5', '6', '7']
  },
  neapolitanMinor: {
    name: 'Neapolitan Minor',
    tones: [1, 2, 2, 2, 1, 3, 1],
    form: ['1', '♭2', '♭3', '4', '5', '♭6', '7']
  },
  // https://en.wikipedia.org/wiki/Hungarian_major_scale
  hungarianMajor: {
    name: 'Hungarian Major',
    tones: [3, 1, 2, 1, 2, 1, 2],
    form: ['1', '♯2', '3', '♯4', '5', '6', '♭7']
  },
  // https://en.wikipedia.org/wiki/Hungarian_minor_scale
  hungarianMinor: {
    name: 'Hungarian Minor',
    tones: [2, 1, 3, 1, 1, 3, 1],
    form: ['1', '2', '♭3', '♯4', '5', '♭6', '7']
  },
  hungarianGypsy: {
    name: 'Hungarian Gypsy',
    tones: [2, 1, 3, 1, 1, 2, 2],
    form: ['1', '2', '♭3', '♯4', '5', '♭6', '♭7']
  },
  // spanish
  spanish: {
    name: 'Spanish',
    tones: [1, 2, 1, 2, 2, 2, 2],
    form: ['1', '♭2', '♭3', '3', '♭5', '♭6', '♭7']
  },
  spanishEightTone: {
    name: 'Spanish Eight Tone',
    tones: [1, 2, 1, 1, 1, 2, 2, 2],
    form: ['1', '♭2', '♭3', '3', '4', '♭5', '♭6', '♭7']
  },
  /* <- EQUAL -> */
  jewishEightTone: {
    name: 'Jewish Eight Tone',
    tones: [1, 2, 1, 1, 1, 2, 2, 2],
    form: ['1', '♭2', '♭3', '3', '4', '♭5', '♭6', '♭7']
  },
  spanishGypsy: {
    name: 'Spanish Gypsy',
    tones: [1, 3, 1, 2, 1, 2, 2],
    form: ['1', '♭2', '3', '4', '5', '♭6', '♭7']
  },
  // japanese
  hirojoshi: { name: 'Hirojoshi', tones: [2, 1, 4, 1, 4], form: ['1', '2', '♭3', '5', '♭6'] },
  japaneseA: { name: 'Japanese A', tones: [1, 4, 1, 3, 3], form: ['1', '♭2', '4', '♭5', '6'] },
  japaneseB: { name: 'Japanese B', tones: [2, 3, 1, 3, 3], form: ['1', '2', '4', '♭5', '6'] },
  yo: { name: 'Yo', tones: [2, 3, 2, 2, 3], form: ['1', '2', '4', '5', '6', '♭7'] },
  insen: { name: 'Insen', tones: [1, 4, 2, 3, 2], form: ['1', '♭2', '4', '5', '♭7'] },
  iwato: { name: 'Iwato', tones: [1, 4, 1, 4, 2], form: ['1', '♭2', '4', '♭5', '♭7'] },
  // other
  oriental: {
    name: 'Oriental',
    tones: [1, 3, 1, 1, 3, 1, 2],
    form: ['1', '♭2', '3', '4', '♭5', '6', '♭7']
  },
  persian: {
    name: 'Persian',
    tones: [1, 3, 1, 1, 2, 3, 1],
    form: ['1', '♭2', '3', '4', '♭5', '♭6', '7']
  },
  arabian: {
    name: 'Arabian',
    tones: [2, 2, 1, 1, 2, 2, 2],
    form: ['1', '2', '3', '4', '♯4', '♯5', '♭7']
  },
  balinese: { name: 'Balinese', tones: [1, 2, 4, 1, 4], form: ['1', '♭2', '♭3', '5', '♭6'] },
  kumoi: { name: 'Kumoi', tones: [2, 1, 4, 2, 2, 1], form: ['1', '2', '♭3', '5', '6'] },
  pelog: { name: 'Pelog', tones: [1, 2, 3, 1, 1, 4], form: ['1', '♭2', '♭3', '5', '♭6'] },
  algerian: {
    name: 'Algerian',
    tones: [2, 1, 2, 1, 1, 1, 3, 1],
    form: ['1', '2', '♭3', '4', '♯4', '5', '♭6', '7']
  },
  chinese: { name: 'Chinese', tones: [4, 2, 1, 4, 1], form: ['1', '♯4', '5', '7'] },
  mongolian: { name: 'Mongolian', tones: [2, 2, 3, 2, 3], form: ['1', '2', '3', '5', '6'] },
  // https://en.wikipedia.org/wiki/Romanian_major_scale
  romanianMajor: {
    name: 'Romanian Major',
    tones: [1, 3, 2, 1, 2, 1, 2],
    form: ['1', '♭2', '3', '♯4', '5', '6', '♭7']
  },
  romanianMinor: {
    name: 'Romanian Minor',
    tones: [2, 1, 3, 1, 2, 1, 2],
    form: ['1', '2', '♭3', '♯4', '5', '6', '♭7']
  },
  hindu: {
    name: 'Hindu',
    tones: [2, 2, 1, 2, 1, 2, 2],
    form: ['1', '2', '3', '4', '5', '♭6', '♭7']
  },
  // https://en.wikipedia.org/wiki/Istrian_scale
  istrian: { name: 'Istrian', tones: [1, 2, 1, 2, 1, 5], form: ['1', '♭2', '♭3', '♭4', '♭5', '5'] },
  // https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
  ukrainianDorian: {
    name: 'Ukrainian Dorian',
    tones: [2, 1, 3, 1, 2, 1, 2],
    form: ['1', '2', '♭3', '♯4', '5', '6', '♭7']
  }
} as const
