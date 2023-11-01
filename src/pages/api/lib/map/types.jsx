import { render, map } from 'pota'

render(() => (
  <>
    {map([1, 2, 3, 4, 5], item => {
      render(<li>added {item}</li>)
      return item
    })}
  </>
))
render(() => (
  <>
    {map(new Set([6, 7, 8, 9, 10]), item => {
      render(<li>added {item}</li>)
      return item
    })}
  </>
))

render(() => (
  <>
    {map(new Map().set(11, 11).set(12, 12).set(13, 13), item => {
      render(<li>added {item}</li>)
      return item
    })}
  </>
))
