import type { Result } from '@/types'

export async function load(url: string, context: AudioContext): Promise<Result<AudioBuffer>> {
  const resp = await fetch(url)
  if (!resp.ok) {
    return { err: resp.statusText, code: resp.status }
  }
  const buf = await resp.arrayBuffer()
  const audio = await context.decodeAudioData(buf)
  return { data: audio }
}
