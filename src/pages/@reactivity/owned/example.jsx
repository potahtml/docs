import { owned, render, signal } from 'pota'

function App() {
  const [status, setStatus] = signal('idle')

  function startSlowWork() {
    setStatus('working…')
    const finish = owned(() => setStatus('done'))
    setTimeout(finish, 2000)
  }

  return (
    <div>
      <p>status: {status}</p>
      <button on:click={startSlowWork}>start</button>
    </div>
  )
}

render(App)
