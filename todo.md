# pota.docs — Todo

Living checklist of gaps, inconsistencies, and writing issues found while
reviewing the site. Cross off as fixed; append new items as they are
discovered.

---

## 1. Missing doc pages

### `use/*` modules — decision: no per-utility pages

Policy: do **not** create a dedicated page for every `use/*` module,
and do **not** expand the existing `/use/*` list. The `/Directory`
page is the single source of truth for listing the available
exports/imports.

The current `/Directory` page already had a full list partially
commented out (animations, color, random, scroll, strings, time,
test, data, css). Done:

- [x] Reworked `src/pages/@directory/index.jsx` — one section per
      `pota/use/*` sub-path, exports verified against the library
      source.
- [x] Duplicate `stopTracks` and the misaligned `onDocumentFocus`
      indentation are gone (the old block was replaced entirely).
- [x] Every module shipped under `node_modules/pota/src/use/` now
      has a section; each corresponding entry in
      `Usage → Everything` is accounted for.

- [x] Directory page considered done for now. At-a-glance anchor
      index and thematic grouping dropped — the flat listing is
      readable enough, and the page currently serves as the canonical
      `use/*` reference without needing more navigation.

### Components — covered

- [x] `<Errored/>`
- [x] `<Normalize/>`
- [x] `<Navigate/>`
- [x] `customElement` factory (described on the CustomElement page)
- [x] `<Match/>` (covered inside the Switch page)

### Reactive APIs not in the Reactivity table

`src/pages/@reactivity/index.jsx` lists only a subset of what `pota`
exports from `lib/reactive.js`.

Added (descriptions verified against source):

- [x] `action`
- [x] `catchError`
- [x] `derived` (also renamed the stale `writable` row)
- [x] `externalSignal`
- [x] `listener`
- [x] `isResolved`
- [x] `untrack`

Skipped deliberately:

- `unwrap` — user excluded.
- `context`, `ref`, `resolve` — already have dedicated pages.
- `addEvent`, `removeEvent` — on the EventListener page.
- `isComponent`, `makeCallback`, `markComponent`, `Pota` — these are
  component-authoring helpers; better home is Component / Classes.

---

## 2. Menu inconsistencies (`src/@menu.jsx`)

- [x] Added `/CustomElement` to the menu (converted to the flat
      `path=":path$"` route pattern — no trailing slash).
- Decided against (user preference): `Reactivity/memo`,
  `Reactivity/map`, `Articles` stay off the sidebar. The *Flow*
  placement of `Errored` / `Normalize` is fine as-is.

---

## 3. Sitemap cleanup (`src/sitemap.txt`)

- [x] Dropped `/HTML`, `props/attr:__`, `props/bool:__`,
      `props/on:mount`, `props/on:unmount`, `props/propsSplit`.
- [x] Added `Components/Errored`, `Components/Normalize`,
      `Components/Route/Navigate`, `CustomElement`, `XML`.

---

## 6. Content / writing review

Findings from reading each page closely. Each bullet cites the file
and line and offers a concrete fix. Check off as they are applied.

### `src/pages/home.jsx`

- [x] Header run-on rewritten into two sentences with a clearer
      compiler-less → `xml` story.
- [x] Backstory paragraph about the previously-pluggable reactive
      library kept as-is (author preference).
- [x] `Its driven` / `Its mostly` contractions fixed.

### `src/pages/usage/index.jsx`

- [x] Vite jab softened — now just mentions that a vite template is
      also available.
- [x] *Everything* section gained an intro explaining why the block
      exists and pointing to `/Directory` for per-module exports.
- [ ] (Nice-to-have) A dedicated section listing each sub-path
      (`pota`, `pota/components`, `pota/store`, `pota/xml`,
      `pota/jsx-runtime`, `pota/use/*`) with a one-liner each —
      partially covered by Directory, so lower priority.

### `src/pages/@reactivity/index.jsx`

