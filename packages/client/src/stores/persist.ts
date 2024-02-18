import type { Writable } from 'svelte/store'
import type { Result } from '@/types'

interface Options<T, P> {
  key: string
  storage?: 'local' | 'session'
  debug?: boolean
  serialize?: (val: T) => P
  deserialize?: (val: P) => T
}

function hydrate(key: string, storage: 'local' | 'session'): Result<any> {
  try {
    const store = storage === 'local' ? window.localStorage : window.sessionStorage
    return { data: JSON.parse(store.getItem(key) || '') }
  } catch (err) {
    return { err: `Failed to retrieve value from storage: ${err}`, code: 400 }
  }
}

function cache(val: any, key: string, storage: 'local' | 'session'): Result<undefined> {
  try {
    const store = storage === 'local' ? window.localStorage : window.sessionStorage
    store.setItem(key, JSON.stringify(val))
    return { data: undefined }
  } catch (err) {
    return { err: `Failed to store the value: ${err}`, code: 400 }
  }
}

// https://github.com/joshnuss/svelte-local-storage-store
export function persist<T, P = any>(w: Writable<T>, opts: Options<T, P>) {
  const { key, storage = 'local' } = opts
  const hydrated = hydrate(key, storage)
  if ('data' in hydrated) {
    w.set(opts.deserialize ? opts.deserialize(hydrated.data) : hydrated.data)
  } else if ('err' in hydrated && opts?.debug) {
    console.info(hydrated.err)
  }
  w.subscribe(val => {
    const cached = cache(opts.serialize ? opts.serialize(val) : val, key, storage)
    if ('err' in cached && opts?.debug) {
      console.error(cached.err)
    }
  })
  return w
}
