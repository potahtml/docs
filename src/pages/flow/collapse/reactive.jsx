import { render, Collapse, signal } from 'pota'

function Example() {
  const [showing, setShowing] = signal(true)

  return (
    <>
      <button onClick={() => setShowing(showing => !showing)}>
        toggle
      </button>
      <Collapse when={showing}>
        <iframe
          width="560"
          height="315"
          style="height:315px"
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
