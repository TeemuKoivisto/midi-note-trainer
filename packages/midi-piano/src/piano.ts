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
  notes: Map<number, Note> = new Map()

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
    // Master gain, at 1.0 it will definitely clip at least with these piano samples
    this.directGain.gain.value = 0.75
    this.convGain.gain.value = 0
    this.convGainAfter.gain.value = 0
    return this
  }

  load(buffers: AudioBuffer[]) {
    buffers.forEach((buf, idx) => {
      this.bufferlists.push(buf)
      if (idx === 8) {
        this.damper = buf
      } else if (idx === 9) {
        this.convolver.buffer = buf
      }
    })
  }

  playChord(notes: number[], velocity = 80) {
    notes.forEach(n => {
      this.noteOn(n, velocity)
    })
  }

  /**
   * Play single MIDI Note
   *
   * https://en.wikipedia.org/wiki/MIDI#Messages
   * @param noteNumber From 0 (-C1) to 127 (G9)
   * @param velocity From 1 lowest to 127 highest
   */
  noteOn(noteNumber: number, velocity = 80) {
    // console.log(`play note ${noteNumber} ${velocity}`)
    if (noteNumber < 109 && noteNumber > 20) {
      const oldNote = this.notes.get(noteNumber)
      if (oldNote) {
        oldNote.off(this.context.currentTime, 1.1, this.context.currentTime + 2)
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

      // Gives each note in octave its own unique gain to make chords sound less bricky
      const gain_A = 1 - ((noteNumber % 12) / 12 + 1) / 12
      const rate_A = Math.pow(2, (noteNumber - noteNum) / 12)
      const rate_B = 0
      const gain_B = 0
      const gain_ = velo ** 1.4
      // Adds weird echo
      // if (bufNumB < 8) {
      //   rate_B = Math.pow(2, (noteNumber - (noteNum + 12)) / 12)
      //   gain_B = 1 - gain_A
      // }
      const note = new Note(noteNumber, this.context, this.directGain, this.damper as AudioBuffer)
      note.on(
        this.bufferlists[bufNumA],
        this.bufferlists[bufNumB],
        rate_A,
        rate_B,
        filtFreq,
        gain_A,
        gain_B,
        gain_
      )
      this.notes.set(noteNumber, note)
    }
  }

  noteOff(noteNumber: number) {
    if (!this.sus) {
      const oldNote = this.notes.get(noteNumber)
      if (noteNumber < 90 && oldNote) {
        oldNote.off(this.context.currentTime + 0.03, 0.08, this.context.currentTime + 2)
      }
      this.notes.delete(noteNumber)
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
        if (this.notes.has(this.sustained[i])) {
          this.noteOff(this.sustained[i])
        }
      }
      this.sustained.length = 0
    }
  }
}
