import { chords, createChord, intervalToSemitones, noteIntoString } from '@/chords-and-scales'

import type { Chord, MidiChord, Scale, ScaleNote } from '@/chords-and-scales'
import type { Note } from '@/types'
import { getNote } from './getNote'

export class GuessChords {
  scale: Scale
  chords: MidiChord[]
  times: number[] = []
  correct = 0
  latestGuess: { target: string; guessed: string } = { target: '', guessed: '' }
  idx = 0
  timing: number

  constructor(scale: Scale, chords: [string, Chord][], range: [Note, Note], count = 10) {
    this.scale = scale
    const randomChords: [string, Chord][] = []
    const available: [string, Chord][] = chords.map(v => [v[0], { ...v[1] }])
    for (let i = 0; i < count; i += 1) {
      const idx = Math.floor(Math.random() * available.length)
      const val = available.splice(idx, 1)
      if (val.length > 0) {
        randomChords.push(val[0])
      }
    }
    this.chords = randomChords.map(c => {
      const maxInterval = c[1].intervals[c[1].intervals.length - 1]
      const maxSemitones = intervalToSemitones(maxInterval)
      const availableRange: [number, number] = [range[0].value, range[1].value - maxSemitones]
      const notes = Array.from(new Array(availableRange[1] - availableRange[0])).map(
        (_, i) => [range[0].value + i, (range[0].order + i) % 12] as [number, number]
      )
      const availableNotes = notes.filter(v => scale.scaleNotes.find(note => note.order === v[1]))
      const startingNoteInScale = availableNotes[Math.floor(Math.random() * availableNotes.length)]
      const scaleNote = scale.notesMap.get(startingNoteInScale[1]) as ScaleNote
      return {
        ...c[1],
        short: c[0],
        note: scaleNote.note,
        notes: createChord({ ...scaleNote, midi: startingNoteInScale[0] }, scale, c[1])
      }
    })
    console.log('CHORDS', this.chords)
    this.timing = performance.now()
  }
  get current() {
    return this.chords[this.idx]
  }
  get currentNotes(): Note[] {
    return this.current.notes.map(n => getNote(n.midi))
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
    const target = `${this.current.note}${this.current.short}`
    const guessed = `${noteIntoString(value)}${value.chord.toLowerCase()}`
    const result = target === guessed
    if (result) {
      this.correct += 1
    }
    this.latestGuess = { target, guessed }
    this.idx += 1
    this.times.push(performance.now() - this.timing)
    return result
  }
  startTime() {
    this.timing = performance.now()
  }
}
