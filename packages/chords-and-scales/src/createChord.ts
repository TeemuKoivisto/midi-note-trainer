import { createIntervals } from './utils'

import type { Chord, Scale, ScaleNote } from './types'

export function createChord(rootIndex: number, scale: Scale, chord: Chord) {
  const rootNote = scale.notesMap.get(rootIndex)
  const chordNotes: ScaleNote[] = []
  const intervals = createIntervals(chord.notes)
  for (let i = 0; i < intervals.length; i += 1) {
    const interval = intervals[i]
    const intervalIdx = scale.intervals.findIndex(x => x.seq === interval.seq)
    if (intervalIdx >= 0) {
      const scaleInterval = scale.intervals[intervalIdx]
      const note = { ...scale.scaleNotes[intervalIdx] }
      if (scaleInterval.flats === interval.flats && scaleInterval.sharps === interval.sharps) {
        chordNotes.push(note)
      } else {
        // debugger
        note.flats -= interval.sharps
        note.sharps -= interval.flats
        note.flats = scaleInterval.sharps < 0 ? scaleInterval.sharps * -1 : 0
        note.sharps = scaleInterval.flats < 0 ? scaleInterval.flats * -1 : 0
        console.log('note ', scaleInterval)
        note.note = `${'♭'.repeat(scaleInterval.flats)}${'♯'.repeat(scaleInterval.sharps)}${
          note.note
        }`
        chordNotes.push(note)
      }
    } else {
      console.log('TODO')
    }
  }
  return chordNotes
}
