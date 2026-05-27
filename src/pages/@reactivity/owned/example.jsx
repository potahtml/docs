import { owned, render, signal } from 'pota'

function App() {
  const status = signal('idle')

  function startSlowWork() {
    status.write('working…')
    const finish = owned(() => status.write('done'))
    setTimeout(finish, 2000)
  }

  return (
    <div>
      <p>status: {status.read}</p>
      <button on:click={startSlowWork}>start</button>
    </div>
  )
}

render(App)
