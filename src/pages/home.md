---
title: pota
---

**pota** is a small and pluggable [SolidJS](https://www.solidjs.com/)
inspired Reactive Web Renderer. A research and personal project built
on top of other people's hard work. It ships an optimized Babel preset
for JSX, and can also be used compiler-less via an included `xml`
tagged-template function.

If it is a function, it can be reactive; if it is not a function, it
is not reactive. It renders objects, promises, maps and sets, and
ships stores, context, routing, and a props plugin layer to teach any
element new attributes.

## The gist

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

## Key points

- Reactivity that is easy to understand: if something is a function it
  can be reactive; if it is not a function, it is not reactive.
- No prop getters — or any getters. You can destructure function
  arguments and objects freely.
- `use:ref` accepts any function (or a nested array of functions):
  composable behavior helpers without a plugin registry.
- Allows multiple callbacks on components like `Show` and `For`.
- Functions are tracked, regardless of nesting depth.
- Renders objects, promises, maps, sets, and more.
- `Portal` does not wrap children in a `div`.
- Includes a simple but full-featured `Route` component.
- Does not include server-side rendering (SSR).
- Utilities to track objects — `mutable`, `signalify` — with
  reconcile-like APIs.

## Why

To understand reactivity better, and to learn the inner workings of an
automatic dependency-tracking reactive renderer. The source code is
small and readable, prioritizes consistency, and is subjectively easy
to understand. It is driven by developer needs, not benchmarks —
mostly a research and personal project, used to help improve Solid.

## Inspiration

The API and base components are heavily inspired by
[Solid](https://www.solidjs.com/), albeit things differ to an extent
based on personal preference. See [thanks](/thanks) for the full list
of shoulders this stands on.
