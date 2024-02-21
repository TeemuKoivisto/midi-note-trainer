import { createChord, noteIntoString } from '@/chords-and-scales'

import type { Chord, MidiChord, Scale, ScaleNote } from '@/chords-and-scales'
import type { Note } from '@/types'

export class GuessChords {
  type: 'chords-write' | 'chords-play'
  scale: Scale
  chords: MidiChord[]
  times: number[] = []
  correct = 0
  latestGuess: { target: string; guessed: string } = { target: '', guessed: '' }
  idx = 0
  timing: number

  constructor(
    type: 'chords-write' | 'chords-play',
    scale: Scale,
    chords: Chord[],
    range: [Note, Note],
    count = 10
  ) {
    this.type = type
    this.scale = scale
    const randomChords: Chord[] = []
    const available: Chord[] = chords.map(v => ({ ...v }))
    for (let i = 0; i < count; i += 1) {
      const idx = Math.floor(Math.random() * available.length)
      const val = available.splice(idx, 1)
      if (val.length > 0) {
        randomChords.push(val[0])
      }
    }
    this.chords = randomChords.map(chord => {
      const maxInterval = chord.intervals[chord.intervals.length - 1]
      const availableRange: [number, number] = [
        range[0].midi,
        range[1].midi - maxInterval.semitones
      ]
      const notes = Array.from(new Array(availableRange[1] - availableRange[0])).map(
        (_, i) => [range[0].midi + i, (range[0].semitones + i) % 12] as [number, number]
      )
      // @TODO for diatonic chords only use roots that are of same note
      const availableNotes = notes.filter(v =>
        scale.scaleNotes.find(note => note.semitones === v[1])
      )
      const startingNoteInScale = availableNotes[Math.floor(Math.random() * availableNotes.length)]
      const scaleNote = scale.notesMap.get(startingNoteInScale[1]) as ScaleNote
      return {
        ...chord,
        rootNote: scaleNote.note,
        chord: `${scaleNote.note}${chord.suffixes[0]}`,
        notes: createChord(startingNoteInScale[0], scale, chord.intervals)
      }
    })
    this.timing = performance.now()
  }
  get current() {
    return this.chords[this.idx]
  }
  get ended() {
    return this.chords.length === this.idx + 1
  }
  get avgTime() {
    let avgMs = 0
    for (let i = 0; i < this.times.length; i += 1) {
      avgMs += this.times[i]
    }
    return Math.round(avgMs / 10 / this.times.length) / 100
  }
  guess(value: { note: string; flats: number; sharps: number; chord: string }) {
    const guessed = `${noteIntoString(value)}${value.chord.toLowerCase()}`
    const result = this.current.chord === guessed
    if (result) {
      this.correct += 1
    }
    this.latestGuess = { target: this.current.chord, guessed }
    this.idx += 1
    this.times.push(performance.now() - this.timing)
    return result
  }
  startTime() {
    this.timing = performance.now()
  }
}
