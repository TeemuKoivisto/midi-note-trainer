import { intervalFromInteger } from './intervals'

import chords from './chords.json'

import type { Chord, ChordType } from './types'

// https://en.wikipedia.org/wiki/List_of_chords
// https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns
let chordArray: Chord[] = []

export function chordsFromJSON(): Chord[] {
  return chords.map(val => {
    const intervals = (val[3] as number[]).map(intervalFromInteger)
    return {
      suffixes: val[0] as string[],
      name: val[1][0] as string,
      type: val[2] as ChordType,
      intervals
    }
  })
}

export function findChord(searched: string): Chord | undefined {
  if (chordArray.length === 0) {
    chordArray = chordsFromJSON()
  }
  const str = searched.replaceAll(/-|\s/g, '').toLowerCase().trim()
  return chordArray.find(
    c =>
      c.suffixes.find(x => x === str) || c.name.replaceAll(/-|\s/g, '').trim().toLowerCase() === str
  )
}
