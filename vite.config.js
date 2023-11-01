import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'

export default defineConfig({
	root: './src',
	publicDir: './src',
	appType: 'spa',
	/*
		//it makes packages linked with npm link work
	  	resolve: {
			preserveSymlinks: true,
		},
	*/
	esbuild: false,
	build: {
		target: 'esnext',
		modulePreload: false,
		outDir: '../dist/',
		emptyOutDir: true,
		sourcemap: true,
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/chunk-[name].js`,
				assetFileNames: `assets/asset-[name].[ext]`,
			},
			input: {
				main: './src/index.html',
				playground: './src/public/playground/index.html',
			},
			treeshake: true,
		},
		manifest: true,
		minify: true,
	},
	server: {
		open: '/',
		watch: {
			ignored: ['!**/node_modules/pota/**'],
		},
	},
	plugins: [
		babel({
			babelConfig: {
				presets: [['pota/babel-preset']],
				plugins: [
					[
						'dom-flair/babel',
						{ path: 'src/public/flair.css', reset: true },
					],
				],
			},
		}),
	],
	optimizeDeps: {
		// if this is missing it breaks for some reason
		disabled: true,
	},
})