- [x] `signal` row rewritten: tuple + object form explained,{' '}
      `update` semantics (untracked, writes return value) spelled
      out, `equals` option documented.
- [x] `on` row rewritten to clarify which function tracks vs runs
      untracked.
- [x] `syncEffect` row rewritten (scheduled vs synchronous).
- [x] `asyncEffect` row rewritten (receives previous promise,
      `await` for serialisation).
- [x] `effect`, `root`, `batch`, `cleanup`, `owned`, `withValue`,
      `map` rows rewritten for clarity; signatures now match source.
- [x] Table expanded with `action`, `catchError`, `derived` (replaces
      stale `writable`), `externalSignal`, `listener`, `isResolved`,
      `untrack`.

### `src/pages/store/index.jsx`

- [x] Added an *API at a glance* table at the top listing all five
      utilities with signatures, return types, and a one-line
      purpose.
- [x] `mutable(obj, clone?)` second arg documented.
- [x] `signalify(target, keys?)` signature documented, keys list
      behaviour described (works on keys that don't exist yet).
- [x] `merge` / `replace` third-arg `keys` option explained — how it
      preserves references across reorderings.
- [x] Added captions for every `<Code url="…"/>` that was bare.

### `src/pages/context/index.jsx`

- [x] Added a *Signature* section with the read vs provide overloads
      and the `Partial<T>` shallow-merge behaviour, verified against
      `solid.js#context`.
- [x] Inline snippet now shows `useCtx()` and `useCtx(value, fn)`
      without needing an external file.

### `src/pages/render/index.jsx`

- [x] `parent` default clarified to `(default: document.body)`.

### `src/pages/resolve/index.jsx`

- [x] Header + body paragraphs rewritten for clarity. Memo-scope
      note now explains *why* it matters (the resolve becomes the
      tracking boundary).

### `src/pages/to-html/index.jsx`

- [x] Header rewritten. Added Signature, Arguments table, and a
      *toHTML vs render* comparison with a note on reactivity lifetime
      of the returned nodes.

### `src/pages/component/index.jsx`

- [x] Header rewritten; prop precedence stated explicitly (shallow
      merge, later wins, key-by-key — verified against
      `renderer.js:100`).
- [x] Component value types expanded with a one-liner per case.

### `src/pages/classes/index.jsx`

- [x] Header + lifecycle paragraph rewritten.

### `src/pages/cleanup/index.jsx`

- [x] Stale "Reactive Library in use" sentence dropped; order note
      rewritten as LIFO.

### `src/pages/ready/index.jsx`

- [x] Rewritten using `i.e.` and "already be connected".

### `src/pages/typescript/index.jsx`

- [x] Whole page rewritten around pota's ambient utility types
      (`Component`, `ParentComponent`, `VoidComponent`,
      `FlowComponent`, `ComponentType`, `Children`, `ComponentProps`).
      Dropped generic-TypeScript examples that weren't pota-specific.
- [x] Custom Element snippet uses
      `JSX.HTMLAttributes<HTMLElement>` (verified single-generic
      against `typescript/jsx/namespace.d.ts:267`) and a signal-typed
      attribute widening.
- [x] Leading blank lines in snippets — all snippets now start on
      the same line as <mark>value={'{'}`</mark>, consistent.
- [x] Added a *use:* plugin props* section showing how to merge into
      `JSX.ElementAttributes<Element>` from a{' '}
      `declare module 'pota'` block.

### `src/pages/xml/index.jsx`

- [x] "Unlike HTML" clarified — now says "Unlike the browser HTML
      parser".
- [x] *Value* section rewritten: the old "returned real element"
      note is now a clear before/after.
- [x] `a an` / `its local` grammar fixed.
- [x] *Predefined Components* list brought up to date by reading
      `core/xml.js` — now includes A, Collapse, Dynamic, Errored, For,
      Head, Match, Navigate, Normalize, Portal, Range, Route, Show,
      Suspense, Switch, Tabs.
- [x] The three duplicate *Custom Element* section titles renamed to
      *Basic* / *Constructor Timing* / *Tracking*.

### `src/pages/@components/*`

- [x] `collapse/index.jsx` `when` / `fallback` rows rewritten.
- [x] `for/index.jsx` `restoreFocus`, `fallback`, `reactiveIndex`
      rows rewritten; `Sowwy` → `Stress test`.
- [x] `head/index.jsx` expanded with a full dedup table (rules
      confirmed against `core/renderer.js:insertNode` lines 632–656).
- [x] `range/index.jsx` expanded with an Attributes table (signatures
      verified against `components/Range.js` and `lib/std.js#range`).
- [x] `suspense/index.jsx` — `till` → `until`, commented-out JSX
      block removed, unused demo helper functions deleted.
- [x] `tabs/index.jsx` rewritten with a proper shape/Attributes
      table and a note on `Tabs.selected()` (verified against
      `components/tabs/*`).
- [x] `custom-element/index.jsx` — "Its was" → "It was"; the dead
      `Components/Library/` link rewritten as plain text ("a pota
      components library").

### `src/pages/@use/*`

- [x] `bind/index.jsx` rewritten with a per-element-type list of
      supported fields and what they bind to (verified against
      `use/bind.js`).
- [x] `clickoutside/index.jsx` defines "outside" precisely
      (`!node.contains(event.target)`) and cross-references
      `use:clickoutsideonce`.
- [x] `clipboard/index.jsx` `cliboard` → `clipboard`.
- [x] `clipboard/index.jsx` three value shapes (function / string /
      `true` for innerText) listed explicitly.
- [x] `fullscreen/index.jsx` `arbitraty` → `arbitrary`.
- [x] `location/index.jsx` Navigate/navigate blurb rewritten.
- [x] `location/index.jsx` `thats it` → `i.e.`.
- [x] `location/index.jsx` broken `params` object syntax fixed.
- [x] `location/index.jsx` `such:` → `such as:` (both occurrences).
- [x] `location/index.jsx` *useBeforeLeave* section rewritten with
      signature, cancellation semantics, and scope (verified against
      `use/location.js#useBeforeLeave`).
- [x] `selector/index.jsx` header rewritten for clarity.
- [x] `time/index.jsx` description rewritten to describe
      `useTimeout` (start/stop + reactive delay).
- [x] `ref/index.jsx` prose expanded — how to read the ref, why it
      reads zero before mount, pointer to the Mounted Ref example.
- [x] `connected/index.jsx` "As of this writing" hedging removed.

### `src/pages/@props/*`

- [x] `attributes-properties/index.jsx` *xmlns* rewritten for
      clarity.
- [x] `attributes-properties/index.jsx` `Events such on:__` →
      `Events such as on:__`.
- [x] `class/index.jsx` `On where the className…` → `Places where
      the className can be a reactive value`.
- [x] `class/index.jsx` `wont handle the removal` → `won't remove`.
- [x] `style/index.jsx` `On where "red"…` → `Places where "red" can
      be a reactive value`.
- [x] `style/index.jsx` `wont handle` → `won't remove`.
- [x] `style/index.jsx` `Test most? of the ways` → `Tests most of
      the ways`.
- [x] `css/index.jsx` `set and inline CSS StylesSheets` → `inline CSS
      stylesheets`.
- [x] `css/index.jsx` gained a *The css tagged template* section
      describing cache behaviour, `sheet()` equivalent, and the fact
      that the helper does not adopt the sheet on its own (verified
      against `use/css.js`).
- [x] `event-listener-native/index.jsx` `such on:click` → `such as
      on:click`.
- [x] `set-attribute/`, `set-property/`, `set-style/`, `set-class/`
      — each page now has a Signature, Arguments table, "When to use"
      note, and keeps the Snippet. Worked reactive examples still
      rely on the existing `snippet.jsx` files; worth reviewing those
      for richness later.
- [x] `prop/index.jsx` now has a *When to use* section covering
      value/checked divergence, non-string JS values (srcObject,
      files), and property-only cases (innerText, textContent,
      innerHTML), plus a note on null-vs-undefined semantics.

---

## 6a. Second-pass sweep (2026-04-17)

Re-read everything against the source; tightened wording and added
small clarifications. Items touched in this pass:

- [x] `@reactivity/memo/index.jsx` — header rewritten for clarity;
      options row expanded with what `equals: false` / custom
      comparator do; return type fixed (signal, not "function").
- [x] `@reactivity/map/index.jsx` — header tightened; Arguments
      table expanded to include `noSort`, `fallback`,
      `reactiveIndex` (verified against `lib/reactive.js#map`).
- [x] `@components/dynamic` — header rewritten (remount-on-change
      behaviour, rest-prop forwarding) verified against
      `components/Dynamic.js`.
- [x] `@components/portal` — clarified ownership + disposal
      semantics (verified against `components/Portal.js`).
- [x] `@components/show` — header rewritten to be clearer about
      static vs reactive `when` and what the callback signal carries.
- [x] `@components/switch` — header rewritten covering the default
      branch (Match without `when`) and the callback pattern.
- [x] `@components/for` — `restoreFocus` description expanded to
      mention scroll-position restore (confirmed in source).
- [x] `@use/bind` — rewritten with full list of supported elements
      and their bound property (source: `use/bind.js`).
- [x] `@use/clickoutside` — defined "outside" precisely and
      documented the `use:clickoutsideonce` companion.
- [x] `@use/clipboard` — three value shapes (fn / string / `true`)
      listed explicitly.
- [x] `@use/fullscreen` — header rewritten: no-value vs element vs
      selector vs function-returning-one.
- [x] `@use/connected` / `@use/disconnected` — headers rewritten
      for crisper distinction from `ready` / `cleanup`.
- [x] `@props/class` — forms table expanded (array form added;
      object-form sweep caveat explicit).
- [x] `@props/style` — forms table expanded; object-form sweep
      caveat explicit.
- [x] `@props/event-listener-native` — header expanded with
      value shape (fn / object with handleEvent / array).
- [x] `@props/event-listener` — clarified that `addEvent` also
      registers cleanup on the scope; you rarely need to call
      `off()` manually.
- [x] `@props/props-plugin` — Signatures section added; explained
      `propsPluginNS` and the `onMicrotask` default (verified
      against `core/props/plugin.js`).
- [x] `@props/attributes-properties` — header tightened;
      prop/attribute deletion rules surfaced as bullets;
      children-prop precedence and event case-sensitivity
      clarified.
- [x] `usage/index.jsx` — missing `pota/use/form` and
      `pota/use/color` sub-paths added to the Everything list.

---

## 7. Cross-cutting writing rules

Recurring patterns worth fixing everywhere, not just the flagged
lines:

- [x] `wont`, `doesnt`, `dont`, `thats` apostrophe sweep across
      `src/pages/**/*.jsx`.
- [x] `Its` → `It's` in home.jsx and custom-element/index.jsx (all
      remaining occurrences of the bare word are possessives).
- [x] Hedging phrases swept — no remaining occurrences of
      "seems to", "as of this writing", or "I think".
- [x] `could` swept: three remaining occurrences
      (`for`, `show`, `route/route`) rewritten in `can`/`is`/`will`
      form.
- [x] Casing swept — lowercase tech names in prose all checked; only
      remaining lowercase matches are legitimate (file paths, package
      names like `transform-react-jsx`, or literal property names
      like `this.html`). Fixed the "Foreing object html" captions in
      the xmlns/test-xml examples.
- [x] `set*` prop pages now have Arguments/Signature/When-to-use
      sections. Several `use/*` pages are still sparse, but per
      policy we're not expanding them — the Directory page is the
      source of truth for those.
