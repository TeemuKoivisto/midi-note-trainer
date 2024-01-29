import type { Chord } from './chords'
import type { Scale, ScaleNote } from './createScale'

function parseInteger(str: string) {
  try {
    return parseInt(str)
  } catch (err: any) {
    return 0
  }
}

function parseNote(note: string) {
  let interval = ''
  let flats = 0
  let sharps = 0
  for (let j = 0; j < note.length; j += 1) {
    if (note[j] === 'b' || note[j] === '♭') {
      flats += 1
    } else if (note[j] === '#' || note[j] === '♯' || note[j] === 's') {
      sharps += 1
    } else if (regexPosInt.test(note[j])) {
      interval += note[j]
    }
  }
  return { interval: parseInteger(interval), flats, sharps }
}

const regexPosInt = /^[0-9]$/

export function createChord(rootNote: number, scale: Scale, chord: Chord) {
  const chordNotes: ScaleNote[] = []
  // const scaleIntervals = chord.notes.reduce(
  //   (acc, n) => {
  //     acc[n.interval] = n
  //     return acc
  //   },
  //   {} as Record<number, ScaleNote>
  // )
  for (let i = 0; i < chord.notes.length; i += 1) {
    const note = chord.notes[i].trim()
    let intervalStr = ''
    let flats = 0
    let sharps = 0
    for (let j = 0; j < note.length; j += 1) {
      if (note[j] === 'b' || note[j] === '♭') {
        flats += 1
      } else if (note[j] === '#' || note[j] === '♯' || note[j] === 's') {
        sharps += 1
      } else if (regexPosInt.test(note[j])) {
        intervalStr += note[j]
      }
    }
    const interval = parseInteger(intervalStr)
    if (interval === 0) continue
    const intervalIdx = scale.intervals.findIndex(x => x.seq === interval)
    if (intervalIdx >= 0) {
      const interval = scale.intervals[intervalIdx]
      const note = { ...scale.scaleNotes[intervalIdx] }
      if (interval.flats === flats && interval.sharps === sharps) {
        chordNotes.push(note)
      } else {
        // debugger
        note.flats -= sharps
        note.sharps -= flats
        note.flats = interval.sharps < 0 ? interval.sharps * -1 : 0
        note.sharps = interval.flats < 0 ? interval.flats * -1 : 0
        console.log('note ', interval)
        note.note = `${'♭'.repeat(interval.flats)}${'♯'.repeat(interval.sharps)}${note.note}`
        chordNotes.push(note)
      }
    } else {
      console.log('TODO')
    }
  }
  return chordNotes
}
