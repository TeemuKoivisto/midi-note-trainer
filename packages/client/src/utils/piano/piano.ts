import a0 from './audio/a0.mp3?url'
import a1 from './audio/a1.mp3?url'
import a2 from './audio/a2.mp3?url'
import a3 from './audio/a3.mp3?url'
import a4 from './audio/a4.mp3?url'
import a5 from './audio/a5.mp3?url'
import a6 from './audio/a6.mp3?url'
import a7 from './audio/a7.mp3?url'
import ndamper from './audio/damper.mp3?url'
import nimpulse from './audio/Piano Impulse6.mp3?url'

import { load } from './load'
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
    return this
  }

  async load() {
    const urls = [a0, a1, a2, a3, a4, a5, a6, a7, ndamper, nimpulse]
    const loaded = await Promise.all(urls.map(url => load(url, this.context)))
    this.bufferlists = []
    loaded.forEach((buf, idx) => {
      if ('data' in buf) {
        this.bufferlists.push(buf.data)
        if (idx === 8) {
          this.damper = buf.data
        } else if (idx === 9) {
          this.convolver.buffer = buf.data
        }
      } else {
        console.error(`Failed to load audio: ${buf.err}`)
      }
    })
  }

  /**
   * Play single MIDI Note
   *
   * https://en.wikipedia.org/wiki/MIDI#Messages
   * @param noteNumber From 0 (-C1) to 127 (G9)
   * @param velocity From 1 lowest to 127 highest
   */
  noteOn(noteNumber: number, velocity: number) {
    console.log(`play note ${noteNumber} ${velocity}`)
    if (noteNumber < 109 && noteNumber > 20) {
      if (this.notes[noteNumber]) {
        this.notes[noteNumber].repress(this.context.currentTime)
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
      this.notes[noteNumber] = new Note(
        noteNumber,
        this.context,
        this.directGain,
        this.damper as AudioBuffer
      )
      this.notes[noteNumber].on(
        this.bufferlists[bufNumA],
        this.bufferlists[bufNumB],
        rate_A,
        rate_B,
        filtFreq,
        gain_A,
        gain_B,
        gain_
      )
    }
  }

  noteOff(noteNumber: number) {
    if (!this.sus) {
      if (noteNumber < 90) {
        this.notes[noteNumber].off(this.context.currentTime)
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
      this.sustained.length = 0
    }
  }
}
