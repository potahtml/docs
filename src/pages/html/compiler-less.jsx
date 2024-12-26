import { Code } from '../../lib/components/code/code.jsx'

export const CompilerLess = (
  <Code
    code={`

  // pota - Compiler-less html example

  import {
    render,
    signal,
    memo,
  } from "pota";

  import {
    html,
  } from "pota/html";

  function Counter() {
    const [count, setCount, updateCount] = signal(1);
    const double = memo(() => count() * 2);

    const increment = () => updateCount((count) => count + 1);

    html.define({ count, double });

    return html\`<label>
      <button name="button" on:click="\${increment}">
        <count /> / <double />
      </button>
      double is: <double />
    </label>\`;
  }

  render(Counter);


`}
  ></Code>
)
