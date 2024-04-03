import { Layout, LayoutImport } from './types'

import { LayoutItem } from 'simple-keyboard-layouts/build/interfaces'

// https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
export const LAYOUTS = {
  ar: { name: 'Arabic', import: import('simple-keyboard-layouts/build/layouts/arabic') },
  hye: {
    name: 'Armenian Eastern',
    import: import('simple-keyboard-layouts/build/layouts/armenianEastern')
  },
  hyw: {
    name: 'Armenian Western',
    import: import('simple-keyboard-layouts/build/layouts/armenianWestern')
  },
  be: { name: 'Belarusian', import: import('simple-keyboard-layouts/build/layouts/belarusian') },
  bn: { name: 'Bengali', import: import('simple-keyboard-layouts/build/layouts/bengali') },
  pt: { name: 'Brazilian', import: import('simple-keyboard-layouts/build/layouts/brazilian') },
  my: { name: 'Burmese', import: import('simple-keyboard-layouts/build/layouts/burmese') },
  zh: { name: 'Chinese', import: import('simple-keyboard-layouts/build/layouts/chinese') },
  cs: { name: 'Czech', import: import('simple-keyboard-layouts/build/layouts/czech') },
  en: { name: 'English', import: import('simple-keyboard-layouts/build/layouts/english') },
  fa: { name: 'Farsi', import: import('simple-keyboard-layouts/build/layouts/farsi') },
  fi: { name: 'Finnish', import: import('simple-keyboard-layouts/build/layouts/swedish') },
  fr: { name: 'French', import: import('simple-keyboard-layouts/build/layouts/french') },
  ka: { name: 'Georgian', import: import('simple-keyboard-layouts/build/layouts/georgian') },
  de: { name: 'German', import: import('simple-keyboard-layouts/build/layouts/german') },
  el: { name: 'Greek', import: import('simple-keyboard-layouts/build/layouts/greek') },
  he: { name: 'Hebrew', import: import('simple-keyboard-layouts/build/layouts/hebrew') },
  hi: { name: 'Hindi', import: import('simple-keyboard-layouts/build/layouts/hindi') },
  hu: { name: 'Hungarian', import: import('simple-keyboard-layouts/build/layouts/hungarian') },
  it: { name: 'Italian', import: import('simple-keyboard-layouts/build/layouts/italian') },
  ja: { name: 'Japanese', import: import('simple-keyboard-layouts/build/layouts/japanese') },
  mk: { name: 'Macedonian', import: import('simple-keyboard-layouts/build/layouts/macedonian') },
  yo: { name: 'Nigerian', import: import('simple-keyboard-layouts/build/layouts/nigerian') },
  nko: { name: 'Nko', import: import('simple-keyboard-layouts/build/layouts/nko') },
  no: { name: 'Norwegian', import: import('simple-keyboard-layouts/build/layouts/norwegian') },
  pl: { name: 'Polish', import: import('simple-keyboard-layouts/build/layouts/polish') },
  pa: { name: 'Punjabi', import: import('simple-keyboard-layouts/build/layouts/punjabi') },
  ru: { name: 'Russian', import: import('simple-keyboard-layouts/build/layouts/russian') },
  es: { name: 'Spanish', import: import('simple-keyboard-layouts/build/layouts/spanish') },
  sv: { name: 'Swedish', import: import('simple-keyboard-layouts/build/layouts/swedish') },
  te: { name: 'Telugu', import: import('simple-keyboard-layouts/build/layouts/telugu') },
  th: { name: 'Thai', import: import('simple-keyboard-layouts/build/layouts/thai') },
  tr: { name: 'Turkish', import: import('simple-keyboard-layouts/build/layouts/turkish') },
  uk: { name: 'Ukrainian', import: import('simple-keyboard-layouts/build/layouts/ukrainian') },
  ug: { name: 'Uyghur', import: import('simple-keyboard-layouts/build/layouts/uyghur') }
}

export function parseLayout(value: LayoutItem): LayoutImport {
  if (!('default' in value.layout) || !('shift' in value.layout)) {
    console.error(value)
    throw Error('Invalid layout import')
  }
  return {
    default: value.layout.default.slice(0, 4) as [string, string, string, string]
  }
}

export async function importLayout(
  navigatorLanguages = ['en'] as readonly string[]
): Promise<Layout> {
  let bestMatch: { code: string; layout: { name: string; import: Promise<any> }; index: number } = {
    code: 'en',
    layout: LAYOUTS['en'],
    index: 99
  }
  // In Safari navigator languages are in form ["fi-FI"] only
  const normalized = navigatorLanguages.map(l => l.split('-')[0])
  Object.entries(LAYOUTS).forEach(([code, layout]) => {
    for (let i = 0; i < normalized.length; i += 1) {
      if (code === normalized[i] && (!bestMatch || bestMatch.index > i)) {
        bestMatch = { code, layout, index: i }
      }
    }
  })
  const imported = await bestMatch.layout.import
  return {
    code: bestMatch.code,
    name: bestMatch.layout.name,
    imported: parseLayout(imported.default as LayoutItem)
  }
}
