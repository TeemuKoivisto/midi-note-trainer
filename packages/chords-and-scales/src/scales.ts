import { createScaleTrichords } from './createScaleTrichords'
import { intervalFromInteger } from './intervals'

import scales from './scales.json'

import type { RawScale } from './types'

// https://github.com/Zachacious/MusicTheoryJS/blob/65572a7bf58e0485f250bd92748fdd1e975f4a90/src/scale/scaleTemplates.ts
// https://en.wikipedia.org/wiki/List_of_musical_scales_and_modes
// https://plucknplay.github.io/en/scale-list.html
// https://www.jazz-guitar-licks.com/pages/guitar-scales-modes/
// https://www.omnicalculator.com/other/music-scale
let scalesArray: RawScale[] = []

export function scalesFromJSON(): RawScale[] {
  return scales.map(val => {
    const names = val[0] as string[]
    const intervals = (val[1] as number[]).map(intervalFromInteger)
    const trichords = createScaleTrichords(intervals)
    return {
      names,
      intervals,
      trichords
    }
  })
}

export function findScale(scaleName: string): RawScale | undefined {
  if (scalesArray.length === 0) {
    scalesArray = scalesFromJSON()
  }
  const name = scaleName.replaceAll(/-|\s/g, '').toLowerCase().trim()
  return scalesArray.find(scl =>
    scl.names.find(n => n.replaceAll(/-|\s/g, '').trim().toLowerCase() === name)
  )
}
