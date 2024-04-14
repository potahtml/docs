import { Code } from '../../lib/components/code/code.jsx'
import { version } from 'pota'

export const CompilerLess = (
  <Code
    code={`

  // pota - Compiler-less html example
  // Note: standalone includes everything, you probably would want to import from the depths

  import {
    render,
    signal,
    html,
    memo,
  } from "https://cdn.jsdelivr.net/npm/pota@${version}/dist/standalone.js";

  function Counter() {
    const [count, setCount, updateCount] = signal(1);
    const double = memo(() => count() * 2);

    const increment = () => updateCount((count) => count + 1);

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
