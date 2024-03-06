import { Layout, LayoutImport } from './types'

import { LayoutItem } from 'simple-keyboard-layouts/build/interfaces'

const layouts = {
  ar: { name: 'arabic', import: import('simple-keyboard-layouts/build/layouts/arabic') },
  hye: {
    name: 'armenianEastern',
    import: import('simple-keyboard-layouts/build/layouts/armenianEastern')
  },
  hyw: {
    name: 'armenianWestern',
    import: import('simple-keyboard-layouts/build/layouts/armenianWestern')
  },
  as: { name: 'assamese', import: import('simple-keyboard-layouts/build/layouts/assamese') },
  ba: { name: 'balochi', import: import('simple-keyboard-layouts/build/layouts/balochi') },
  be: { name: 'belarusian', import: import('simple-keyboard-layouts/build/layouts/belarusian') },
  bn: { name: 'bengali', import: import('simple-keyboard-layouts/build/layouts/bengali') },
  pt: { name: 'brazilian', import: import('simple-keyboard-layouts/build/layouts/brazilian') },
  my: { name: 'burmese', import: import('simple-keyboard-layouts/build/layouts/burmese') },
  zh: { name: 'chinese', import: import('simple-keyboard-layouts/build/layouts/chinese') },
  cs: { name: 'czech', import: import('simple-keyboard-layouts/build/layouts/czech') },
  en: { name: 'english', import: import('simple-keyboard-layouts/build/layouts/english') },
  fa: { name: 'farsi', import: import('simple-keyboard-layouts/build/layouts/farsi') },
  fr: { name: 'french', import: import('simple-keyboard-layouts/build/layouts/french') },
  ka: { name: 'georgian', import: import('simple-keyboard-layouts/build/layouts/georgian') },
  de: { name: 'german', import: import('simple-keyboard-layouts/build/layouts/german') },
  gi: { name: 'gilaki', import: import('simple-keyboard-layouts/build/layouts/gilaki') },
  el: { name: 'greek', import: import('simple-keyboard-layouts/build/layouts/greek') },
  he: { name: 'hebrew', import: import('simple-keyboard-layouts/build/layouts/hebrew') },
  hi: { name: 'hindi', import: import('simple-keyboard-layouts/build/layouts/hindi') },
  hu: { name: 'hungarian', import: import('simple-keyboard-layouts/build/layouts/hungarian') },
  it: { name: 'italian', import: import('simple-keyboard-layouts/build/layouts/italian') },
  ja: { name: 'japanese', import: import('simple-keyboard-layouts/build/layouts/japanese') },
  kn: { name: 'kannada', import: import('simple-keyboard-layouts/build/layouts/kannada') },
  ku: { name: 'kurdish', import: import('simple-keyboard-layouts/build/layouts/kurdish') },
  mk: { name: 'macedonian', import: import('simple-keyboard-layouts/build/layouts/macedonian') },
  ml: { name: 'malayalam', import: import('simple-keyboard-layouts/build/layouts/malayalam') },
  yo: { name: 'nigerian', import: import('simple-keyboard-layouts/build/layouts/nigerian') },
  nk: { name: 'nko', import: import('simple-keyboard-layouts/build/layouts/nko') },
  no: { name: 'norwegian', import: import('simple-keyboard-layouts/build/layouts/norwegian') },
  od: { name: 'odia', import: import('simple-keyboard-layouts/build/layouts/odia') },
  pl: { name: 'polish', import: import('simple-keyboard-layouts/build/layouts/polish') },
  pa: { name: 'punjabi', import: import('simple-keyboard-layouts/build/layouts/punjabi') },
  ru: { name: 'russian', import: import('simple-keyboard-layouts/build/layouts/russian') },
  ru2: { name: 'russianOld', import: import('simple-keyboard-layouts/build/layouts/russianOld') },
  sd: { name: 'sindhi', import: import('simple-keyboard-layouts/build/layouts/sindhi') },
  es: { name: 'spanish', import: import('simple-keyboard-layouts/build/layouts/spanish') },
  sv: { name: 'swedish', import: import('simple-keyboard-layouts/build/layouts/swedish') },
  te: { name: 'telugu', import: import('simple-keyboard-layouts/build/layouts/telugu') },
  th: { name: 'thai', import: import('simple-keyboard-layouts/build/layouts/thai') },
  tr: { name: 'turkish', import: import('simple-keyboard-layouts/build/layouts/turkish') },
  uk: { name: 'ukrainian', import: import('simple-keyboard-layouts/build/layouts/ukrainian') },
  ur: { name: 'urdu', import: import('simple-keyboard-layouts/build/layouts/urdu') },
  ur2: {
    name: 'urduStandard',
    import: import('simple-keyboard-layouts/build/layouts/urduStandard')
  },
  ug: { name: 'uyghur', import: import('simple-keyboard-layouts/build/layouts/uyghur') }
}

// https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
export const languageCodes = {
  ar: 'arabic',
  hye: 'armenianEastern',
  hyw: 'armenianWestern',
  as: 'assamese',
  balochi: 'balochi',
  be: 'belarusian',
  bn: 'bengali',
  pt: 'brazilian',
  my: 'burmese',
  zh: 'chinese',
  cs: 'czech',
  en: 'english',
  fa: 'farsi',
  fr: 'french',
  ka: 'georgian',
  de: 'german',
  gilaki: 'gilaki',
  el: 'greek',
  he: 'hebrew',
  hi: 'hindi',
  hu: 'hungarian',
  it: 'italian',
  ja: 'japanese',
  kn: 'kannada',
  ku: 'kurdish',
  mk: 'macedonian',
  ml: 'malayalam',
  yo: 'nigerian',
  nko: 'nko',
  no: 'norwegian',
  odia: 'odia',
  pl: 'polish',
  pa: 'punjabi',
  ru: 'russian',
  ru2: 'russianOld',
  sd: 'sindhi',
  es: 'spanish',
  sv: 'swedish',
  te: 'telugu',
  th: 'thai',
  tr: 'turkish',
  uk: 'ukrainian',
  ur: 'urdu',
  ur2: 'urduStandard',
  ug: 'uyghur'
}

function formatName(name: string) {
  return name
    .split(/^[A-Z]?$/)
    .map((s, idx) => (idx === 0 ? s[0].toUpperCase() + s.slice(1) : s))
    .join(' ')
}

export function parseLayout(value: LayoutItem): LayoutImport {
  if (!('default' in value.layout) || !('shift' in value.layout)) {
    console.error(value)
    throw Error('Invalid layout import')
  }
  return {
    default: value.layout.default as [string, string, string, string, string],
    shift: value.layout.shift as [string, string, string, string, string]
  }
}

export async function importLayout(
  navigatorLanguages = ['en'] as readonly string[]
): Promise<Layout> {
  let bestMatch: { code: string; lang: string; index: number } = {
    lang: 'english',
    code: 'en',
    index: 99
  }
  Object.entries(languageCodes).forEach(([code, lang]) => {
    for (let i = 0; i < navigatorLanguages.length; i += 1) {
      if (code === navigatorLanguages[i] && (!bestMatch || bestMatch.index > i)) {
        bestMatch = { code, lang, index: i }
      }
    }
  })
  const layout = layouts[bestMatch.code as keyof typeof layouts]
  const imported = await layout.import
  return {
    code: bestMatch.code,
    name: formatName(layout.name),
    imported: parseLayout(imported.default as LayoutItem)
  }
}
