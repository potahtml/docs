import { render, Component } from 'pota'

function App() {
  const Fun = Component('marquee')

  return (
    <main>
      <Fun style:color="aqua">Hi thereeeeeeeee :)</Fun>
      <Fun style:color="aquamarine">Im bender from future</Fun>
    </main>
  )
}

render(App)
