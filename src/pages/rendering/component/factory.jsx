import { render, Factory } from 'pota'

function App() {
  const Fun = Factory('marquee')

  return (
    <main>
      <Fun style:color="aqua">Hi thereeeeeeeee :)</Fun>
      <Fun style:color="aquamarine">Im bender from future</Fun>
    </main>
  )
}

render(App)
