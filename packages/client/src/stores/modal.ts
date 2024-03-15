import { get, writable } from 'svelte/store'

export interface ModalParams {
  introduction: undefined
}

const defaultParams = {
  introduction: undefined
}

export const modals = writable<ModalParams>(defaultParams)
export const openModal = writable<keyof ModalParams | null>(null)

type ModalArgs = { [K in keyof ModalParams]: [name: K, params: ModalParams[K]] }[keyof ModalParams]

export const modalActions = {
  open(...[name, params]: ModalArgs) {
    openModal.set(name)
    modals.update(m => ({ ...m, [name]: params }))
    console.log('open ', name)
  },
  close() {
    openModal.set(null)
  },
  toggle(modal: keyof ModalParams) {
    const opened = get(openModal)
    if (!opened || (opened && opened !== modal)) {
      openModal.set(modal)
    } else {
      openModal.set(null)
    }
  }
}
