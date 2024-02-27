import { createScaleUnsafe } from '@/chords-and-scales'

import { GuessNotes } from '../GuessNotes'

let nextRandom = 0

describe('GuessNotes', () => {
  beforeEach(() => {
    nextRandom = 0
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
    const count = 10
    const game = new GuessNotes('notes', {
      scale: createScaleUnsafe('C', 'major'),
      range: [60, 72],
      duplicates: true,
      count
    })
    for (let i = 0; i < count; i += 1) {
      expect(game.ended).toBe(false)
      game.guess(60)
    }
    expect(game.ended).toBe(true)
    expect(game.correct).toEqual(9)
    expect(game.guesses.length).toEqual(10)
    expect(game.idx).toEqual(10)
    expect(game.latestGuess).toEqual({
      target: 72,
      guessed: 60
    })
    expect(game.sampled).toEqual([...Array.from(new Array(count - 1)).map(_ => 60), 72])
    expect(game.times.reduce((acc, t) => acc + t, 0)).toBeLessThan(600.0)
  })
  it('should generate notes with duplicates false', () => {
    const count = 5
    const game = new GuessNotes('pitches', {
      scale: createScaleUnsafe('Db', 'Diminished Half-Whole'),
      range: [0, 2],
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
