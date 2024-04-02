const getEnv = (env: string | undefined) => {
  if (!env) {
    throw new Error('Undefined environment variable!')
  }
  return env
}

export const DEV = import.meta.env.DEV
export const GH_BASE_URL = import.meta.env.VITE_DEPLOY_TO_GH ? '/midi-note-trainer/' : '/'
// More about SvelteKit's default env variables https://vitejs.dev/guide/env-and-mode.html

export const SITE_METADATA = {
  url: 'https://midi-note-trainer.teemukoivisto.xyz',
  title: 'MIDI Note Trainer',
  description: 'Practise music notation, scales and chords using MIDI directly from browser.',
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
  dateModified: new Date().toISOString(),
  author: {
    name: 'Teemu Koivisto'
  }
}
