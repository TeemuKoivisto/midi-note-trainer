import { get } from 'svelte/store'

import { played, target, scoreActions } from '../score'

let now = 1700000000000
const timeoutSpy = vi.spyOn(globalThis, 'setTimeout')

describe('score', () => {
  beforeEach(() => {
    vi.stubGlobal('Date', {
      now: () => now
    })
    const tm = setTimeout
    vi.stubGlobal('setTimeout', (cb: () => void, time?: number) => {
      now += time || 1
      return tm(cb, time)
    })
  })
  afterEach(() => {
    now = 1700000000000
    timeoutSpy.mockClear()
  })
  it.sequential('push played notes correctly', async () => {
    const started = 1700000000000
    const arr = [
      {
        color: 'default',
        flats: 0,
        midi: 60,
        note: 'C',
        semitones: 0,
        sharps: 0,
        started
      }
    ]
    scoreActions.pushPlayed(60, undefined, 200)
    expect(get(played)).toEqual(arr)
    await vi.waitFor(() => new Promise(res => setTimeout(res, 1000)), {
      timeout: 4000,
      interval: 50
    })
    expect(get(played).length).toBe(0)
    expect(timeoutSpy).toBeCalledTimes(3)

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
    expect(timeoutSpy).toBeCalledTimes(9)

    await vi.waitFor(() => new Promise(res => setTimeout(res, 2000)), {
      timeout: 4000,
      interval: 50
    })
    expect(get(played).length).toBe(0)
  })
  it.sequential('clear played notes and timeout correctly', async () => {
    const arr = [
      {
        color: 'default',
        flats: 0,
        midi: 60,
        note: 'C',
        semitones: 0,
        sharps: 0,
        started: 1700000000000
      }
    ]
    scoreActions.pushPlayed(60, undefined, 400)
    expect(get(played)).toEqual(arr)
    await vi.waitFor(() => new Promise(res => setTimeout(res, 600)), {
      timeout: 2000,
      interval: 50
    })
    expect(timeoutSpy).toBeCalledTimes(2)
    expect(get(played)).toEqual([])

    scoreActions.pushPlayed(60, undefined, 400)
    arr[0].started += 2000
    expect(get(played)).toEqual(arr)

    scoreActions.clearPlayed()
    scoreActions.pushPlayed(60, undefined, 400)
    arr[0].started += 800
    expect(get(played)).toEqual(arr)
    await vi.waitFor(() => new Promise(res => setTimeout(res, 600)), {
      timeout: 1000,
      interval: 50
    })
    expect(get(played)).toEqual([])
    expect(timeoutSpy).toBeCalledTimes(5)
  })
})
