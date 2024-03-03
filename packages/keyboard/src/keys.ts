import en from './layouts/english'

// https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
const languageCodes = {
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
  ko: 'korean',
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

export function importLayout(navigatorLanguages = ['en'] as readonly string[]) {
  let bestMatch: { lang: string; index: number } = { lang: 'english', index: 99 }
  Object.entries(languageCodes).forEach(([code, lang]) => {
    for (let i = 0; i < navigatorLanguages.length; i += 1) {
      if (code === navigatorLanguages[i] && (!bestMatch || bestMatch.index > i)) {
        bestMatch = { lang, index: i }
      }
    }
  })
  return en
}
