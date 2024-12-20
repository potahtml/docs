import { render } from 'pota'
import { css } from 'pota/std'

function App() {
  return (
    <main>
      {css`
        .red {
          color: red;
        }
        .orange {
          color: orange;
        }
        .purple {
          color: purple;
        }
        .blue {
          color: blue;
        }
      `}

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
