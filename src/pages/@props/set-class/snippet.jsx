import { render, setClass } from 'pota'
import { location } from 'pota/use/location'
import { A } from 'pota/components'
import { css } from 'pota/use/css'

function App() {
  return (
    <ul
      use:connected={menu => {
        const links = menu.querySelectorAll('li a')
        for (const link of links) {
          setClass(link.parentNode, 'selected', () => {
            return location.href() === link.href
          })
        }
      }}
    >
      {css`
        .selected a {
          color: aqua;
        }
      `}
      <li>
        <A href="#one">one</A>
      </li>
      <li>
        <A href="#two">two</A>
      </li>
      <li>
        <A href="#three">three</A>
      </li>
    </ul>
  )
}

render(App)
