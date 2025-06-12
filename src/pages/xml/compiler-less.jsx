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

    const increment = () => updateCount((count) => count + 1);

    const double = memo(() => count() * 2);

    const counting = ()=> count
    const doubling = ()=>double


    xml.define({ counting, doubling });

    return xml\`<label>
      <button name="button" on:click="\${increment}">
        <counting /> / <doubling />
      </button>
      double is: <doubling />
    </label>\`;
  }

  render(Counter);


`}
  ></Code>
)
