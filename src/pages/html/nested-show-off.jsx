import { render, signal, HTML, Show } from 'pota'

const html = HTML()

function Counter() {
  const [show, setShow] = signal(false)
  const [show2, setShow2] = signal(false)
  const [show3, setShow3] = signal(0)

  setInterval(() => setShow(value => !value), 4000)
  setInterval(() => setShow2(value => !value), 2000)
  setInterval(() => setShow3(value => value + 1), 100)

  return [
    // displays `asd`
    html`
      0
      <Show when="${show}">
        1
        <Show when="${show2}">
          2
          <p>3</p>
          4
          <b><Show when="${show3}">${value => value}</Show></b>
        </Show>
        5 ${Date.now()} ${() => Date.now()}
      </Show>
      6
    `,
  ]
}

render(Counter)
