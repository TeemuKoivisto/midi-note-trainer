import { ADSR } from './adsr'

import type { Clock } from './clock'

export interface SynthesizerOptions {
  clock: Clock
  staticConfig?: () => void
  dynamicConfig?: DynamicConfig
}
export interface DynamicConfig {
  attack?: number
  decay?: number
  sustain?: number
  release?: number
}

export class Synthesizer {
  context: AudioContext
  clock: Clock
  staticConfig?: () => void
  dynamicConfig: DynamicConfig

  osc1gain: GainNode
  osc2gain: GainNode
  filter: BiquadFilterNode
  pan: PannerNode
  gain: GainNode

  constructor(options: SynthesizerOptions, context: AudioContext) {
    this.context = context
    this.clock = options.clock
    this.staticConfig = options.staticConfig
    this.dynamicConfig = options.dynamicConfig || {}
    this.osc1gain = this.context.createGain()
    this.osc2gain = this.context.createGain()
    this.filter = this.context.createBiquadFilter()
    this.pan = this.context.createPanner()
    this.gain = this.context.createGain()
    this.configure()
    if (this.staticConfig) {
      this.staticConfig()
    }
    this.connect()
  }

  // Create the synthesizer's nodes.
  createNodes() {
    this.osc1gain = this.context.createGain()
    this.osc2gain = this.context.createGain()
    this.filter = this.context.createBiquadFilter()
    this.pan = this.context.createPanner()
    this.gain = this.context.createGain()
  }

  // Configure the nodes.
  configure() {
    this.osc1gain.gain.value = 0.15
    this.osc2gain.gain.value = 0.1
    this.filter.type = 'lowpass'
    this.filter.frequency.value = 2000
    this.filter.Q.value = 4
    this.pan.setPosition(0, 0, 0)
    this.gain.gain.value = 1
  }

  // Wire up the synthesizer's nodes.
  connect() {
    this.osc1gain!.connect(this.filter)
    this.osc2gain!.connect(this.filter)
    this.filter!.connect(this.pan)
    this.pan!.connect(this.gain)
    this.gain!.connect(this.context.destination)
  }

  play(now: number, freq: number, duration: number) {
    // (1) Create two oscillator nodes.
    const osc1 = this.context.createOscillator()
    const osc2 = this.context.createOscillator()

    // (2) Create two new gain nodes for the ADSR envelope.
    //     You may wish to use the names `adsr1gain` and `adsr2gain`.
    const adsr1gain = this.context.createGain()
    const adsr2gain = this.context.createGain()

    // [given] Create an ADSR envelope.
    const adsr = new ADSR(this.dynamicConfig)

    // (3) Set both oscillators' type and frequency (`freq`).
    //     `osc1` should be a square, `osc2` should be a sawtooth.
    //     _Optional_: detune the second oscillator by five cents.
    osc1.frequency.value = freq
    osc1.type = 'square'
    osc2.frequency.value = freq
    osc2.type = 'sawtooth'
    osc2.detune.value = 5

    // (4) Connect the oscillators to the ADSR gain nodes.
    osc1.connect(adsr1gain)
    osc2.connect(adsr2gain)

    // [given] Connect the ADSR to the ADSR gain nodes' AudioParam.
    adsr.connect(adsr1gain.gain)
    adsr.connect(adsr2gain.gain)

    // (5) Connect the ADSR gain nodes to `this.osc1gain` and `this.osc2gain`.
    adsr1gain.connect(this.osc1gain)
    adsr2gain.connect(this.osc2gain)

    // (6) Play the oscillators.
    //     Specify how long to play the oscillators.
    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + duration)
    osc2.stop(now + duration)

    // [given] Play the ADSR.
    adsr.play(now, duration)
  }
}
