import { version } from '$app/environment'

const getEnv = (env: string | undefined) => {
  if (!env) {
    throw new Error('Undefined environment variable!')
  }
  return env
}

const parseInteger = (str?: string) => {
  try {
    return parseInt(str || '')
  } catch (err) {}
  return undefined
}

const buildTime = parseInteger(version)

export const DEV = import.meta.env.DEV
export const GH_BASE_URL = import.meta.env.VITE_DEPLOY_TO_GH ? '/midi-note-trainer/' : '/'
// More about SvelteKit's default env variables https://vitejs.dev/guide/env-and-mode.html

export const SITE_METADATA = {
  url: 'https://midi-note-trainer.teemukoivisto.xyz',
  title: 'MIDI Note Trainer',
  description: 'Practise music notation, scales and chords using MIDI directly from browser.',
  image: {
    url: 'https://midi-note-trainer.teemukoivisto.xyz/cover_image_1080.jpg',
    width: 1080,
    height: 566,
    alt: 'MIDI Note Trainer frontpage UI'
  },
  tags: [
    'music',
    'midi',
    'trainer',
    'learn',
    'sheet music',
    'notation',
    'notes',
    'scales',
    'chords'
  ],
  datePublished: '2024-04-02T12:01:30.978Z',
  dateModified: buildTime ? new Date(buildTime).toISOString() : null,
  author: {
    name: 'Teemu Koivisto'
  }
}
