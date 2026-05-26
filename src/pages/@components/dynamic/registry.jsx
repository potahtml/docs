import { render, signal } from 'pota'
import { Dynamic, For } from 'pota/components'

const Heading = props => <h2>{props.text}</h2>
const Paragraph = props => <p>{props.text}</p>
const Quote = props => (
  <blockquote>
    <p>{props.text}</p>
    <footer>— {props.author}</footer>
  </blockquote>
)

const blockTypes = { Heading, Paragraph, Quote }

function App() {
  const [blocks] = signal([
    { type: 'Heading', text: 'Pota in production' },
    { type: 'Paragraph', text: 'A small reactive renderer.' },
    {
      type: 'Quote',
      text: 'Less is more.',
      author: 'Mies van der Rohe',
    },
  ])

  return (
    <For each={blocks}>
      {block => (
        <Dynamic component={blockTypes[block.type]} {...block} />
      )}
    </For>
  )
}

render(App)
