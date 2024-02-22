import { Game, type BaseOptions } from './Game'

export const keys = {
  major: {
    C: { num: 0 },
    F: { acc: 'b', num: 1 },
    Bb: { acc: 'b', num: 2 },
    Eb: { acc: 'b', num: 3 },
    Ab: { acc: 'b', num: 4 },
    Db: { acc: 'b', num: 5 },
    Gb: { acc: 'b', num: 6 },
    Cb: { acc: 'b', num: 7 },
    G: { acc: '#', num: 1 },
    D: { acc: '#', num: 2 },
    A: { acc: '#', num: 3 },
    E: { acc: '#', num: 4 },
    B: { acc: '#', num: 5 },
    'F#': { acc: '#', num: 6 },
    'C#': { acc: '#', num: 7 }
  },
  minor: {
    A: { num: 0 },
    D: { acc: 'b', num: 1 },
    G: { acc: 'b', num: 2 },
    C: { acc: 'b', num: 3 },
    F: { acc: 'b', num: 4 },
    Bb: { acc: 'b', num: 5 },
    Eb: { acc: 'b', num: 6 },
    Ab: { acc: 'b', num: 7 },
    E: { acc: '#', num: 1 },
    B: { acc: '#', num: 2 },
    'F#': { acc: '#', num: 3 },
    'C#': { acc: '#', num: 4 },
    'G#': { acc: '#', num: 5 },
    'D#': { acc: '#', num: 6 },
    'A#': { acc: '#', num: 7 }
  }
}

export class GuessKeys extends Game<string> {
  constructor(type: 'keys-major' | 'keys-minor', baseOpts: BaseOptions) {
    const k = type === 'keys-major' ? 'major' : 'minor'
    super(type, Object.keys(keys[k]), baseOpts)
  }
  guess(key: string) {
    const result = this.current === key
    return this.addGuessed(key, result)
  }
}
