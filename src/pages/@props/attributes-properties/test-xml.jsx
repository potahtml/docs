import { render } from 'pota'
import { css } from 'pota/std'

function App() {
  return (
    <main>
      <p> XML</p>
      {css`
        * {
          fill: currentColor;
        }
      `}
      <p>
        {'<'}svg..{'/>'} + xlink
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        ...
        <image
          width="100"
          height="100"
          xlink:href="/assets/quack.png"
        ></image>
        ...
      </svg>
      <hr />
      <p>
        {'<'}kilo:svg..{'/>'}
      </p>
      <kilo:svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <kilo:path d="M10 10.5h1.5v3H10zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 15H6v-4.5H4.5V9h3v6zm5.5-1c0 .55-.45 1-1 1H9.5c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1H12c.55 0 1 .45 1 1v4zm6.5 1h-1.75L16 12.75V15h-1.5V9H16v2.25L17.75 9h1.75l-2.25 3 2.25 3z" />
      </kilo:svg>
      <p>
        {'<'}math..{'/>'}
      </p>
      <math xmlns="http://www.w3.org/1998/Math/MathML">
        <mfrac>
          <msup>
            <mi>v</mi>
            <mn>2</mn>
          </msup>
          <mn>2</mn>
        </mfrac>
        <mo>+</mo>
        <mi>g</mi>
        <mi>z</mi>
        <mo>+</mo>

        <mfrac>
          <mi>p</mi>
          <mi>ρ</mi>
        </mfrac>
        <mo>=</mo>
        <mtext>constant</mtext>
      </math>
      <hr />
      <p>
        {'<'}fancy:svg..{'/>'} + xlink:
      </p>
      <fancy:svg
        viewBox="0 0 160 40"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <a
          href="https://developer.mozilla.org/"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <text
            x="10"
            y="25"
          >
            MDN Web Docs
          </text>
        </a>
      </fancy:svg>
      <hr />
      <hr />
      Foreing object html {'-> xml -> html'}
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {css`
          div {
            color: white;
            font: 18px serif;
            height: 100%;
            overflow: auto;
          }
        `}

        <polygon points="5,5 195,10 185,185 10,195" />

        <foreignobject
          x="20"
          y="20"
          width="160"
          height="160"
        >
          <div xmlns="http://www.w3.org/1999/xhtml">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed mollis mollis mi ut ultricies. Nullam magna ipsum,
            porta vel dui convallis, rutrum imperdiet eros. Aliquam
            <title>Test</title>
            erat volutpat.
          </div>
        </foreignobject>
      </svg>
    </main>
  )
}

render(App)
