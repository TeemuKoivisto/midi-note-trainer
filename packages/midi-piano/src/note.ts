export class Note {
  noteA: AudioBufferSourceNode
  noteB: AudioBufferSourceNode
  gainA: GainNode
  gainB: GainNode
  gain: GainNode
  biquadFilter: BiquadFilterNode
  damp?: AudioBufferSourceNode

  constructor(val: number, context: AudioContext, directGain: GainNode, damper: AudioBuffer) {
    this.noteA = context.createBufferSource()
    this.noteB = context.createBufferSource()
    this.gainA = context.createGain()
    this.gainB = context.createGain()
    this.gain = context.createGain()
    this.biquadFilter = context.createBiquadFilter()
    this.biquadFilter.type = 'lowpass'

    this.biquadFilter.connect(directGain)
    this.gain.connect(this.biquadFilter)
    this.gainA.connect(this.gain)
    this.noteA.connect(this.gainA)
    this.gainB.connect(this.gain)
    this.noteB.connect(this.gainB)

    if (val < 90) {
      this.damp = context.createBufferSource()
      this.damp.buffer = damper
      this.damp.connect(directGain)
    }
  }

  on(
    bufA: AudioBuffer,
    bufB: AudioBuffer,
    rateA: number,
    rateB: number,
    filtFreq: number,
    gain_A: number,
    gain_B: number,
    gain_: number
  ) {
    this.noteA.buffer = bufA
    this.noteA.playbackRate.value = rateA
    this.biquadFilter.frequency.value = filtFreq
    this.gainA.gain.value = gain_A
    this.gain.gain.value = gain_
    if (bufB) {
      this.noteB!.buffer = bufB
      this.noteB.playbackRate.value = rateB
      this.gainB.gain.value = gain_B
      this.noteB.start(0)
    }
    this.noteA.start(0)
  }

  off(startTime: number, timeConstant: number, stop: number) {
    this.gain.gain.setTargetAtTime(0.0, startTime, timeConstant)
    this.noteA.stop(stop)
    this.noteB.stop(stop)
    this.damp?.start(0)
  }
}
