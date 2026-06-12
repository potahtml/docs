// Curated topic taxonomy for the docs catalog. Runs at build time
// inside the Vite plugin. The full page index is generated from the
// markdown frontmatter (see content-parser.js → parseMeta); this file
// only decides how those pages are grouped, ordered, and labeled.
// Array order is the catalog's section order — roughly core
// primitives → components → use/* grouped topics → standalone
// modules.
//
// Each topic resolves to a list of pages via, in priority order:
//   include — explicit page refs (id, title, or an export name), kept
//             in the order written. Enables cross-cutting topics like
//             CSS that pull from several topics.
//   module  — every page whose `subpath` equals this import path
//             (e.g. `pota/use/dom`), overview page first. Promotes a
//             single many-export use/* module into its own section.
//             The subpath is owned EXCLUSIVELY by its module section:
//             those pages are dropped from the generic `topic`
//             buckets, so a big module (dom, test, random, …) does
//             not also list under the topic its pages carry in
//             frontmatter (Utilities, Internals, …) — that topic
//             value may then map to no entry at all.
//   topic   — every page whose frontmatter `topic` matches, minus any
//             page already owned by a `module` section.
//
// `subpath` is the section header's import-path label (' · '
// separates mixed sources). Display only — never used for matching;
// module sections fall back to their module path.
//
// A page may appear in MORE THAN ONE topic. Cross-cutting topics
// (CSS, Lifecycles, Async) intentionally re-list pages that also live
// in a home topic (Props, Reactive core, Renderer) so related APIs
// are discoverable from every angle. Within a single topic a page is
// listed once: `include` matches first (in written order), then
// topic-matched pages by title. The catalog UI counts a cross-listed
// page once (see Browse.jsx → countUnique).
//
// There is no "More" bucket. Every page must be reachable through
// some entry — its `topic`, an `include`, or a `module` section;
// buildManifest warns at build time if any page is unreachable, so
// nothing is silently dropped. Exception: guide pages (subpath
// `guide`) live in the homepage prose (src/pages/home.md), not in the
// catalog — the catalog is APIs only.

export const topics = [
	{
		id: 'reactive-core',
		title: 'Reactive core',
		subpath: 'pota',
		topic: 'Reactive core',
	},
	{
		id: 'rendering',
		title: 'Rendering',
		subpath: 'pota · pota/xml',
		topic: 'Renderer',
		include: ['xml'],
	},
	{
		id: 'props',
		title: 'Props',
		subpath: 'pota',
		topic: 'Props',
		include: ['prop:__'],
	},
	{
		id: 'events',
		title: 'Events',
		subpath: 'pota · pota/use/*',
		topic: 'Events',
		include: ['on:__'],
	},
	{
		id: 'css',
		title: 'CSS',
		subpath: 'pota · pota/use/css',
		include: [
			'style:__',
			'class:__',
			'use:css',
			'css',
			'setStyle',
			'setClass',
		],
	},
	{
		id: 'lifecycles',
		title: 'Lifecycles',
		subpath: 'pota',
		include: [
			'use:ref',
			'use:connected',
			'use:disconnected',
			'ready',
			'readyAsync',
			'cleanup',
		],
	},
	{
		id: 'flow',
		title: 'Flow',
		subpath: 'pota/components',
		topic: 'Flow',
	},
	{
		id: 'async',
		title: 'Async',
		subpath: 'pota · pota/components',
		topic: 'Async',
		include: ['Suspense', 'asyncEffect', 'readyAsync', 'isResolved'],
	},
	{
		id: 'routing',
		title: 'Routing',
		subpath: 'pota/components · pota/use/location',
		topic: 'Routing',
	},
	{
		id: 'url',
		title: 'URL',
		subpath: 'pota/use/url',
		module: 'pota/use/url',
	},
	{
		id: 'store',
		title: 'Store',
		subpath: 'pota/store',
		topic: 'Store',
	},
	{
		id: 'custom-elements',
		title: 'Custom elements',
		subpath: 'pota/components',
		topic: 'Custom Elements',
	},
	{
		id: 'document',
		title: 'Document',
		subpath: 'pota/components',
		topic: 'Document',
	},
	{
		id: 'text',
		title: 'Text',
		subpath: 'pota/components',
		topic: 'Text',
	},
	{
		id: 'layout',
		title: 'Layout',
		subpath: 'pota/components',
		topic: 'Layout',
	},
	{
		id: 'stylesheets',
		title: 'Stylesheets',
		subpath: 'pota/use/css',
		module: 'pota/use/css',
	},
	{
		id: 'forms',
		title: 'Forms',
		subpath: 'pota/use/*',
		topic: 'Forms',
	},
	{
		id: 'interaction',
		title: 'Interaction',
		subpath: 'pota/use/*',
		topic: 'Interaction',
	},
	{
		id: 'input',
		title: 'Input',
		subpath: 'pota/use/*',
		topic: 'Input',
	},
	{
		id: 'observers',
		title: 'Observers',
		subpath: 'pota/use/*',
		topic: 'Observers',
	},
	{
		id: 'browser',
		title: 'Browser',
		subpath: 'pota/use/*',
		topic: 'Browser',
	},
	{
		id: 'floating-ui',
		title: 'Floating UI',
		subpath: 'pota/use/*',
		topic: 'Floating UI',
	},
	{
		id: 'data',
		title: 'Data',
		subpath: 'pota/use/*',
		topic: 'Data',
	},
	{
		id: 'media',
		title: 'Media',
		subpath: 'pota/use/*',
		topic: 'Media',
	},
	{
		id: 'animation',
		title: 'Animation',
		subpath: 'pota/use/animate',
		module: 'pota/use/animate',
	},
	{
		id: 'environment',
		title: 'Environment',
		subpath: 'pota/use/browser',
		module: 'pota/use/browser',
	},
	{
		id: 'reactive-helpers',
		title: 'Reactive helpers',
		subpath: 'pota/use/selector',
		module: 'pota/use/selector',
	},
	{
		id: 'utilities',
		title: 'Utilities',
		subpath: 'pota',
		topic: 'Utilities',
	},
	{
		id: 'random',
		title: 'Random',
		subpath: 'pota/use/random',
		module: 'pota/use/random',
	},
	{
		id: 'string',
		title: 'String',
		subpath: 'pota/use/string',
		module: 'pota/use/string',
	},
	{
		id: 'color',
		title: 'Color',
		subpath: 'pota/use/color',
		module: 'pota/use/color',
	},
	{
		id: 'time',
		title: 'Time',
		subpath: 'pota/use/time',
		module: 'pota/use/time',
	},
	{
		id: 'dom',
		title: 'DOM',
		subpath: 'pota/use/dom',
		module: 'pota/use/dom',
	},
	{
		id: 'test',
		title: 'Test',
		subpath: 'pota/use/test',
		module: 'pota/use/test',
	},
]

