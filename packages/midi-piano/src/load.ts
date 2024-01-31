import type { Result } from './types'

export async function load(url: string, context: AudioContext): Promise<Result<AudioBuffer>> {
  const resp = await fetch(url)
  if (!resp.ok) {
    return { err: resp.statusText, code: resp.status }
  }
  const buf = await resp.arrayBuffer()
  const audio = await context.decodeAudioData(buf)
  return { data: audio }
}

export async function fetchSounds(path: string, context: AudioContext) {
  const urls = [
    '/a0.mp3',
    '/a1.mp3',
    '/a2.mp3',
    '/a3.mp3',
    '/a4.mp3',
    '/a5.mp3',
    '/a6.mp3',
    '/a7.mp3',
    '/damper.mp3',
    '/Piano Impulse6.mp3'
  ]
  const loaded = await Promise.all(urls.map(url => load(`${path}${url}`, context)))
  const result: AudioBuffer[] = []
  loaded.forEach(f => {
    if ('err' in f) {
      console.error(`Failed to load audio: ${f.err}`)
    } else {
      result.push(f.data)
    }
  })
  return result
}
