import { render } from 'pota'
import { Head } from 'pota/web'

function Component() {
  return (
    <Head>
      <title>The new Tab title</title>
      <meta
        name="description"
        content="the new meta description"
      />
    </Head>
  )
}

render(Component)
