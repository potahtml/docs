import { addEventListener, propsPlugin, render } from 'pota'

// when `useClickOutside` is found on a JSX element

propsPlugin('useClickOutside', (node, propName, propValue, props) => {
  addEventListener(
    document,
    'pointerdown',
    event => {
      if (!node.contains(event.target)) {
        propValue(event, node)
      }
    },
    false,
  )
})

// using our newly defined prop. It can be used anywhere

function App() {
  return (
    <span
      useClickOutside={event =>
        render(<div>you clicked outside!</div>)
      }
    >
      clicking outside this span will run the custom prop
    </span>
  )
}

render(App)
