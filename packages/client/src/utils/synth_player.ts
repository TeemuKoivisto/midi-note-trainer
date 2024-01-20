import { Synthesizer, type DynamicConfig } from './synth'

import type { Clock } from './clock'

// https://github.com/heiskr/prezzy-webaudio-code/blob/master/teachers_edition_4_synthesizer.html
export interface SynthPlayerOptions {
  clock: Clock
  pattern: string[]
  octave: number
  staticConfig?: () => void
  dynamicConfig?: DynamicConfig
}

export class SynthPlayer {
  context: AudioContext
  clock: Clock
  synthesizer: Synthesizer
  pattern: string[]
  octave: number

  constructor(options: SynthPlayerOptions, context: AudioContext) {
    this.context = context
    this.clock = options.clock
    this.synthesizer = new Synthesizer(
      {
        clock: this.clock,
        staticConfig: options.staticConfig,
        dynamicConfig: options.dynamicConfig || {}
      },
      this.context
    )
    this.pattern = options.pattern
    this.octave = options.octave
    this.clock.add(this.play.bind(this))
  }

  play(now: number, beat: number, bar: number) {
    bar = bar % this.pattern.length
    const pattern = this.pattern[bar]
    if (beat >= pattern.length) {
      return
    }
    if ((beat === 0 || pattern[beat] !== pattern[beat - 1]) && pattern[beat] !== ' ') {
      const freq = this.getFrequency(pattern[beat])
      const duration = this.getDuration(pattern, beat)
      this.synthesizer.play(now, freq, duration)
    }
  }

  getFrequency(str: string) {
    let note: number
    if (str === 'a') {
      note = 10
    }
    if (str === 'b') {
      note = 11
    }
    note = parseInt(str, 10)
    note = this.octave * 12 + note
    // Converts a MIDI note number to a frequency value
    return (440 / 32) * Math.pow(2, (note - 9) / 12)
  }

  getDuration(pattern: string, beat: number) {
    const note = pattern[beat]
    let length = 1
    for (let i = beat + 1; i < pattern.length; i++) {
      if (pattern[i] === note) {
        length++
      } else {
        break
      }
    }
    return (length * 60) / this.clock.tempo
  }
}
