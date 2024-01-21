interface ClockOptions {
  tempo: number
  numBeats: number
}

export class Clock {
  context: AudioContext
  tempo: number
  numBeats: number
  handlers: ((now: number, beat: number, bar: number) => void)[] = []
  beat = -1
  bar = 0
  start: number
  _tick: () => void

  constructor(options: ClockOptions, context: AudioContext) {
    this.context = context
    this.tempo = options.tempo
    this.numBeats = options.numBeats
    this.start = this.context.currentTime
    this._tick = this.tick.bind(this)
    this._tick()
  }

  // Add a method to be called on each clock tick.
  add(fn: (now: number, beat: number, bar: number) => void) {
    this.handlers.push(fn)
  }

  // Iterate on this function as quickly as JavaScript can process.
  // Determines when a new beat needs to be played.
  tick() {
    const now = this.context.currentTime
    const time = now - this.start
    const currentBeat = Math.floor((time * this.tempo) / 60)

    if (currentBeat >= this.numBeats) {
      this.start = now
      this.beat = 0
      this.bar++
      this.trigger(now)
    } else if (this.beat < currentBeat) {
      this.beat = currentBeat
      this.trigger(now)
    }

    setTimeout(this._tick, 0)
  }

  // Call the handlers with the current beat and bar
  trigger(now: number) {
    const clock = this
    this.handlers.forEach(function (fn) {
      fn(now, clock.beat, clock.bar)
    })
  }
}
