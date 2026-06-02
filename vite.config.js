import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import babel from '@rolldown/plugin-babel'

import { contentPlugin } from './tools/vite-plugin-content.js'
import { importmapPlugin } from './tools/vite-plugin-importmap.js'

const resolve = p => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
	plugins: [
		contentPlugin(),
		importmapPlugin(),
		babel({
			presets: [['pota/babel-preset']],
		}),
	],
	server: {
		port: 1340,
		open: '/',
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
		rollupOptions: {
			// preview.html is the playground's sandbox iframe; without it
			// as an explicit input it would be dropped from the build (and
			// never get the importmap injected).
			input: {
				index: resolve('./index.html'),
				preview: resolve('./preview.html'),
			},
		},
	},
	define: {
		__HMR_CONFIG_NAME__: JSON.stringify('vite'),
	},
})
