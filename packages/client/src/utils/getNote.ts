import type { MidiNote } from '@/chords-and-scales'
import type { Note } from '@/types'

export function getOctave(midi: number) {
  return midi === 12 ? 1 : Math.floor((midi - 12) / 12)
}

export function getNoteAbsolute(note: Note | MidiNote) {
  return `${note.note}${getOctave(note.midi)}`
}

export function addParts(note: MidiNote): Note {
  return {
    ...note,
    parts: [
      note.note.charAt(0),
      `${'b'.repeat(note.flats)}${'#'.repeat(note.sharps)}`,
      getOctave(note.midi)
    ]
  }
}
