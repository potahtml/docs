import { ref, render, setProperty, signal } from 'pota'

function App() {
  const slider = ref()
  const [value, setValue] = signal(50)

  return (
    <div>
      <input
        use:ref={slider}
        type="range"
        min="0"
        max="100"
      />
      {() => setProperty(slider(), 'valueAsNumber', value())}
      <button on:click={() => setValue(0)}>min</button>
      <button on:click={() => setValue(100)}>max</button>
    </div>
  )
}

render(App)
