import { chordsFromJSON, createScaleUnsafe, createTrichords } from '@/chords-and-scales'

import { GuessChords } from '../GuessChords'

let nextRandom = 0

const chords = chordsFromJSON()
const basicChords = chords.filter(c => c.suffixes[0] === 'maj' || c.suffixes[0] === 'm')

describe('GuessChords', () => {
  beforeEach(() => {
    nextRandom = 0
    vi.stubGlobal('Math', {
      floor: Math.floor,
      ceil: Math.ceil,
      max: Math.max,
      min: Math.min,
      random: () => {
        if (nextRandom === 9) {
          nextRandom = 0
          return 0.99999
        } else {
          nextRandom += 1
          return 0.0
        }
      }
    })
  })
  it('should generate C major chords correctly', () => {
    const scale = createScaleUnsafe('C', 'major')
    const count = 10
    const game = new GuessChords(
      'chords-play',
      {
        scale,
        range: [60, 72],
        duplicates: true,
        count
      },
      {
        chords: basicChords
      }
    )
    for (let i = 0; i < count; i += 1) {
      game.addPlayedNote(60)
      game.addPlayedNote(64)
      game.addPlayedNote(67)
      game.guess()
    }
    expect(game.ended).toBe(true)
    expect(game.correct).toEqual(9)
    expect(game.idx).toEqual(10)
    expect(game.latestGuess.target?.chord).toEqual('Fm')
    expect(game.latestGuess.target?.notes.length).toEqual(3)
    expect(game.latestGuess.guessed?.chord).toEqual('')
    expect(game.latestGuess.guessed?.notes.map(n => n.midi)).toEqual([60, 64, 67])
    expect(game.data.length).toEqual(12)
    expect(game.times.reduce((acc, t) => acc + t, 0)).toBeLessThan(600.0)
  })
  it('should generate all chords correctly', () => {
    const scale = createScaleUnsafe('C', 'major')
    const count = 10
    const game = new GuessChords(
      'chords-write',
      {
        scale,
        range: [60, 80],
        duplicates: false,
        count
      },
      {
        chords
      }
    )
    for (let i = 0; i < count; i += 1) {
      game.addPlayedNote(60)
      game.addPlayedNote(64)
      game.addPlayedNote(67)
      game.guess()
    }
    expect(game.ended).toBe(true)
    expect(game.correct).toEqual(1)
    expect(game.idx).toEqual(10)
    expect(game.latestGuess.target?.chord).toEqual('B♭aug7')
    expect(game.latestGuess.target?.notes.length).toEqual(4)
    expect(game.latestGuess.guessed?.chord).toEqual('')
    expect(game.latestGuess.guessed?.notes.map(n => n.midi)).toEqual([60, 64, 67])
    expect(game.data.length).toEqual(245)
    expect(game.times.reduce((acc, t) => acc + t, 0)).toBeLessThan(600.0)
  })
  it('should generate C major trichords correctly', () => {
    const scale = createScaleUnsafe('C', 'major')
    const count = 10
    const game = new GuessChords(
      'chords-diatonic',
      {
        scale,
        range: [60, 80],
        duplicates: true,
        count
      },
      {
        chords: createTrichords(scale.trichords).map((c, idx) => ({
          ...c,
          allowed: new Set([scale.scaleNotes[idx].semitones])
        }))
      }
    )
    for (let i = 0; i < count; i += 1) {
      game.addPlayedNote(60)
      game.addPlayedNote(64)
      game.addPlayedNote(67)
      game.guess()
    }
    expect(game.ended).toBe(true)
    expect(game.correct).toEqual(9)
    expect(game.idx).toEqual(10)
    expect(game.latestGuess.target?.chord).toEqual('Bdim')
    expect(game.latestGuess.target?.notes.length).toEqual(3)
    expect(game.latestGuess.guessed?.chord).toEqual('')
    expect(game.latestGuess.guessed?.notes.map(n => n.midi)).toEqual([60, 64, 67])
    expect(game.data.map(d => d.chord)).toEqual([
      'Cmaj',
      'Cmaj',
      'Dm',
      'Em',
      'Fmaj',
      'Gmaj',
      'Am',
      'Bdim'
    ])
    expect(game.times.reduce((acc, t) => acc + t, 0)).toBeLessThan(600.0)
  })
  it('should generate G Locrian Natural-2 trichords correctly', () => {
    const scale = createScaleUnsafe('C#', 'Locrian Natural-2')
    const count = 10
    const game = new GuessChords(
      'chords-diatonic',
      {
        scale,
        range: [60, 80],
        duplicates: true,
        count
      },
      {
        chords: createTrichords(scale.trichords).map((c, idx) => ({
          ...c,
          allowed: new Set([scale.scaleNotes[idx].semitones])
        }))
      }
    )
    for (let i = 0; i < count; i += 1) {
      game.addPlayedNote(61)
      game.addPlayedNote(64)
      game.addPlayedNote(67)
      game.guess()
    }
    expect(game.ended).toBe(true)
    expect(game.correct).toEqual(9)
    expect(game.latestGuess.target?.chord).toEqual('Bmaj')
    expect(game.latestGuess.target?.notes.length).toEqual(3)
    expect(game.latestGuess.guessed?.chord).toEqual('')
    expect(game.latestGuess.guessed?.notes.map(n => n.midi)).toEqual([61, 64, 67])
    expect(game.data.map(d => d.chord)).toEqual([
      'C♯dim',
      'C♯dim',
      'D♯dim',
      'Em',
      'F♯m',
      'Gaug',
      'Amaj',
      'Bmaj'
    ])
    expect(game.times.reduce((acc, t) => acc + t, 0)).toBeLessThan(600.0)
  })
  it('should generate Db Diminished Half-Whole trichords correctly', () => {
    const scale = createScaleUnsafe('Db', 'Diminished Half-Whole')
    const count = 10
    const game = new GuessChords(
      'chords-diatonic',
      {
        scale,
        range: [60, 80],
        duplicates: true,
        count
      },
      {
        chords: createTrichords(scale.trichords).map((c, idx) => ({
          ...c,
          allowed: new Set([scale.scaleNotes[idx].semitones])
        }))
      }
    )
    for (let i = 0; i < count; i += 1) {
      game.guess()
    }
    expect(game.ended).toBe(true)
    expect(game.correct).toEqual(0)
    expect(game.latestGuess.target?.chord).toEqual('C♭dim')
    expect(game.latestGuess.target?.notes.length).toEqual(3)
    expect(game.latestGuess.guessed?.chord).toEqual('')
    expect(game.latestGuess.guessed?.notes).toEqual([])
    expect(game.data.map(d => d.chord)).toEqual([
      'D♭maj',
      'D♭maj',
      'E♭♭dim',
      'E♭♭dim',
      'F♭maj',
      'G♭♭dim',
      'A♭♭maj',
      'A♭dim',
      'B♭maj',
      'C♭dim'
    ])
    expect(game.times.reduce((acc, t) => acc + t, 0)).toBeLessThan(600.0)
  })
  it('should accept written chords as well', () => {
    const scale = createScaleUnsafe('D', 'major')
    const count = 10
    const game = new GuessChords(
      'chords-write',
      {
        scale,
        range: [60, 72],
        duplicates: true,
        count
      },
      {
        chords: basicChords
      }
    )
    for (let i = 0; i < count; i += 1) {
      if (i === 0) {
        game.guessWrittenChord({ note: 'C', flats: 0, sharps: 0, chord: 'maj' })
      } else {
        game.guessWrittenChord({ note: 'C', flats: 0, sharps: 0, chord: '' })
      }
    }
    expect(game.ended).toBe(true)
    expect(game.correct).toEqual(9)
    expect(game.idx).toEqual(10)
    expect(game.latestGuess.target?.chord).toEqual('Fm')
    expect(game.latestGuess.target?.notes.length).toEqual(3)
    expect(game.latestGuess.guessed?.chord).toEqual('C')
    expect(game.latestGuess.guessed?.notes.map(n => n.midi)).toEqual([])
    expect(game.data.length).toEqual(12)
    expect(game.times.reduce((acc, t) => acc + t, 0)).toBeLessThan(600.0)
  })
})
