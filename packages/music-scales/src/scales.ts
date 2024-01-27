// https://github.com/Zachacious/MusicTheoryJS/blob/65572a7bf58e0485f250bd92748fdd1e975f4a90/src/scale/scaleTemplates.ts
// All scales should equal to 12 semitones
export const scales = {
  wholeTone: { name: 'Whole Tone', tones: [2, 2, 2, 2, 2, 2] },
  // major
  major: { name: 'Major', tones: [2, 2, 1, 2, 2, 2, 1] },
  major7s4s5: { name: 'Major7s4s5', tones: [2, 2, 2, 2, 1, 2, 1] },
  // modes
  ionian: { name: 'Ionian', tones: [2, 2, 1, 2, 2, 2, 1] }, // == major
  aeolian: { name: 'Aeolian', tones: [2, 1, 2, 2, 1, 2, 2] }, // == minor
  dorian: { name: 'Dorian', tones: [2, 1, 2, 2, 2, 1, 2] },
  phrygian: { name: 'Phrygian', tones: [1, 2, 2, 2, 1, 2, 2] },
  lydian: { name: 'Lydian', tones: [2, 2, 2, 1, 2, 2, 1] },
  lydianDominant: { name: 'Lydian Dominant', tones: [2, 2, 2, 1, 2, 1, 2] }, // EQUAL
  acoustic: { name: 'Acoustic', tones: [2, 2, 2, 1, 2, 1, 2] }, // EQUAL
  mixolydian: { name: 'Mixolydian', tones: [2, 2, 1, 2, 2, 1, 2] },
  mixolydianFlat6: { name: 'Mixolydian Flat-6', tones: [2, 2, 1, 2, 1, 2, 2] },
  locrian: { name: 'Locrian', tones: [1, 2, 2, 1, 2, 2, 2] },
  superLocrian: { name: 'Super Locrian', tones: [1, 2, 1, 2, 2, 2, 2] },
  // minor
  minor: { name: 'Minor', tones: [2, 1, 2, 2, 1, 2, 2] },
  minor7b9: { name: 'Minor7b9', tones: [1, 2, 2, 2, 2, 1, 2] },
  minor7b5: { name: 'Minor7b5', tones: [2, 1, 2, 1, 2, 2, 2] }, // EQUAL
  halfDiminished: { name: 'Half Diminished', tones: [2, 1, 2, 1, 2, 2, 2] }, // EQUAL
  // harmonic
  harmonicMajor: { name: 'Harmonic Major', tones: [2, 2, 1, 2, 1, 3, 1] },
  harmonicMinor: { name: 'Harmonic Minor', tones: [2, 1, 2, 2, 1, 3, 1] },
  doubleHarmonic: { name: 'Double Harmonic', tones: [1, 3, 1, 2, 1, 3, 1] },
  byzantine: { name: 'Byzantine', tones: [1, 3, 1, 2, 1, 3, 1] },
  // melodic
  melodicMinorAscending: { name: 'Melodic Minor Ascending', tones: [2, 1, 2, 2, 2, 2, 1] },
  melodicMinorDescending: { name: 'Melodic Mino rDescending', tones: [2, 2, 1, 2, 2, 1, 2] },
  // pentatonic
  majorPentatonic: { name: 'Major Pentatonic', tones: [2, 2, 3, 2, 3] },
  majorPentatonicBlues: { name: 'Major Pentatonic Blues', tones: [2, 1, 1, 3, 2, 3] },
  minorPentatonic: { name: 'Minor Pentatonic', tones: [3, 2, 2, 3, 2] },
  minorPentatonicBlues: { name: 'Minor Pentatonic Blues', tones: [3, 2, 1, 1, 3, 2] },
  b5Pentatonic: { name: 'B5-Pentatonic', tones: [3, 2, 1, 4, 2] },
  minor6Pentatonic: { name: 'Minor6 Pentatonic', tones: [3, 2, 2, 2, 3] },
  // enigmatic
  enigmaticMajor: { name: 'Enigmatic Major', tones: [1, 3, 2, 2, 2, 1, 1] },
  enigmaticMinor: { name: 'Enigmatic Minor', tones: [1, 2, 3, 1, 3, 1, 1] },
  // 8Tone
  dim8Tone: { name: 'Dim8 Tone', tones: [2, 1, 2, 1, 2, 1, 2, 1] },
  dom8Tone: { name: 'Dom8 Tone', tones: [1, 2, 1, 2, 1, 2, 1, 2] },
  // neapolitan
  neapolitanMajor: { name: 'Neapolitan Major', tones: [1, 2, 2, 2, 2, 2, 1] },
  neapolitanMinor: { name: 'Neapolitan Minor', tones: [1, 2, 2, 2, 1, 3, 1] },
  // hungarian
  hungarianMajor: { name: 'Hungarian Major', tones: [3, 1, 2, 1, 2, 1, 2] },
  hungarianMinor: { name: 'Hungarian Minor', tones: [2, 1, 3, 1, 1, 3, 1] },
  hungarianGypsy: { name: 'Hungarian Gypsy', tones: [1, 3, 1, 2, 1, 3, 1] },
  // spanish
  spanish: { name: 'Spanish', tones: [1, 2, 1, 2, 2, 2, 2] },
  spanish8Tone: { name: 'Spanish 8-Tone', tones: [1, 2, 1, 1, 1, 2, 2, 3] },
  jewish: { name: 'Jewish', tones: [1, 2, 1, 1, 1, 2, 2, 2] },
  spanishGypsy: { name: 'Spanish Gypsy', tones: [1, 3, 1, 2, 1, 2, 2] },
  // aug dom
  augmented: { name: 'Augmented', tones: [3, 1, 3, 1, 3, 1] },
  dominantSuspended: { name: 'Dominant Suspended', tones: [2, 3, 2, 2, 1, 2] },
  // bebop
  bebopMajor: { name: 'Bebop Major', tones: [2, 2, 1, 2, 1, 1, 2, 1] },
  bebopMinor: { name: 'Bebop Minor', tones: [2, 1, 1, 1, 2, 2, 1, 2] },
  bebopDominant: { name: 'Bebop Dominant', tones: [2, 2, 1, 2, 2, 1, 1, 1] },

  mystic: { name: 'Mystic', tones: [2, 2, 2, 3, 2, 1] },
  overtone: { name: 'Overtone', tones: [2, 2, 2, 1, 1, 2, 2] },
  leadingTone: { name: 'Leading Tone', tones: [2, 2, 2, 2, 2, 1, 1] },
  // japanese
  hirojoshi: { name: 'Hirojoshi', tones: [2, 1, 4, 1, 4] },
  japaneseA: { name: 'Japanese A', tones: [1, 4, 1, 3, 3] },
  japaneseB: { name: 'Japanese B', tones: [2, 3, 1, 3, 3] },
  // cultures
  oriental: { name: 'Oriental', tones: [1, 3, 1, 1, 3, 1, 2] },
  persian: { name: 'Persian', tones: [1, 3, 1, 1, 2, 3, 1] },
  arabian: { name: 'Arabian', tones: [2, 2, 1, 1, 2, 2, 2] },
  balinese: { name: 'Balinese', tones: [1, 2, 4, 1, 4] },
  kumoi: { name: 'Kumoi', tones: [2, 1, 4, 2, 2, 1] },
  pelog: { name: 'Pelog', tones: [1, 2, 3, 1, 1, 4] },
  algerian: { name: 'Algerian', tones: [2, 1, 2, 1, 1, 1, 3, 1] },
  chinese: { name: 'Chinese', tones: [4, 2, 1, 4, 1] },
  mongolian: { name: 'Mongolian', tones: [2, 2, 3, 2, 3] },
  egyptian: { name: 'Egyptian', tones: [2, 3, 2, 3, 2] },
  romainian: { name: 'Romainian', tones: [2, 1, 3, 1, 2, 1, 2] },
  hindu: { name: 'Hindu', tones: [2, 2, 1, 2, 1, 2, 2] },
  insen: { name: 'Insen', tones: [1, 4, 2, 3, 2] },
  iwato: { name: 'Iwato', tones: [1, 4, 1, 4, 2] },
  scottish: { name: 'Scottish', tones: [2, 3, 2, 2, 3] },
  yo: { name: 'Yo', tones: [3, 2, 2, 3, 2] },
  istrian: { name: 'Istrian', tones: [1, 2, 2, 2, 1, 2, 2] },
  ukranianDorian: { name: 'Ukranian Dorian', tones: [2, 1, 3, 1, 2, 1, 2] },
  petrushka: { name: 'Petrushka', tones: [1, 3, 2, 1, 3, 2] },
  ahavaraba: { name: 'Ahavaraba', tones: [1, 3, 1, 2, 1, 2, 2] }
} as const
