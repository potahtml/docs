---
title: AI usage
---

How AI fits into pota — the skills the package ships to help you build
with AI assistance, and an honest account of how AI was used on the
documentation and the project itself.

## Skills shipped with pota

pota ships two skills inside the npm package, under
`node_modules/pota/.claude/skills/`. AI coding tools that follow the
skill convention discover them automatically once pota is a dependency
— there is nothing to install or configure. Both are consumer-facing: they help you build _with_
pota and contain nothing about developing pota itself.

- **`pota` — write idiomatic pota.** The day-to-day conventions for
  writing pota: JSX rules (`on:click` vs `onClick`, `class` not
  `className`, reader-function children), the signal API
  (`read` / `write` / `update`), the built-in components, the store
  layer, and `use/*` plugins. Reach for it when writing or reviewing
  components, fixing a pota bug, or creating examples.
- **`breaking-changes` — migrate across versions.** A catalogue of
  pota's breaking changes with before/after migrations: the signal
  tuple removal, `use:*` behaviour plugins becoming `use:ref`
  factories, removed and renamed exports, the `pota/web` →
  `pota/components` rename, and more. Reach for it when bumping the
  pota dependency or fixing an app that calls an API pota changed.

Each migration is tagged with the version it shipped in, so a tool can
apply only the changes between the version you are on and the one you
are moving to. When a skill is unclear or a case is missing, the
installed pota source is the ground truth.

## About these docs

These docs were **written by a human**, then **rewritten, expanded,
and reviewed with AI**. Some examples are the original author's;
others were generated, adapted, and verified during that pass. Every
page is checked against the pota source — the source is the ground
truth, and where the docs and the code disagree, the code wins. If you
spot a mismatch, please
[open an issue](https://github.com/potahtml/pota/issues).

## About the project

pota was **written by a human, from scratch** — the reactive core, the
renderer, the Babel preset, and the components are hand-built, with the
lineage to Solid and dom-expressions described on the
[thanks](/thanks) page. More recently, AI has been used to **iterate
on and improve** parts of it: tightening internals, expanding tests,
and this documentation. The design and the decisions remain the
author's.
