import { createIntervals } from './utils'

import type { Chord, Scale, ScaleNote } from './types'

export function createChord(noteIndex: number, scale: Scale, chord: Chord) {
  const rootNote = scale.notesMap.get(noteIndex)
  const chordNotes: ScaleNote[] = []
  const chordIntervals = createIntervals(chord.notes)
  for (let i = 0; i < chordIntervals.length; i += 1) {
    const interval = chordIntervals[i]
    const intervalIdx = scale.intervals.findIndex(x =>
      interval.seq < 8 ? x.seq === interval.seq : x.seq === interval.seq % 7
    )
    if (intervalIdx >= 0) {
      const scaleInterval = scale.intervals[intervalIdx]
      const note = { ...scale.scaleNotes[intervalIdx] }
      if (scaleInterval.flats === interval.flats && scaleInterval.sharps === interval.sharps) {
        chordNotes.push(note)
      } else {
        // debugger
        const flats = note.flats - interval.sharps
        const sharps = note.sharps - interval.flats
        note.flats = sharps < 0 ? sharps * -1 : 0
        note.sharps = flats < 0 ? flats * -1 : 0
        // console.log('note ', scaleInterval)
        note.note = `${note.note}${'♭'.repeat(note.flats)}${'♯'.repeat(note.sharps)}`
        chordNotes.push(note)
      }
    } else {
      console.log('TODO')
    }
  }
  return chordNotes
}
