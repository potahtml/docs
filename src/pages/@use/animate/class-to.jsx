import { ref, render, signal } from 'pota'
import { animateClassTo } from 'pota/use/animate'

function App() {
  const box = ref()
  const [state, setState] = signal('idle')

  const toggle = async () => {
    if (state() === 'idle') {
      setState('out')
      await animateClassTo(box(), 'idle', 'out')
      setState('back')
      await animateClassTo(box(), 'out', 'back')
      setState('idle')
      await animateClassTo(box(), 'back', 'idle')
    }
  }

  return (
    <>
      <style>{`
        .idle { background: #2a9d8f; transition: background .2s; }
        .out  { background: #e76f51; animation: slide .4s forwards; }
        .back { background: #f4a261; animation: slide-back .4s forwards; }
        @keyframes slide       { to { transform: translateX(120px); } }
        @keyframes slide-back  { to { transform: translateX(0);     } }
      `}</style>

      <button on:click={toggle}>animate</button>
      <div
        use:ref={box}
        class={state}
        style={{
          width: '120px',
          padding: '1rem',
          color: 'white',
          'margin-top': '1rem',
        }}
      >
        state: {state}
      </div>
    </>
  )
}

render(App)
