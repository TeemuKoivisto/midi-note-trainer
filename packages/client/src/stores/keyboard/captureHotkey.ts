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
interface SkipKey {
  e: 'hotkeys-skip-key'
}
interface NoValidKey {
  e: 'hotkeys-no-key'
}
export type ParsedHotkey = Cancel | CapturedKey | SkipKey | NoValidKey

export function captureHotkey(captured: Set<string>, code: string, key: string): ParsedHotkey {
  if (code === 'Escape') {
    return { e: 'hotkeys-cancel' }
  } else if (code === 'Space') {
    return { e: 'hotkeys-skip-key' }
  } else if (!captured.has(code)) {
    captured.add(code)
    return { e: 'hotkeys-captured-key', data: { code, key } }
  } else {
    return { e: 'hotkeys-no-key' }
  }
}