const matches = (p, entry) =>
	p.id === entry ||
	p.title === entry ||
	(p.exports || []).includes(entry)

// component exports render as <Name/> when capitalized (the component
// itself), but lowercase helpers on a component page (e.g. `load`,
// `customElement`) stay plain.
const displayExport = (p, name) =>
	p.kind === 'component' && /^[A-Z]/.test(name) ? `<${name}/>` : name

// every export of a page becomes its own catalog entry, linking to the
// page. pages without exports (guides) fall back to their title.
const itemsForPage = p => {
	const names = p.exports && p.exports.length ? p.exports : [p.title]
	return names.map(name => ({
		name: displayExport(p, name),
		href: p.href,
		desc: p.desc,
	}))
}

export function buildManifest(pages) {
	const sections = []
	const reached = new Set()

	// Subpaths promoted to their own `module` section own those pages
	// exclusively: drop them from the generic `topic` buckets so a
	// many-export use/* module does not also list under its old home.
	const owned = new Set(
		topics.filter(t => t.module).map(t => t.module),
	)

	for (const topic of topics) {
		// Dedupe within a single topic; a page may still appear in
		// other topics — cross-cutting duplication is intentional.
		const seen = new Set()
		const picked = []
		const claim = p => {
			if (!p || seen.has(p.id)) return
			seen.add(p.id)
			reached.add(p.id)
			picked.push(p)
		}

		if (topic.include) {
			for (const entry of topic.include) {
				claim(pages.find(p => matches(p, entry)))
			}
		}
		if (topic.module) {
			pages
				.filter(p => p.subpath === topic.module)
				.sort(byModuleOrder)
				.forEach(claim)
		}
		if (topic.topic) {
			pages
				.filter(p => p.topic === topic.topic && !owned.has(p.subpath))
				.sort(byTitle)
				.forEach(claim)
		}

		if (picked.length) {
			sections.push({
				id: topic.id,
				title: topic.title,
				subpath: topic.subpath || topic.module || '',
				items: picked.flatMap(itemsForPage),
			})
		}
	}

	// No "More" bucket: every page must be reachable from a topic.
	// Warn (rather than silently drop) if the taxonomy falls behind
	// the content — e.g. a new page introduces an uncovered `topic`.
	// Guide pages are exempt: they are linked from the homepage prose
	// (src/pages/home.md), not from the catalog.
	const unreached = pages.filter(
		p => !reached.has(p.id) && p.subpath !== 'guide',
	)
	if (unreached.length) {
		console.warn(
			`[topics] ${unreached.length} page(s) not in any topic — add a topic entry or include:\n  ` +
				unreached.map(p => p.id).join('\n  '),
		)
	}

	return { sections }
}

const byTitle = (a, b) => a.title.localeCompare(b.title)

// Within a `module` section the overview page (`use/dom`) leads, then
// its exports alphabetically. The overview's id has one fewer path
// segment than its sub-pages (`use/dom` vs `use/dom/body`), so order by
// id depth first.
const depth = p => p.id.split('/').length
const byModuleOrder = (a, b) => depth(a) - depth(b) || byTitle(a, b)
