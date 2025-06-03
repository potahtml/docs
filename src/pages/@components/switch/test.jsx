import { signal, render } from 'pota'
import { Switch, Match } from 'pota/components'

function Example() {
  const [read, write] = signal(false)
  setInterval(() => write(!read()), 1_000)

  return (
    <Switch fallback="Nothing got rendered!">
      <Match when={0}>0</Match>
      <Match when={undefined}>undefined</Match>
      <Match when={false}>false</Match>
      <Match when={read}>test 1</Match>
      <Match when={read}>test 2</Match>
      <Match when={true}>true one</Match>
    </Switch>
  )
}

render(Example)

render(<hr />)

function Example2() {
  const [read, write] = signal(false)
  setInterval(() => write(!read()), 1_000)

  return (
    <Switch fallback="Nope!">
      <Match when={read}>yes 1</Match>
      <Match when={read}>yes 2</Match>
    </Switch>
  )
}

render(Example2)
render(<hr />)

function Example3() {
  const [read, write] = signal(false)
  setInterval(() => write(!read()), 1_000)

  return (
    <Switch fallback="Nope!">
      <Match when={read}>{item => item}</Match>
      <Match when={read}>yes 2</Match>
    </Switch>
  )
}

render(Example3)
render(<hr />)

function Example4() {
  const [read, write] = signal(false)
  setInterval(() => write(Math.random()), 500)

  return (
    <>
      {read}
      <br />

      <Switch fallback="bellow .3!">
        <Match when={() => read() > 0.5}>
          {item => item} {read} above .5
        </Match>
        <Match when={() => read() > 0.3}>
          {item => item} {read} above .3
        </Match>
      </Switch>
    </>
  )
}

render(Example4)
render(<hr />)
