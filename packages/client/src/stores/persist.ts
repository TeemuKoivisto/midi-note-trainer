import { get, type Writable } from 'svelte/store'
import type { Result } from '@/types'

interface Options<T, P> {
  /** Key by which the data is persisted */
  key: string
  /** local or sessionStorage */
  storage?: 'local' | 'session'
  /** For more granular erasure of data than storage.clear(). If unspecified, 'default' is used */
  namespace?: string
  /** To print errors and warnings */
  debug?: boolean
  serialize?: (val: T) => P
  deserialize?: (val: P) => T
}

interface Registered {
  key: string
  storage: 'local' | 'session'
  defaultValue: any
  value: Writable<any>
  unsubscribe: () => void
}

const registered = new Map<string, Registered[]>()

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
  const { key, storage = 'local', namespace = 'default' } = opts
  const hydrated = hydrate(key, storage)
  const defaultValue = get(w)
  if ('data' in hydrated) {
    w.set(opts.deserialize ? opts.deserialize(hydrated.data) : hydrated.data)
  } else if ('err' in hydrated && opts?.debug) {
    console.info(hydrated.err)
  }
  const unsubscribe = w.subscribe(val => {
    const cached = cache(opts.serialize ? opts.serialize(val) : val, key, storage)
    if ('err' in cached && opts?.debug) {
      console.error(cached.err)
    }
  })
  const ns = registered.get(namespace)
  if (ns) {
    ns.push({ key, storage, value: w, defaultValue, unsubscribe: unsubscribe })
  } else {
    registered.set(namespace, [{ key, storage, value: w, defaultValue, unsubscribe }])
  }
  return w
}

interface ResetOptions {
  unsubscribe?: boolean
  cb?: (val: Registered) => void
}

export function reset(namespaces: string[] = ['default'], opts?: ResetOptions) {
  namespaces.forEach(ns => {
    registered.get(ns)?.forEach(persisted => {
      if (opts?.cb) {
        opts?.cb(persisted)
      } else {
        try {
          if (opts?.unsubscribe) {
            persisted.unsubscribe()
          }
          persisted.value.set(persisted.defaultValue)
          const store = persisted.storage === 'local' ? window.localStorage : window.sessionStorage
          store.removeItem(persisted.key)
        } catch (err) {}
      }
    })
  })
}
