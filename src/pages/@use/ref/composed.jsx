import { ready, render } from 'pota'
import { clickOutside } from 'pota/use/clickoutside'
import { preventEnter } from 'pota/use/form'

const autoFocus = node => ready(() => node.focus())

const logMount = label => node => {
  console.log(label, 'attached', node)
}

function App() {
  return (
    <input
      use:ref={[
        autoFocus,
        preventEnter,
        clickOutside(() => console.log('clicked outside')),
        logMount('input'),
      ]}
      placeholder="type here"
    />
  )
}

render(App)
