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
    const count = signal(1);

    const increment = () => count.update((count) => count + 1);

    const double = memo(() => count.read() * 2);

    const counting = ()=> count.read
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
