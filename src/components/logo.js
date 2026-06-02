// Single source of truth for the pota logo's colored renditions.
//
// The artwork itself lives untouched in ./assets/logo.svg (the original
// brand teardrop, blue gradient + depth). Here we read it as raw text
// and recolor its fixed color slots from the current accent — scaled
// into a light→dark ramp so the gradient and stroke keep their depth.
// Both the inline header logo (Logo.jsx) and the favicon (theme.js)
// consume `logoDataURI`, so the two can never drift.

import raw from './assets/logo.svg?raw'
import { lighten, darken } from 'pota/use/color'

// Each hardcoded color in the original maps to an accent-derived shade.
// Keys are matched literally against the source SVG text.
const RAMP = {
	'#9dddff': hex => lighten(hex, 0.5), // back highlight fill
	'#005f8f': hex => darken(hex, 0.28), // gradient dark stop
	'#004b70': hex => darken(hex, 0.5), // stroke
	'#004d70': hex => darken(hex, 0.5), // stroke (inner dot)
	'#0af': hex => lighten(hex, 0.12), // gradient light stop
}

// Longer tokens first so `#0af` never shadows a 7-char hex at the same
// position; a single pass keeps replacements from being re-scanned.
const COLOR_RE = /#9dddff|#005f8f|#004b70|#004d70|#0af/g

/**
 * The logo recolored from `hex`, normalized to a square `size`.
 *
 * @param {string} hex - Any CSS color (the active accent).
 * @param {number} [size] - Width/height in px.
 * @returns {string} SVG markup.
 */
export function logoSVG(hex, size = 24) {
	const sized = raw.replace(/<svg([^>]*)>/, (_, attrs) => {
		attrs = attrs
			.replace(/\swidth="[^"]*"/, '')
			.replace(/\sheight="[^"]*"/, '')
		return `<svg width="${size}" height="${size}"${attrs}>`
	})
	return sized.replace(COLOR_RE, slot => RAMP[slot](hex))
}

/**
 * `logoSVG` as a `data:` URI, ready for an `<img src>` or favicon href.
 *
 * @param {string} hex
 * @param {number} [size]
 * @returns {string}
 */
export const logoDataURI = (hex, size) =>
	'data:image/svg+xml,' + encodeURIComponent(logoSVG(hex, size))
