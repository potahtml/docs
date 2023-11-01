import { render, signal, map, cleanup } from 'pota'

const [array, setArray] = signal([1, 2, 3, 4, 5])

let id = 6

setInterval(() => {
  if (array().length > 6) return

  setArray(array => {
    array.push(id++)
    return [...array]
  })
}, 500)

setInterval(() => {
  if (array().length > 6 || array().length < 2) return

  setArray(array => {
    array.shift()
    return [...array]
  })
}, 600)

render(() => (
  <>
    {map(array, item => {
      cleanup(() => {
        console.log('removed', item)
      })
      render(
        <li>
          added {item}
          <br />
          array: {JSON.stringify(array())}
          <hr />
        </li>,
      )
      return item
    })}
  </>
))
