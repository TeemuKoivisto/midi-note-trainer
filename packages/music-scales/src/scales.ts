// https://github.com/Zachacious/MusicTheoryJS/blob/65572a7bf58e0485f250bd92748fdd1e975f4a90/src/scale/scaleTemplates.ts
// All scales should equal to 12 semitones
export const scales = {
  wholeTone: [2, 2, 2, 2, 2, 2],

  // major
  major: [2, 2, 1, 2, 2, 2, 1],
  major7s4s5: [2, 2, 2, 2, 1, 2, 1],

  // modes
  ionian: [2, 2, 1, 2, 2, 2, 1], // == major
  aeolian: [2, 1, 2, 2, 1, 2, 2], // == minor
  dorian: [2, 1, 2, 2, 2, 1, 2],
  phrygian: [1, 2, 2, 2, 1, 2, 2],
  lydian: [2, 2, 2, 1, 2, 2, 1],
  lydianDominant: [2, 2, 2, 1, 2, 1, 2], // EQUAL
  acoustic: [2, 2, 2, 1, 2, 1, 2], // EQUAL
  mixolydian: [2, 2, 1, 2, 2, 1, 2],
  mixolydianFlat6: [2, 2, 1, 2, 1, 2, 2],
  locrian: [1, 2, 2, 1, 2, 2, 2],
  superLocrian: [1, 2, 1, 2, 2, 2, 2],

  // minor
  minor: [2, 1, 2, 2, 1, 2, 2],
  minor7b9: [1, 2, 2, 2, 2, 1, 2],
  minor7b5: [2, 1, 2, 1, 2, 2, 2], // EQUAL
  halfDiminished: [2, 1, 2, 1, 2, 2, 2], // EQUAL

  // harmonic
  harmonicMajor: [2, 2, 1, 2, 1, 3, 1],
  harmonicMinor: [2, 1, 2, 2, 1, 3, 1],
  doubleHarmonic: [1, 3, 1, 2, 1, 3, 1], // EQUAL
  byzantine: [1, 3, 1, 2, 1, 3, 1], // EQUAL

  // melodic
  melodicMinorAscending: [2, 1, 2, 2, 2, 2, 1],
  melodicMinorDescending: [2, 2, 1, 2, 2, 1, 2],

  // pentatonic
  majorPentatonic: [2, 2, 3, 2, 3],
  majorPentatonicBlues: [2, 1, 1, 3, 2, 3],
  minorPentatonic: [3, 2, 2, 3, 2],
  minorPentatonicBlues: [3, 2, 1, 1, 3, 2],
  b5Pentatonic: [3, 2, 1, 4, 2],
  minor6Pentatonic: [3, 2, 2, 2, 3],

  // enigmatic
  enigmaticMajor: [1, 3, 2, 2, 2, 1, 1],
  enigmaticMinor: [1, 2, 3, 1, 3, 1, 1],

  // 8Tone
  dim8Tone: [2, 1, 2, 1, 2, 1, 2, 1],
  dom8Tone: [1, 2, 1, 2, 1, 2, 1, 2],

  // neapolitan
  neapolitanMajor: [1, 2, 2, 2, 2, 2, 1],
  neapolitanMinor: [1, 2, 2, 2, 1, 3, 1],

  // hungarian
  hungarianMajor: [3, 1, 2, 1, 2, 1, 2],
  hungarianMinor: [2, 1, 3, 1, 1, 3, 1],
  hungarianGypsy: [1, 3, 1, 2, 1, 3, 1],

  // spanish
  spanish: [1, 2, 1, 2, 2, 2, 2],
  spanish8Tone: [1, 2, 1, 1, 1, 2, 2, 3], // EQUAL
  jewish: [1, 2, 1, 1, 1, 2, 2, 2], // EQUAL
  spanishGypsy: [1, 3, 1, 2, 1, 2, 2],

  // aug dom
  augmented: [3, 1, 3, 1, 3, 1],
  dominantSuspended: [2, 3, 2, 2, 1, 2],

  // bebop
  bebopMajor: [2, 2, 1, 2, 1, 1, 2, 1],
  bebopDominant: [2, 2, 1, 2, 2, 1, 1, 1],

  mystic: [2, 2, 2, 3, 2, 1],

  overtone: [2, 2, 2, 1, 1, 2, 2],

  leadingTone: [2, 2, 2, 2, 2, 1, 1],

  // japanese
  hirojoshi: [2, 1, 4, 1, 4],
  japaneseA: [1, 4, 1, 3, 3],
  japaneseB: [2, 3, 1, 3, 3],

  // cultures
  oriental: [1, 3, 1, 1, 3, 1, 2],
  persian: [1, 4, 1, 2, 3, 1],
  arabian: [2, 2, 1, 1, 2, 2, 2],
  balinese: [1, 2, 4, 1, 4],
  kumoi: [2, 1, 4, 2, 2, 1],
  pelog: [1, 2, 3, 1, 1, 4],
  algerian: [2, 1, 2, 1, 1, 1, 3, 1],
  chinese: [4, 2, 1, 4, 1],
  mongolian: [2, 2, 3, 2, 3],
  egyptian: [2, 3, 2, 3, 2],
  romainian: [2, 1, 3, 1, 2, 1, 2],
  hindu: [2, 2, 1, 2, 1, 2, 2],
  insen: [1, 4, 2, 3, 2],
  iwato: [1, 4, 1, 4, 2],
  scottish: [2, 3, 2, 2, 3],
  yo: [3, 2, 2, 3, 2],
  istrian: [1, 2, 2, 2, 1, 2, 2],
  ukranianDorian: [2, 1, 3, 1, 2, 1, 2],
  petrushka: [1, 3, 2, 1, 3, 2],
  ahavaraba: [1, 3, 1, 2, 1, 2, 2]
} as const
