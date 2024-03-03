import { derived, get, readable, writable } from 'svelte/store'

import { Keyboard } from '@/keyboard'

import { scaleData } from './score'
import { persist } from './persist'

interface Inputs {
  focused: boolean
  layout: 'middle-row' | 'two-rows'
}

// For determining whether to play notes unless text input has been already captured
export const keyboardFocused = writable<boolean>(true)
export const keyboardOptions = persist(
  writable<Inputs>({
    focused: false,
    layout: 'middle-row'
  }),
  {
    key: 'keyboard-options'
  }
)
export const keyboard = derived([scaleData, keyboardOptions], ([scl, opts]) => {
  const kbd = new Keyboard(opts)
  kbd.setNotes(scl.notesMap)
  return kbd
})
export const keys = derived(keyboard, kbd =>
  kbd.rows.map(r =>
    r.map((c, idx) => {
      let size
      if (c.key === '{bksp}') {
        size = 2
      } else if (c.key === '{tab}') {
        size = 1.5
      } else if (c.key === '{enter}') {
        size = 2
      } else if (c.key === '{lock}') {
        size = 1.75
      } else if (c.key === '{shift}' && idx === 0) {
        size = 1.5
      } else if (c.key === '{shift}') {
        size = 2.5
      }
      if (size) {
        return { ...c, size }
      }
      return c
    })
  )
)

export const keyboardActions = {
  setKeyboardFocus(val: boolean) {
    keyboardFocused.set(val)
  }
}
