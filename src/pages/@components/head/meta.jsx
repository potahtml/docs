import { render, signal } from 'pota'
import { Head } from 'pota/components'

function App() {
  const [page, setPage] = signal('home')

  return (
    <div>
      <Head>
        <title>{() => `${page()} — my site`}</title>
        <meta
          name="description"
          content={() => `Page: ${page()}`}
        />
      </Head>
      <button on:click={() => setPage('home')}>home</button>
      <button on:click={() => setPage('about')}>about</button>
    </div>
  )
}

render(App)
