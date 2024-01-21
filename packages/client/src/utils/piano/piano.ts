import n21 from './audio/21.mp3?url'
import n33 from './audio/33.mp3?url'
import n45 from './audio/45.mp3?url'
import n57 from './audio/57.mp3?url'
import n69 from './audio/69.mp3?url'
import n81 from './audio/81.mp3?url'
import n93 from './audio/93.mp3?url'
import n105 from './audio/105.mp3?url'
import ndamper from './audio/damper.mp3?url'
import nimpulse from './audio/Piano Impulse6.mp3?url'

import { BufferLoader } from './bufferloader'
import { Note } from './note'

// https://github.com/iBundin/Open-Web-Piano/blob/7f6ae5fae07aaeb62a1d10ee9446b20e8cc7849d/OpenWebPiano.js
// https://github.com/MengLinMaker/Midi-Virtual-Piano/blob/a398e1c5194cb90f4252716c0d43380380605f42/src/pianoAudio/OpenWebPiano.tsx
export class Piano {
  context: AudioContext
  convolver: ConvolverNode
  directGain: GainNode
  convGain: GainNode
  convGainAfter: GainNode
  bufferlists: AudioBuffer[] = []
  damper?: AudioBuffer
  sus = false
  sustained: number[] = []
  notes: Record<number, Note> = {}
  bufferLoader: BufferLoader

  constructor(context: AudioContext) {
    this.context = context
    this.convolver = context.createConvolver()
    this.directGain = context.createGain()
    this.convGain = context.createGain()
    this.convGainAfter = context.createGain()
    this.convGain.connect(this.convolver)
    this.convolver.connect(this.convGainAfter)
    this.convGainAfter.connect(context.destination)
    this.directGain.connect(context.destination)
    this.directGain.connect(this.convGain)
    this.directGain.gain.value = 0.5
    this.convGain.gain.value = 0
    this.convGainAfter.gain.value = 0
    this.bufferLoader = new BufferLoader(
      context,
      [n21, n33, n45, n57, n69, n81, n93, n105, ndamper, nimpulse],
      (bufferlist: AudioBuffer[]) => {
        this.bufferlists = bufferlist
        this.damper = bufferlist[8]
        this.convolver.buffer = bufferlist[9]
      }
    )
    this.bufferLoader.load()
  }

  noteOn(noteNumber: number, velocity: number) {
    console.log('play note')
    if (noteNumber < 109 && noteNumber > 20) {
      if (this.notes[noteNumber]) {
        this.notes[noteNumber].gain.gain.setTargetAtTime(0.0, this.context.currentTime, 1.1)
        this.notes[noteNumber].noteA.stop(this.context.currentTime + 2)
        this.notes[noteNumber].noteB!.stop(this.context.currentTime + 2)
        this.notes[noteNumber].damp = undefined
        this.sustained.splice(this.sustained.indexOf(noteNumber), 1)
      }

      const bufNumA = Math.floor((noteNumber - 21) / 12)
      const bufNumB = bufNumA + 1
      const noteNum = bufNumA * 12 + 21

      const freq = 2 ** ((noteNumber - 69) / 12) * 440
      const velo = velocity / 127
      const harmQuant = 20000 / freq
      const scale = 1
      let filtFreq = freq * (2 - (noteNumber - 21) / 50) + 3 * freq * velo
      if (noteNumber < 60) filtFreq = 440 * (3 - (60 - 21) / 50) + 3 * freq * velo

      const gain_A = 2 // equalGain( 1 - ((noteNumber-21)%12) / 11 );
      const rate_A = Math.pow(2, (noteNumber - noteNum) / 12)
      const rate_B = 0
      const gain_B = 0
      const gain_ = velo ** 1.4
      /*/
      if (bufNumB<8) {
        let rate_B = Math.pow(2, (noteNumber-(noteNum+12))/12);
        let gain_B = 1 - gain_A;
      }
      //*/
      this.notes[noteNumber] = new Note(noteNumber, this)
      this.notes[noteNumber].on(bufNumA, bufNumB, rate_A, rate_B, filtFreq, gain_A, gain_B, gain_)
    }
  }

  noteOff(noteNumber: number) {
    if (!this.sus) {
      if (noteNumber < 90) {
        this.notes[noteNumber].gain.gain.setTargetAtTime(0.0, this.context.currentTime + 0.03, 0.08)
        this.notes[noteNumber].noteA.stop(this.context.currentTime + 2)
        this.notes[noteNumber].noteB!.stop(this.context.currentTime + 2)
        this.notes[noteNumber].damp!.start(0)
      }
      delete this.notes[noteNumber]
    } else {
      this.sustained.push(noteNumber)
    }
  }

  sustain(val: number) {
    if (val == 127) {
      this.sus = true
      this.convGain.gain.value = 1
      this.convGainAfter.gain.value = 1
    } else if (val == 0) {
      this.sus = false
      this.convGain.gain.value = 0.0
      this.convGainAfter.gain.value = 0
      for (let i = 0; i < this.sustained.length; i++) {
        if (this.notes[this.sustained[i]]) {
          this.noteOff(this.sustained[i])
        }
      }
      this.sustained = []
    }
  }
}
