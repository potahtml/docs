import { action, render, signal } from 'pota'
import { Errored } from 'pota/components'

function Form() {
  const [email, setEmail] = signal('')
  const [status, setStatus] = signal('idle')

  const submit = action(
    () => email(),
    value => {
      if (!value.includes('@')) throw new Error('invalid email')
      return fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: value }),
      })
    },
    res => res.json(),
    result => setStatus(`subscribed: ${result.id}`),
  )

  return (
    <form on:submit={e => (e.preventDefault(), submit())}>
      <input
        prop:value={email}
        on:input={e => setEmail(e.currentTarget.value)}
      />
      <button>subscribe</button>
      <p>{status}</p>
    </form>
  )
}

function App() {
  return (
    <Errored
      fallback={(err, reset) => (
        <div>
          <p>oops: {err.message}</p>
          <button on:click={reset}>try again</button>
        </div>
      )}
    >
      <Form />
    </Errored>
  )
}

render(App)
