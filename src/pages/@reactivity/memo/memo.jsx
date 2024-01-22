import { render, memo } from 'pota'

const test = memo(() => {
  render(<span> Memo rendered!</span>)
})

setTimeout(test, 6_000)
