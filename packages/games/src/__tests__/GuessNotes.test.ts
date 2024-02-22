import { MidiNote, createScaleUnsafe, getNote } from '@/chords-and-scales'

import { GuessNotes } from '../GuessNotes'

let nextRandom = 0

describe('GuessNotes', () => {
  beforeAll(() => {
    vi.stubGlobal('Math', {
      floor: Math.floor,
      ceil: Math.ceil,
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
  it('should generate notes correctly', () => {
    const type = 'notes'
    const scale = createScaleUnsafe('C', 'major')
    const range: [MidiNote, MidiNote] = [getNote(60), getNote(72)]
    const count = 10
    const game = new GuessNotes(type, {
      scale,
      range,
      duplicates: true,
      count
    })
    for (let i = 0; i < count; i += 1) {
      game.guess(60)
    }
    expect(game.ended).toBe(true)
    expect(game.correct).toEqual(9)
    expect(game.idx).toEqual(10)
    expect(game.latestGuess).toEqual({
      target: 72,
      guessed: 60
    })
    expect(game.sampled).toEqual([...Array.from(new Array(count - 1)).map(_ => 60), 72])
    expect(game.times.reduce((acc, t) => acc + t, 0)).toBeLessThan(1.0)
  })
  it('should generate notes with duplicates false', () => {
    const type = 'pitches'
    const scale = createScaleUnsafe('Db', 'Diminished Half-Whole')
    const range: [MidiNote, MidiNote] = [getNote(0), getNote(2)]
    const count = 5
    const game = new GuessNotes(type, {
      scale,
      range,
      duplicates: false,
      count
    })
    for (let i = 0; i < count; i += 1) {
      game.guess(60)
    }
    expect(game.ended).toBe(true)
    expect(game.correct).toEqual(0)
    expect(game.idx).toEqual(5)
    expect(game.latestGuess).toEqual({
      target: 0,
      guessed: 60
    })
    expect(game.sampled).toEqual([0, 0, 0, 0, 0])
    expect(game.times.reduce((acc, t) => acc + t, 0)).toBeGreaterThan(0.001)
  })
})
