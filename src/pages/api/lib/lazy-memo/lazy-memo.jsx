import { render, memo, lazyMemo } from 'pota'

const regularComponent = memo(() => {
  render(<span> Regular Memo rendered!</span>)

  return ''
})

const lazyComponent = lazyMemo(() => {
  render(<span> Lazy Memo rendered!</span>)

  return ''
})

setTimeout(lazyComponent, 6_000)
setTimeout(regularComponent, 6_000)
