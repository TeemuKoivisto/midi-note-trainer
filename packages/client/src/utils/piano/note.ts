import type { Piano } from './piano'

export class Note {
  noteA: AudioBufferSourceNode
  noteB: AudioBufferSourceNode | null
  gainA: GainNode
  gainB: GainNode
  gain: GainNode
  biquadFilter: BiquadFilterNode
  damp?: AudioBufferSourceNode
  piano: Piano

  constructor(val: number, piano: Piano) {
    this.piano = piano
    this.noteA = piano.context.createBufferSource()
    this.noteB = piano.context.createBufferSource()
    this.gainA = piano.context.createGain()
    this.gainB = piano.context.createGain()
    this.gain = piano.context.createGain()
    this.biquadFilter = piano.context.createBiquadFilter()
    this.biquadFilter.type = 'lowpass'

    this.biquadFilter.connect(piano.directGain)
    this.gain.connect(this.biquadFilter)
    this.gainA.connect(this.gain)
    this.noteA.connect(this.gainA)
    this.gainB.connect(this.gain)
    this.noteB.connect(this.gainB)

    if (val < 90) {
      this.damp = piano.context.createBufferSource()
      this.damp.buffer = piano.damper as AudioBuffer
      this.damp.connect(this.piano.directGain)
    }
  }

  on(
    bufA: number,
    bufB: number,
    rateA: number,
    rateB: number,
    filtFreq: number,
    gain_A: number,
    gain_B: number,
    gain_: number
  ) {
    this.noteA.buffer = this.piano.bufferlists[bufA]
    this.noteA.playbackRate.value = rateA
    this.biquadFilter.frequency.value = filtFreq
    this.gainA.gain.value = gain_A
    this.gain.gain.value = gain_

    if (this.piano.bufferlists[bufB]) {
      this.noteB!.buffer = this.piano.bufferlists[bufB]
      this.noteB!.playbackRate.value = rateB
      this.gainB.gain.value = gain_B
      this.noteB!.start(0)
    } else {
      this.noteB = null
    }
    this.noteA.start(0)
  }

  off() {
    this.noteA.stop(0)
    this.noteB!.stop(0)
  }
}
