import {
  addEventListener,
  propsPlugin,
  propsPluginNS,
  render,
} from 'pota'

// when `useClickOutside` is found on an element

propsPlugin('useClickOutside', (node, propName, propValue, props) => {
  // node = the element
  // propName = 'useClickOutside'
  // propValue = fn
  // props = props object
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

propsPluginNS(
  'useFancy',
  (node, propName, propValue, props, localName, ns) => {
    // node = the element
    // propName = 'useFancy:click'
    // propValue = fn
    // props = props object
    // localName = 'click'
    // ns = 'useFancy'

    addEventListener(node, localName, propValue, false)
  },
)

// using our newly defined prop. It can be used anywhere

function App() {
  return (
    <span
      useClickOutside={event =>
        render(<div>you clicked outside!</div>)
      }
      useFancy:click={event =>
        render(<div>this click is very fancy!</div>)
      }
    >
      clicking outside this span will run the custom prop
    </span>
  )
}

render(App)
