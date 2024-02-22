import { createScaleUnsafe } from '@/chords-and-scales'

import { GuessKeys } from '../GuessKeys'

let nextRandom = 0

describe('GuessKeys', () => {
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
  it('should generate keys correctly', () => {
    const count = 10
    const game = new GuessKeys('keys-major', {
      scale: createScaleUnsafe('C', 'major'),
      range: [60, 72],
      duplicates: true,
      count
    })
    for (let i = 0; i < count; i += 1) {
      game.guess('C')
    }
    expect(game.ended).toBe(true)
    expect(game.correct).toEqual(9)
    expect(game.idx).toEqual(10)
    expect(game.latestGuess).toEqual({
      target: 'C#',
      guessed: 'C'
    })
    expect(game.sampled).toEqual([...Array.from(new Array(count - 1)).map(_ => 'C'), 'C#'])
    expect(game.times.reduce((acc, t) => acc + t, 0)).toBeLessThan(60.0)
  })
  it('should generate keys with duplicates false', () => {
    const count = 5
    const game = new GuessKeys('keys-minor', {
      scale: createScaleUnsafe('Db', 'Diminished Half-Whole'),
      range: [0, 2],
      duplicates: false,
      count
    })
    for (let i = 0; i < count; i += 1) {
      game.guess('A')
    }
    expect(game.ended).toBe(true)
    expect(game.correct).toEqual(1)
    expect(game.idx).toEqual(5)
    expect(game.latestGuess).toEqual({
      target: 'F',
      guessed: 'A'
    })
    expect(game.sampled).toEqual(['A', 'D', 'G', 'C', 'F'])
    expect(game.times.reduce((acc, t) => acc + t, 0)).toBeGreaterThan(0.001)
  })
})
