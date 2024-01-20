import { Piano } from './piano'

export class MIDIController {
  context: AudioContext
  piano: Piano
  selectMIDI?: HTMLElement
  selectMIDIo?: HTMLElement
  midiAccess?: MIDIAccess
  midiIn = null
  midiOut = null

  constructor() {
    this.context = new AudioContext()
    this.piano = new Piano(this.context)
  }

  promptAccess() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(this.onMIDIStarted.bind(this), (err: any) => {
        console.log('MIDI not initialized - error encountered:' + err.code)
      })
    }
  }

  onMIDIStarted(midi: MIDIAccess) {
    const preferredIndex = 0
    this.midiAccess = midi
    this.selectMIDI = document.getElementById('midiIn')
    this.selectMIDIo = document.getElementById('midiOut')
    midi.onstatechange = this.midiConnectionStateChange
    this.populateMIDIInSelect()
    this.populateMIDIOutSelect()
    this.selectMIDI.onchange = selectMIDIIn
    this.selectMIDIo.onchange = selectMIDIOut
  }

  midiConnectionStateChange(e: Event) {
    console.log('connection: ' + e.port.name + ' ' + e.port.connection + ' ' + e.port.state)
    this.populateMIDIInSelect()
    this.populateMIDIOutSelect()
  }

  pressNote(midiNote: number, velocity: number) {
    // var newNoteNum  = 27 + (88 * event.clientX) / window.innerWidth;
    // var velocity =  (1 - event.clientY / window.innerHeight) * 127;
    // console.log(velocity);
    this.piano.noteOn(midiNote, velocity)
  }

  midiMessageReceived(ev: MIDIMessageEvent) {
    const cmd = ev.data[0] >> 4
    const channel = ev.data[0] & 0xf
    const noteNumber = ev.data[1]
    const velocity = ev.data[2]

    if (channel == 9) return
    if (cmd == 8 || (cmd == 9 && velocity == 0)) {
      // with MIDI, note on with velocity zero is the same as note off
      // note off
      this.piano.noteOff(noteNumber)
    } else if (cmd == 9) {
      // note on
      this.piano.noteOn(noteNumber, velocity)
    } else if (cmd == 11) {
      //controller( noteNumber, velocity);
      if (noteNumber == 64) {
        this.piano.sustain(velocity)
      }
    } else if (cmd == 14) {
      // pitch wheel
      pitchWheel((velocity * 128.0 + noteNumber - 8192) / 8192.0)
    } else if (cmd == 10) {
      // poly aftertouch
      polyPressure(noteNumber, velocity / 127)
    } else console.log('' + ev.data[0] + ' ' + ev.data[1] + ' ' + ev.data[2])
  }
  sendMidiMessage(note: number, velo: number) {
    if (this.midiOut) {
      if (velo === 0) {
        this.midiOut.send([0x80, note, 0x40])
      } else {
        this.midiOut.send([0x90, note, 0x7f])
      }
    }
  }
  selectMIDIIn(ev: MIDIMessageEvent) {
    if (this.midiIn) this.midiIn.onmidimessage = null
    const id = ev.target[ev.target.selectedIndex].value
    if (typeof this.midiAccess.inputs == 'function')
      //Old Skool MIDI inputs() code
      this.midiIn = this.midiAccess.inputs()[ev.target.selectedIndex]
    else this.midiIn = this.midiAccess.inputs.get(id)
    if (this.midiIn) this.midiIn.onmidimessage = midiMessageReceived
  }

  selectMIDIOut(ev: MIDIMessageEvent) {
    const id = ev.target[ev.target.selectedIndex].value
    if (typeof this.midiAccess.outputs == 'function')
      //Old Skool MIDI inputs() code
      this.midiIn = this.midiAccess.outputs()[ev.target.selectedIndex]
    else this.midiOut = this.midiAccess.outputs.get(id)
  }

  populateMIDIInSelect() {
    // clear the MIDI input select
    this.selectMIDI.options.length = 0
    if (this.midiIn && this.midiIn.state == 'disconnected') this.midiIn = null
    let firstInput = null

    const inputs = this.midiAccess.inputs.values()
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
      input = input.value
      if (!firstInput) firstInput = input
      const str = input.name.toString()
      let preferred =
        !this.midiIn &&
        (str.indexOf('USB') != -1 ||
          str.indexOf('Keyboard') != -1 ||
          str.indexOf('keyboard') != -1 ||
          str.indexOf('KEYBOARD') != -1)

      // if we're rebuilding the list, but we already had this port open, reselect it.
      if (this.midiIn && this.midiIn == input) preferred = true

      this.selectMIDI.appendChild(new Option(input.name, input.id, preferred, preferred))
      if (preferred) {
        this.midiIn = input
        this.midiIn.onmidimessage = midiMessageReceived
      }
    }
    if (!this.midiIn) {
      this.midiIn = firstInput
      if (this.midiIn) this.midiIn.onmidimessage = midiMessageReceived
    }
  }

  populateMIDIOutSelect() {
    // clear the MIDI input select
    this.selectMIDIo.options.length = 0
    if (this.midiOut && this.midiOut.state == 'disconnected') this.midiOut = null
    let firstOutput = null

    const outputs = this.midiAccess!.outputs.values()
    for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
      output = output.value
      if (!firstOutput) firstOutput = output
      selectMIDIo.appendChild(new Option(output.name, output.id, false, false))
    }
    if (!this.midiOut) {
      this.midiOut = firstOutput
    }
  }
}
