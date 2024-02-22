import { createChord, getNote, noteIntoString } from '@/chords-and-scales'

import type { Chord, MidiChord, MidiNote, Scale, ScaleNote } from '@/chords-and-scales'

import { Game } from './Game'

import type { BaseOptions } from './types'

type AllowedChord = MidiChord & { allowed?: Set<number> }
interface Guess {
  chord: string
  notes: MidiNote[]
}

interface GuessChordsOptions {
  chords: (Chord & { allowed?: Set<number> })[]
  onlyScale?: boolean
  onlySameDegree?: boolean
}

export class GuessChords extends Game<AllowedChord, Guess> {
  played = new Set<number>()

  constructor(
    type: 'chords-write' | 'chords-play' | 'chords-diatonic',
    baseOpts: BaseOptions,
    opts: GuessChordsOptions
  ) {
    const min = baseOpts.range[0].midi
    const max = baseOpts.range[1].midi
    const scaleSemitones = new Set(baseOpts.scale.scaleNotes.map(s => s.semitones))

    const values = opts.chords.flatMap(chord => {
      const vv: AllowedChord[] = []
      const maxInterval = chord.intervals.reduce(
        (acc, cur) => (cur.semitones > acc ? cur.semitones : acc),
        0
      )
      // @TODO chord inversions
      for (let midi = min; midi <= max - maxInterval; midi += 1) {
        if (!opts.onlyScale || (opts.onlyScale && scaleSemitones.has(midi % 12))) {
          const notes = createChord(midi, baseOpts.scale, chord.intervals)
          vv.push({
            ...chord,
            rootNote: notes[0].note,
            chord: `${notes[0].note}${chord.suffixes[0]}`,
            notes
          })
        }
      }
      return vv
    })
    console.log('values', values)
    super(type, values, baseOpts)
  }
  // create() {
  //   const scaleSemitones = new Set(scale.scaleNotes.map(s => s.semitones))
  //   this.chords = randomChords.map(chord => {
  //     const maxInterval = chord.intervals.reduce(
  //       (acc, cur) => (cur.semitones > acc ? cur.semitones : acc),
  //       0
  //     )
  //     const availableRange: [number, number] = [range[0].midi, range[1].midi - maxInterval]
  //     const notes = Array.from(new Array(availableRange[1] - availableRange[0])).map(
  //       (_, i) => [range[0].midi + i, (range[0].semitones + i) % 12] as [number, number]
  //     )
  //     const availableNotes = notes.filter(
  //       v => scaleSemitones.has(v[1]) && (!chord.allowed || chord.allowed.has(v[1]))
  //     )
  //     const startingNoteInScale = availableNotes[Math.floor(Math.random() * availableNotes.length)]
  //     // const scaleNote = scale.notesMap.get(startingNoteInScale[1]) as ScaleNote
  //     const chordNotes = createChord(startingNoteInScale[0], scale, chord.intervals)
  //     return {
  //       ...chord,
  //       rootNote: chordNotes[0].note,
  //       chord: `${chordNotes[0].note}${chord.suffixes[0]}`,
  //       notes: chordNotes
  //     }
  //   })
  // }
  addPlayedNote(midi: number) {
    this.played.add(midi)
  }
  guessWrittenChord(value: { note: string; flats: number; sharps: number; chord: string }) {
    const guessed = {
      chord: `${noteIntoString(value)}${value.chord.toLowerCase()}`,
      notes: []
    }
    const result = this.current.chord === guessed.chord
    return this.addGuessed(guessed, result)
  }
  guess() {
    const notes = Array.from(this.played.values())
      .map(v => getNote(v))
      .sort((a, b) => a.midi - b.midi)
    this.played.clear()
    const guessed = {
      chord: '',
      // notesString: notes.map(n => `${n.note.charAt(0)}${'♭'.repeat(n.flats)}${'♯'.repeat(n.sharps)}`).join(' '),
      notes
    }
    const result = this.current.notes.every(n => notes.find(note => note.midi % 12 === n.midi % 12))
    return this.addGuessed(guessed, result)
  }
}

