import { render, signal } from 'pota'
import { Collapse } from 'pota/web'

function Example() {
  const [showing, setShowing, updateShowing] = signal(true)

  return (
    <>
      <button
        name="button"
        on:click={() => updateShowing(showing => !showing)}
      >
        toggle
      </button>
      <Collapse
        when={showing}
        fallback={
          <div style="color:aquamarine">
            The video is playing and this is the fallback!
          </div>
        }
      >
        <iframe
          width="560"
          height="315"
          src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?si=U8aoXoxgc77CKWOo&start=1"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </Collapse>
    </>
  )
}

render(Example)
