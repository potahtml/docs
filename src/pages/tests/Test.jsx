export const Test = () => {
	Promise.all([
		import('pota'),

		import('pota/jsx-runtime'),
		import('pota/xml'),
		import('pota/components'),

		import('pota/experiments'),
		import('pota/store'),

		import('pota/use/animate'),
		import('pota/use/bind'),
		import('pota/use/browser'),
		import('pota/use/clickoutside'),
		import('pota/use/clipboard'),
		import('pota/use/color'),
		import('pota/use/css'),
		import('pota/use/dom'),
		import('pota/use/emitter'),
		import('pota/use/event'),
		import('pota/use/focus'),
		import('pota/use/fullscreen'),
		import('pota/use/location'),
		import('pota/use/orientation'),
		import('pota/use/paginate'),
		import('pota/use/polyfills'),
		import('pota/use/random'),
		import('pota/use/resize'),
		import('pota/use/scroll'),
		import('pota/use/selection'),
		import('pota/use/selector'),
		import('pota/use/stream'),
		import('pota/use/string'),
		import('pota/use/test'),
		import('pota/use/time'),
		import('pota/use/url'),
		import('pota/use/visibility'),
	]).then(imports => console.log(imports))

	return undefined
}
