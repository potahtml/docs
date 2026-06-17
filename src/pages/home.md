---
title: pota
---

**pota** is a [SolidJS](https://www.solidjs.com/) inspired/based
Reactive Web Renderer. A research and personal project built on top of
other people's hard work. It ships an optimized Babel preset for JSX,
and can also be used compiler-less via a `xml` tagged-template
function.

I use this project to understand, validate, improve and influence
SolidJS. This is an experiment, if in doubt of using this or SolidJS
you should be using SolidJS.

## Snippet

The signal is used as a function — `{count.read}` — rather than as a
value — `{count.read()}`.

```jsx live
import { render, signal, memo } from 'pota'

function Counter() {
	const count = signal(1)

	const double = memo(() => count.read() * 2)

	const increment = () => count.update(n => n + 1)

	return (
		<button on:click={increment}>
			{count.read} / {double}
		</button>
	)
}

render(Counter)
```

## Getting started

- [Usage](/guide/usage) — install pota, wire up the Babel preset (or
  go compiler-less), and ship your first sketch.
- [TypeScript](/guide/typescript) — component utility types, typing
  props, and declaring custom elements.
- [attributes / properties](/guide/attributes-properties) — how pota
  decides between writing an attribute or a property, and the
  conventions that follow.
- [cheatsheet](/cheatsheet) — the whole main public surface at a
  glance, one usage note per export.
- [AI usage](/ai-usage) — the two skills pota ships for AI tools, and
  how AI was used on the docs and the project.

## Some of the differences with SolidJS

- signals are objects with `read`, `write`, `update` methods.
- Reactivity that is easy to understand: if something is a function it
  can be reactive; if it is not a function, it is not reactive.
- No prop getters — or any getters. Possible to use destructuring.
- Functions are tracked, regardless of nesting depth.
- Renders objects, promises, maps, sets, and more.
- Allows multiple callbacks on components like `Show` and `For`.
- Uses native events.
- Includes a simple but full-featured `Route` component.
- Does not include server-side rendering (SSR) nor Universal renderer.
