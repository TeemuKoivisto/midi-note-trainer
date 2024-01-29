import { intervalToSemitones } from './utils'

import type { Chord, MidiNote, Scale } from './types'

export function createChord(startingNote: MidiNote, scale: Scale, chord: Chord) {
  const chordNotes: MidiNote[] = []
  for (let i = 0; i < chord.intervals.length; i += 1) {
    const interval = chord.intervals[i]
    const intervalIdx = scale.intervals.findIndex(x =>
      interval.seq < 8 ? x.seq === interval.seq : x.seq === interval.seq % 7
    )
    if (intervalIdx >= 0) {
      const scaleInterval = scale.intervals[intervalIdx]
      const note = { ...scale.scaleNotes[intervalIdx] }
      if (scaleInterval.flats === interval.flats && scaleInterval.sharps === interval.sharps) {
        chordNotes.push({ ...note, midi: startingNote.midi + intervalToSemitones(interval) })
      } else {
        // debugger
        const flats = note.flats - interval.sharps
        const sharps = note.sharps - interval.flats
        note.flats = sharps < 0 ? sharps * -1 : 0
        note.sharps = flats < 0 ? flats * -1 : 0
        // console.log('note ', scaleInterval)
        note.note = `${note.note}${'♭'.repeat(note.flats)}${'♯'.repeat(note.sharps)}`
        chordNotes.push({
          ...note,
          midi:
            startingNote.midi +
            intervalToSemitones({
              str: '',
              seq: interval.seq,
              flats: note.flats,
              sharps: note.sharps
            })
        })
      }
    } else {
      console.log('TODO: interval not found in scale')
    }
  }
  return chordNotes
}