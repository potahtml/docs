import { render, signal, map, cleanup } from 'pota'

const array = signal([1, 2, 3, 4, 5])

let id = 6

setInterval(() => {
  if (array.read().length > 6) return

  array.update(array => {
    array.push(id++)
    return [...array]
  })
}, 500)

setInterval(() => {
  if (array.read().length > 6 || array.read().length < 2) return

  array.update(array => {
    array.shift()
    return [...array]
  })
}, 600)

render(() => (
  <>
    {map(array.read, item => {
      cleanup(() => {
        console.log('removed', item)
      })
      render(
        <li>
          added {item}
          <br />
          array: {JSON.stringify(array.read())}
          <hr />
        </li>,
      )
      return item
    })}
  </>
))
