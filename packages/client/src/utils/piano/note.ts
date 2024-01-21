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

  repress(currentTime: number) {
    this.gain.gain.setTargetAtTime(0.0, currentTime, 1.1)
    this.noteA.stop(currentTime + 2)
    this.noteB.stop(currentTime + 2)
    this.damp = undefined
  }

  off(currentTime: number) {
    // this.noteA.stop(0)
    // this.noteB!.stop(0)
    this.gain.gain.setTargetAtTime(0.0, currentTime + 0.03, 0.08)
    this.noteA.stop(currentTime + 2)
    this.noteB.stop(currentTime + 2)
    this.damp?.start(0)
  }
}
