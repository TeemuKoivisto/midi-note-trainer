import { createChord, intervalToSemitones, noteIntoString } from '@/chords-and-scales'
import { getNote } from './getNote'

import type { Chord, MidiChord, Scale, ScaleNote } from '@/chords-and-scales'
import type { Note } from '@/types'

export class PlayChordsGame {
  scale: Scale
  chords: MidiChord[]
  times: number[] = []
  correct = 0
  played = new Set<number>()
  latestGuess: { target: string; guessed: string } = { target: '', guessed: '' }
  idx = 0
  timing: number

  constructor(scale: Scale, chords: Chord[], range: [Note, Note], count = 10) {
    this.scale = scale
    const randomChords: [string, Chord][] = []
    const available: [string, Chord][] = chords.map(v => [v.suffix, { ...v }])
    for (let i = 0; i < count; i += 1) {
      const idx = Math.floor(Math.random() * available.length)
      const val = [available[idx][0], { ...available[idx][1] }] as [string, Chord]
      randomChords.push(val)
    }
    this.chords = randomChords.map(c => {
      const maxInterval = c[1].intervals[c[1].intervals.length - 1]
      const maxSemitones = intervalToSemitones(maxInterval)
      const availableRange: [number, number] = [range[0].midi, range[1].midi - maxSemitones]
      const notes = Array.from(new Array(availableRange[1] - availableRange[0])).map(
        (_, i) => [range[0].midi + i, (range[0].order + i) % 12] as [number, number]
      )
      const availableNotes = notes.filter(v => scale.scaleNotes.find(note => note.order === v[1]))
      const startingNoteInScale = availableNotes[Math.floor(Math.random() * availableNotes.length)]
      const scaleNote = scale.notesMap.get(startingNoteInScale[1]) as ScaleNote
      return {
        ...c[1],
        short: c[0],
        note: scaleNote.note,
        notes: createChord(startingNoteInScale[0], scale, c[1].intervals)
      }
    })
    console.log('CHORDS', this.chords)
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
  addPlayedNote(midi: number) {
    this.played.add(midi)
  }
  guess() {
    const notes = Array.from(this.played.values())
      .map(v => getNote(v))
      .sort((a, b) => a.midi - b.midi)
    this.played.clear()
    const target = `${this.current.note}${this.current.short}: ${this.current.notes
      .map(n => noteIntoString(n))
      .join(' ')}`
    const guessed = `${notes
      .map(n => `${n.note.charAt(0)}${'♭'.repeat(n.flats)}${'♯'.repeat(n.sharps)}`)
      .join(' ')}`
    console.log(`target ${target} guessed ${guessed}`)
    const result = this.current.notes.every(n => notes.find(note => note.midi % 12 === n.midi % 12))
    console.log('result', result)
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
