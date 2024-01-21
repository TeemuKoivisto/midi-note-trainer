export class BufferLoader {
  context: AudioContext
  urlList: string[]
  onload: (bufferList: AudioBuffer[]) => void
  bufferList: AudioBuffer[] = []
  loadCount = 0

  constructor(
    contexts: AudioContext,
    urlList: string[],
    callback: (bufferList: AudioBuffer[]) => void
  ) {
    this.context = contexts
    this.urlList = urlList
    this.onload = callback
  }

  loadBuffer(url: string, index: number) {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'
    const loader = this
    request.onload = function () {
      loader.context.decodeAudioData(request.response, function (buffer) {
        if (!buffer) {
          console.error('error decoding file data: ' + url)
          return
        }
        loader.bufferList[index] = buffer
        if (++loader.loadCount == loader.urlList.length) loader.onload(loader.bufferList)
      })
    }
    request.onerror = function () {
      console.error('BufferLoader: XHR error')
    }
    request.send()
  }

  load() {
    for (let i = 0; i < this.urlList.length; ++i) this.loadBuffer(this.urlList[i], i)
  }
}
