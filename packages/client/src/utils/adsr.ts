import type { DynamicConfig } from './synth'

export class ADSR {
  attack: number
  decay: number
  sustain: number
  release: number
  params: AudioParam[] | null = null

  constructor(options: DynamicConfig) {
    this.attack = options.attack || 0.02 // ...in seconds
    this.decay = options.decay || 0.02 // ...in seconds
    this.sustain = options.sustain || 0.5 // ...in amplitude
    this.release = options.release || 0.02 // ...in seconds
  }

  connect(param: AudioParam) {
    this.params = this.params || []
    this.params.push(param)
  }

  disconnect() {
    this.params = null
  }

  play(now: number, duration: number) {
    this.params?.forEach(param => {
      param.cancelScheduledValues(now)
      param.setValueAtTime(param.value || 0, now)
      param.linearRampToValueAtTime(1, now + this.attack)
      param.setValueAtTime(1, now + this.attack)
      param.linearRampToValueAtTime(this.sustain, now + this.attack + this.decay)
      param.setValueAtTime(this.sustain, now + duration - this.release)
      param.linearRampToValueAtTime(0, now + duration)
    })
    setTimeout(this.disconnect.bind(this), duration)
  }
}
