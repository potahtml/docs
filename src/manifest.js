// The catalog is generated at build time from the markdown frontmatter
// and grouped by the curated taxonomy. See vite-plugin-content.js and
// topics.js. This re-export keeps `import { manifest }` stable for
// consumers.
export { manifest } from 'virtual:manifest'
