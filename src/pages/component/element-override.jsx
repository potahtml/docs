import { render, Component } from 'pota'

function App() {
  const Element = Component('marquee', {
    children: 'hello world',
    'style:color': 'aqua',
  })

  return (
    <main>
      <Element />
      <Element>bye world</Element>
      <Element style:color="lime" />
    </main>
  )
}

render(App)
