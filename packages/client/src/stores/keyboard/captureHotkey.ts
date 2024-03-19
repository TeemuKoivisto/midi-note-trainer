interface Cancel {
  e: 'hotkeys-cancel'
}
interface CapturedKey {
  e: 'hotkeys-captured-key'
  data: {
    code: string
    key: string
  }
}
interface NoValidKey {
  e: 'hotkeys-no-key'
}
export type ParsedHotkey = Cancel | CapturedKey | NoValidKey

export function captureHotkey(
  captured: Set<string>,
  code: string,
  key: string
): Cancel | CapturedKey | NoValidKey {
  if (code === 'Escape') {
    return { e: 'hotkeys-cancel' }
  } else if (code === 'Space') {
    return { e: 'hotkeys-captured-key', data: { code: 'EMPTY', key: '{empty}' } }
  } else if (!captured.has(code)) {
    captured.add(code)
    return { e: 'hotkeys-captured-key', data: { code, key } }
  } else {
    return { e: 'hotkeys-no-key' }
  }
}
