import { render } from 'pota'

function App() {
  return (
    <main>
      <p>Before the promise</p>
      <p>
        {
          new Promise((resolve, reject) => {
            setTimeout(() => resolve('Promise loaded'), 3000)
          })
        }
      </p>
      <p>After the promise</p>
    </main>
  )
}

render(App)
