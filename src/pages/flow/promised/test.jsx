import { render, Promised } from 'pota'

function App() {
  return (
    <main>
      <Promised fallback="Loading">
        {() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => resolve('something'), 5000)
          })
        }}
      </Promised>
    </main>
  )
}

render(App)
