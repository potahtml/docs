import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import babel from '@rolldown/plugin-babel'

import { contentPlugin } from './tools/vite-plugin-content.js'
import { importmapPlugin } from './tools/vite-plugin-importmap.js'
import { nodeModulesPlugin } from './tools/vite-plugin-node-modules.js'

const resolve = p => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
	// app source (incl. index.html, preview.html, pages/) lives in src/;
	// keep publicDir and the build output at the project root, outside it.
	root: resolve('./src'),
	publicDir: resolve('./public'),
	plugins: [
		nodeModulesPlugin(),
		contentPlugin(),
		importmapPlugin(),
		babel({
			presets: [['pota/babel-preset']],
		}),
	],
	server: {
		// docs generation depends on this exact origin — refuse to start
		// on a drifted port (1341, …) when 1340 is already taken.
		port: 1340,
		strictPort: true,
		open: '/',
		// content markdown lives in the pota repo (documentation/content),
		// outside this Vite root; allow the dev server to read it. The repo
		// root is an ancestor of src/, so this covers project files too.
		fs: { allow: [resolve('../..')] },
	},
	optimizeDeps: {
		rolldownOptions: {
			transform: {
				jsx: { runtime: 'automatic', importSource: 'pota' },
			},
		},
	},
	build: {
		target: 'esnext',
		outDir: resolve('./dist'),
		emptyOutDir: true, // outDir is outside root — opt in to emptying it
		rollupOptions: {
			// preview.html is the playground's sandbox iframe; without it
			// as an explicit input it would be dropped from the build (and
			// never get the importmap injected).
			input: {
				index: resolve('./src/index.html'),
				preview: resolve('./src/preview.html'),
			},
		},
	},
	define: {
		__HMR_CONFIG_NAME__: JSON.stringify('vite'),
	},
})
