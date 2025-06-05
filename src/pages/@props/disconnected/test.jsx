import { render } from 'pota'

function Component() {
  return (
    <main
      disconnected={node =>
        render('Element on Component is about to unmount')
      }
    >
      Content
    </main>
  )
}

const dispose = render(Component)

dispose()
