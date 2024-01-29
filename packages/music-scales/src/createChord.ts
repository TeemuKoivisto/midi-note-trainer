function parseInteger(str: string) {
  try {
    return parseInt(str)
  } catch (err: any) {
    return 0
  }
}

interface Chord {
  // midiStart: number
  suffix: string
  notes: string[]
}

export interface Scale {
  key: string
  notes: ScaleNote[]
}

export interface ScaleNote {
  note: string
  interval: number
  // order: number ??
  flats: number
  sharps: number
}

function parseNote(note: string) {
  let interval = ''
  let flats = 0
  let sharps = 0
  for (let j = 0; j < note.length; j += 1) {
    if (note[j] === 'b' || note[j] === '♭') {
      flats += 1
    } else if (note[j] === '#' || note[j] === '♯' || note[j] === 's') {
      sharps += 1
    } else if (regexPosInt.test(note[j])) {
      interval += note[j]
    }
  }
  return { interval: parseInteger(interval), flats, sharps }
}

const regexPosInt = /^[0-9]$/

export function createChord(notes: string[], octave: number, scale: Scale) {
  const chord: ScaleNote[] = []
  const scaleIntervals = scale.notes.reduce(
    (acc, n) => {
      acc[n.interval] = n
      return acc
    },
    {} as Record<number, ScaleNote>
  )
  for (let i = 0; i < notes.length; i += 1) {
    const note = notes[i].trim()
    let intervalStr = ''
    let flats = 0
    let sharps = 0
    for (let j = 0; j < note.length; j += 1) {
      if (note[j] === 'b' || note[j] === '♭') {
        flats += 1
      } else if (note[j] === '#' || note[j] === '♯' || note[j] === 's') {
        sharps += 1
      } else if (regexPosInt.test(note[j])) {
        intervalStr += note[j]
      }
    }
    const interval = parseInteger(intervalStr)
    if (interval === 0) continue
    const foundInScale = { ...scaleIntervals[interval] }
    if (Object.keys(foundInScale).length > 0) {
      if (foundInScale.flats === flats && foundInScale.sharps === sharps) {
        chord.push(foundInScale)
      } else {
        // debugger
        foundInScale.flats -= sharps
        foundInScale.sharps -= flats
        foundInScale.flats = foundInScale.sharps < 0 ? foundInScale.sharps * -1 : 0
        foundInScale.sharps = foundInScale.flats < 0 ? foundInScale.flats * -1 : 0
        console.log('note ', foundInScale)
        foundInScale.note = `${'♭'.repeat(foundInScale.flats)}${'♯'.repeat(foundInScale.sharps)}${
          foundInScale.note
        }`
        chord.push(foundInScale)
      }
    } else {
      console.log('TODO')
    }
  }
  return chord
}
