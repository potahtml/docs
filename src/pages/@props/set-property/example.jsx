import { ref, render, setProperty, signal } from 'pota'

function App() {
  const slider = ref()
  const value = signal(50)

  return (
    <div>
      <input
        use:ref={slider}
        type="range"
        min="0"
        max="100"
      />
      {() => setProperty(slider(), 'valueAsNumber', value.read())}
      <button on:click={() => value.write(0)}>min</button>
      <button on:click={() => value.write(100)}>max</button>
    </div>
  )
}

render(App)
