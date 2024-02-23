import { get } from 'svelte/store'

import { played, target, scoreActions } from '../score'

let nowCounter = 1700000000000

describe('score', () => {
  beforeEach(() => {
    vi.stubGlobal('Date', {
      now: () => {
        nowCounter += 100
        return nowCounter
      }
    })
  })
  it.sequential('push played notes correctly', async () => {
    const arr = [
      {
        color: 'default',
        flats: 0,
        midi: 60,
        note: 'C',
        semitones: 0,
        sharps: 0,
        started: 1700000000100
      }
    ]
    scoreActions.pushPlayed(60, undefined, 200)
    expect(get(played)).toEqual([arr[0]])
    await vi.waitFor(() => new Promise(res => setTimeout(res, 1000)), {
      timeout: 4000,
      interval: 50
    })
    expect(get(played).length).toBe(0)
    scoreActions.pushPlayed(60, undefined, 500)
    setTimeout(() => {
      scoreActions.pushPlayed(60, undefined, 500)
      scoreActions.pushPlayed(72, undefined, 500)
    }, 0)
    setTimeout(() => {
      scoreActions.pushPlayed(60, undefined, 500)
      scoreActions.pushPlayed(80, undefined, 500)
    }, 1)
    setTimeout(() => {
      scoreActions.pushPlayed(60, undefined, 500)
      scoreActions.pushPlayed(61, undefined, 500)
    }, 2)
    setTimeout(() => {
      scoreActions.pushPlayed(60, undefined, 500)
      scoreActions.pushPlayed(62, undefined, 500)
      expect(get(played).length).toBe(5)
    }, 3)
    setTimeout(() => {
      scoreActions.pushPlayed(60, undefined, 500)
    }, 750)
    const p = get(played)
    expect(p).toEqual([{ ...arr[0], started: p[0].started }])
    await vi.waitFor(() => new Promise(res => setTimeout(res, 2000)), {
      timeout: 4000,
      interval: 50
    })
    expect(get(played).length).toBe(0)
  })
})
