import { render } from 'pota'

function App() {
  return (
    <main>
      <style>
        {`
          .red { color:red }
          .orange { color:orange }
          .purple { color:purple }
          .blue { color:blue }
        `}
      </style>
      <div class=" red"> red</div>
      <div class=" orange  purple     "> orange purple </div>
      <div class={{ blue: true }}>blue: true</div>
      <div
        class={{
          red: undefined,
          orange: true,
          purple: null,
        }}
      >
        object
      </div>
      <div class:red={true}>class:red={'{true}'}</div>
      <div
        class:my-ns={{
          red: undefined,
          orange: 0,
          purple: true,
        }}
      >
        class:my-ns= object
      </div>
      <div class="undefined">class="undefined" this is ok</div>
      <div class={undefined}>class=undefined</div>
      <div
        class="red"
        class:red={undefined}
      >
        class:red:undefined
      </div>
      <div
        class="red"
        class:red={null}
      >
        class:red:null
      </div>
      <div
        class={{
          [undefined]: undefined,
          [null]: null,
          red: true,
        }}
      >
        object
      </div>
      <div
        class:my-ns={{
          [undefined]: undefined,
          [null]: null,
          red: true,
        }}
      >
        my-ns:object
      </div>
    </main>
  )
}

render(App)
