import { Game } from './Game'

import type { BaseOptions } from './types'

export class GuessNotes extends Game<number> {
  constructor(type: 'notes' | 'pitches', baseOpts: BaseOptions) {
    const min = baseOpts.range[0].midi
    const max = baseOpts.range[1].midi
    super(
      type,
      Array.from(new Array(max - min + 1)).map((_, i) => min + i),
      baseOpts
    )
  }
  guess(midi: number) {
    const result = this.current === midi
    return this.addGuessed(midi, result)
  }
}