import { render, Promised } from 'pota'

function App() {
  return (
    <main>
      <Promised fallback="Loading">
        {() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => resolve('Loaded'), 3000)
          })
        }}
      </Promised>
    </main>
  )
}

render(App)
