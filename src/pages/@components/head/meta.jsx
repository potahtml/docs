import { render, signal } from 'pota'
import { Head } from 'pota/components'

function App() {
  const page = signal('home')

  return (
    <div>
      <Head>
        <title>{() => `${page.read()} — my site`}</title>
        <meta
          name="description"
          content={() => `Page: ${page.read()}`}
        />
      </Head>
      <button on:click={() => page.write('home')}>home</button>
      <button on:click={() => page.write('about')}>about</button>
    </div>
  )
}

render(App)
