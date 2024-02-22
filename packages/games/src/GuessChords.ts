import { createChord, getNote, noteIntoString } from '@/chords-and-scales'

import type { Chord, MidiChord, MidiNote } from '@/chords-and-scales'

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
        if (
          (!opts.onlyScale || scaleSemitones.has(midi % 12)) &&
          (!chord.allowed || chord.allowed.has(midi % 12))
        ) {
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
    // console.log('values', values)
    super(type, values, baseOpts)
  }
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
      notes
    }
    const result = this.current.notes.every(n => notes.find(note => note.midi % 12 === n.midi % 12))
    return this.addGuessed(guessed, result)
  }
}
