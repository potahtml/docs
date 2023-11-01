import { render, create } from 'pota'

function App() {
  const Fun = create('marquee')

  return (
    <main>
      <Fun style:color="aqua">Hi thereeeeeeeee :)</Fun>
      <Fun style:color="aquamarine">Im bender from future</Fun>
    </main>
  )
}

render(App)