interface LatestGuess {
  target: [string, string]
  guessed: [string, string]
  notes: MidiNote[]
}
interface Options {
  scale: Scale
  chords: (Chord & { allowed?: Set<number> })[]
  range: [MidiNote, MidiNote]
  noDuplicates?: boolean
  count?: number
}

export class GuessChords2 {
  type: 'chords-write' | 'chords-play' | 'chords-diatonic'
  options: Required<Options>
  chords: MidiChord[]
  times: number[] = []
  correct = 0
  played = new Set<number>()
  latestGuess: LatestGuess = { target: ['', ''], guessed: ['', ''], notes: [] }
  idx = 0
  timing: number

  constructor(type: 'chords-write' | 'chords-play' | 'chords-diatonic', options: Options) {
    this.type = type
    this.options = {
      count: 10,
      noDuplicates: false,
      ...options
    }
    const { scale, chords, count, range } = this.options
    const randomChords: (Chord & { allowed?: Set<number> })[] = []
    const available = chords.map(v => ({ ...v }))
    for (let i = 0; i < count; i += 1) {
      const idx = Math.floor(Math.random() * available.length)
      if (options.noDuplicates) {
        const val = available.splice(idx, 1)
        if (val.length > 0) {
          randomChords.push(val[0])
        }
      } else {
        randomChords.push(available[idx])
      }
    }
    const scaleSemitones = new Set(scale.scaleNotes.map(s => s.semitones))
    this.chords = randomChords.map(chord => {
      const maxInterval = chord.intervals.reduce(
        (acc, cur) => (cur.semitones > acc ? cur.semitones : acc),
        0
      )
      const availableRange: [number, number] = [range[0].midi, range[1].midi - maxInterval]
      const notes = Array.from(new Array(availableRange[1] - availableRange[0])).map(
        (_, i) => [range[0].midi + i, (range[0].semitones + i) % 12] as [number, number]
      )
      const availableNotes = notes.filter(
        v => scaleSemitones.has(v[1]) && (!chord.allowed || chord.allowed.has(v[1]))
      )
      const startingNoteInScale = availableNotes[Math.floor(Math.random() * availableNotes.length)]
      // const scaleNote = scale.notesMap.get(startingNoteInScale[1]) as ScaleNote
      const chordNotes = createChord(startingNoteInScale[0], scale, chord.intervals)
      return {
        ...chord,
        rootNote: chordNotes[0].note,
        chord: `${chordNotes[0].note}${chord.suffixes[0]}`,
        notes: chordNotes
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
  addPlayedNote(midi: number) {
    this.played.add(midi)
  }
  guess(value?: { note: string; flats: number; sharps: number; chord: string }) {
    let result
    let notes: MidiNote[]
    let target: [string, string]
    let guessed: [string, string]
    if (value) {
      // const guessed = `${noteIntoString(value)}${value.chord.toLowerCase()}`
      notes = []
      target = [this.current.chord, '']
      guessed = [`${noteIntoString(value)}${value.chord.toLowerCase()}`, '']
      result = target.join('') === guessed.join('')
    } else {
      notes = Array.from(this.played.values())
        .map(v => getNote(v))
        .sort((a, b) => a.midi - b.midi)
      this.played.clear()
      target = [this.current.chord, this.current.notes.map(n => noteIntoString(n)).join(' ')]
      guessed = [
        '',
        notes.map(n => `${n.note.charAt(0)}${'♭'.repeat(n.flats)}${'♯'.repeat(n.sharps)}`).join(' ')
      ]
      result = this.current.notes.every(n => notes.find(note => note.midi % 12 === n.midi % 12))
    }
    if (result) {
      this.correct += 1
    }
    this.latestGuess = { target, guessed, notes }
    this.idx += 1
    this.times.push(performance.now() - this.timing)
    return result
  }
  startTime() {
    this.timing = performance.now()
  }
}
