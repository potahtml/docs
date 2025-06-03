import { render, setClass } from 'pota'
import { location } from 'pota/plugin/useLocation'
import { css } from 'pota/std'
import { A } from 'pota/web'

function App() {
  return (
    <ul
      on:mount={menu => {
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
