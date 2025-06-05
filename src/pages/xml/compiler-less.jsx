import { Code } from '../../lib/components/code/code.jsx'

export const CompilerLess = (
  <Code
    code={`

  // pota - Compiler-less xml example

  import {
    render,
    signal,
    memo,
  } from "pota";

  import {
    xml,
  } from "pota/xml";

  function Counter() {
    const [count, setCount, updateCount] = signal(1);
    const double = memo(() => count() * 2);

    const increment = () => updateCount((count) => count + 1);

    xml.define({ count, double });

    return xml\`<label>
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
