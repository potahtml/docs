// Ambient typing for the content pipeline (see vite-plugin-content.js).

// Vite's import.meta.glob (minimal — avoids pulling vite/client, which
// would redeclare the CSS-module ambient modules below).
interface ImportMeta {
	glob(
		pattern: string,
		options?: { eager?: boolean; query?: string; import?: string },
	): Record<string, any>
}

// `import doc from './content/X.md'` → parsed DocPage object, or
// `import doc from '../../pages/X.md'` → parsed editorial Page object.
// The two shapes share `id`/`title`/`lede`; the rest is per-shape and
// optional here.
declare module '*.md' {
	const doc: {
		id: string
		title: string
		lede: string[]
		subpath?: string
		kind?: string
		bucket?: string
		exports?: string[]
		sections?: any[]
		examples?: any[]
		content?: any[]
	}
	export default doc
}

// `import { manifest } from 'virtual:manifest'` → grouped catalog.
declare module 'virtual:manifest' {
	export const manifest: {
		sections: {
			id: string
			title: string
			subpath: string
			items: { name: string; href: string; desc: string }[]
		}[]
	}
}
