import { chordsFromJSON, MidiNote, createScaleUnsafe, getNote } from '@/chords-and-scales'

import { GuessChords } from '../GuessChords'

let nextRandom = 0

const chords = chordsFromJSON()
const basicChords = chords.filter(c => c.suffixes[0] === 'maj' || c.suffixes[0] === 'm')

describe('GuessChords', () => {
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
    const type = 'chords-play'
    const scale = createScaleUnsafe('C', 'major')
    const range: [MidiNote, MidiNote] = [getNote(60), getNote(72)]
    const count = 10
    const game = new GuessChords(
      type,
      {
        scale,
        range,
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
    expect(game.times.reduce((acc, t) => acc + t, 0)).toBeLessThan(3.0)
  })
})
