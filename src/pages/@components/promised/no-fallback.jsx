import { render } from 'pota'

function App() {
  return (
    <main>
      1 -{' '}
      {
        new Promise((resolve, reject) => {
          setTimeout(
            () =>
              resolve('Loaded Promise that doesnt use a fallback'),
            3000,
          )
        })
      }{' '}
      - 2
    </main>
  )
}

render(App)
