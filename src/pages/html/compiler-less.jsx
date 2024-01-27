import { Code } from '../../lib/components/code/code.jsx'

export const CompilerLess = (
	<Code
		code={`

  // pota + solid reactivity - Compiler-less html example

  import {
    render,
    signal,
    html,
    memo,
  } from "https://cdn.jsdelivr.net/npm/pota@0.7.77/dist/standalone.js";

  function Counter() {
    const [count, setCount] = signal(1);
    const double = memo(() => count() * 2);

    const increment = () => setCount((count) => count + 1);

    html.define({ count, double });

    return html\`<label>
      <button name="button" onClick="\${increment}">
        <count />
      </button>
      double is: <double />
    </label>\`;
  }

  render(Counter);


`}
	></Code>
)
