import { createChord, getNote, noteIntoString } from '@/chords-and-scales'

import type { Chord, MidiChord, MidiNote } from '@/chords-and-scales'

import { Game } from './Game'

import type { BaseOptions, GuessChordsOptions } from './types'

type GuessableChord = MidiChord & { allowed?: Set<number> }
interface Guess {
  chord: string
  notes: MidiNote[]
}

export class GuessChords extends Game<
  'chords-write' | 'chords-play' | 'chords-diatonic',
  GuessableChord,
  Guess
> {
  played = new Set<number>()
  opts: GuessChordsOptions

  constructor(
    type: 'chords-write' | 'chords-play' | 'chords-diatonic',
    baseOpts: BaseOptions,
    opts: GuessChordsOptions
  ) {
    const min = baseOpts.range[0]
    const max = baseOpts.range[1]
    const scaleSemitones = new Set(baseOpts.scale.scaleNotes.map(s => s.semitones))

    const values = opts.chords.flatMap(chord => {
      const arr: GuessableChord[] = []
      const maxInterval = chord.intervals.reduce(
        (acc, cur) => (cur.semitones > acc ? cur.semitones : acc),
        0
      )
      // @TODO chord inversions
      for (let midi = min; midi <= max - maxInterval; midi += 1) {
        if (
          (!opts.onlyScale || scaleSemitones.has(midi % 12)) &&
          (!chord.allowed || chord.allowed.has(midi % 12))
        ) {
          const notes = createChord(midi, baseOpts.scale, chord.intervals)
          arr.push({
            ...chord,
            rootNote: notes[0].note,
            chord: `${notes[0].note}${chord.suffixes[0]}`,
            notes
          })
        }
      }
      return arr
    })
    // console.log('values', values)
    super(type, values, baseOpts)
    this.opts = opts
  }
  addPlayedNote(midi: number) {
    this.played.add(midi)
  }
  guessWrittenChord(value: { note: string; flats: number; sharps: number; chord: string }) {
    const guessed = {
      chord: `${noteIntoString(value)}${value.chord.toLowerCase()}`,
      notes: []
    }
    let result = this.current.chord === guessed.chord
    // Incase the chord was major chord, also accept inputs without "maj" suffix
    if (this.current.chord.slice(-3) === 'maj' && !result) {
      result = this.current.chord.slice(0, -3) === guessed.chord
    }
    return this.addGuessed(guessed, result)
  }
  guess() {
    const notes = Array.from(this.played.values())
      .map(v => getNote(v))
      .sort((a, b) => a.midi - b.midi)
    this.played.clear()
    const guessed = {
      chord: '',
      notes
    }
    const result = this.current.notes.every(n => notes.find(note => note.midi % 12 === n.midi % 12))
    return this.addGuessed(guessed, result)
  }
}
