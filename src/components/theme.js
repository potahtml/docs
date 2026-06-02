// Appearance engine for the docs site: theme mode (light / dark /
// custom), the custom-accent palette generator, prose spacing, and the
// editor color scheme. State lives in signals here; ThemeToggle.jsx and
// EditorScheme.jsx are just the UI. Applied on import so there's no
// flash before the component mounts.

import { signal } from 'pota'
import {
	scale,
	textColor,
	textColorWhenBackgroundIsWhite,
	textColorWhenBackgroundIsBlack,
	alpha,
	lighten,
	darken,
	validateColor,
} from 'pota/use/color'
import { logoDataURI } from './logo.js'
import { TOKENS, schemes } from './editor-schemes.js'

const MODE_KEY = 'pota-theme' // 'light' | 'dark' | 'custom'
const SEED_KEY = 'pota-accent' // hex seed for the custom palette
const SPACE_KEY = 'pota-spacing' // prose-spacing multiplier
const SCHEME_KEY = 'pota-editor' // editor color scheme id

const root = document.documentElement

// The neutral + brand tokens a custom palette overrides inline. The
// code-syntax (`--cm-*`) palette is intentionally left to the light/dark
// base block in styles.css — `applyCustom` sets `data-theme` to the
// matching base so highlighting stays legible.
const CUSTOM_TOKENS = [
	'--bg',
	'--bg-elev',
	'--rule',
	'--fg-faint',
	'--fg-mute',
	'--fg-soft',
	'--fg',
	'--accent',
	'--match',
]

function read(key, fallback) {
	try {
		const v = localStorage.getItem(key)
		return v == null ? fallback : v
	} catch (e) {
		return fallback
	}
}
function store(key, value) {
	try {
		localStorage.setItem(key, value)
	} catch (e) {}
}

export const mode = signal(read(MODE_KEY, 'light'))
export const seed = signal(read(SEED_KEY, '#cc4400'))
export const spacing = signal(Number(read(SPACE_KEY, '1')) || 1)
export const editorScheme = signal(read(SCHEME_KEY, 'auto'))

const schemeById = new Map(schemes.map(s => [s.id, s]))

// The live accent, kept in sync with the active theme. Base light/dark
// themes define --accent in CSS (read it back from the computed style);
// custom mode already has the resolved value. The inline header logo
// reads this signal; `syncAccent` also repaints the favicon so both
// stay tinted to the same color.
export const accent = signal('#cc4400')

let faviconLink
function applyFavicon(hex) {
	faviconLink ||=
		document.querySelector('link[rel="icon"]') ||
		document.head.appendChild(
			Object.assign(document.createElement('link'), {
				rel: 'icon',
				type: 'image/svg+xml',
			}),
		)
	faviconLink.href = logoDataURI(hex, 32)
}

function syncAccent(hex) {
	accent.write(hex)
	applyFavicon(hex)
}

/**
 * Derive a full neutral + brand palette from one seed color.
 *
 * Light vs dark is chosen from the seed's own lightness (APCA): when
 * white text contrasts better on the seed, the seed is "dark" and we
 * build a dark UI, and vice-versa. Neutrals come from a low-chroma
 * OkLab ramp between a light tint and a dark tint of the seed — tinted
 * by its hue but never saturated. The accent is the seed itself, nudged
 * (APCA) until it's legible on the chosen background.
 *
 * @param {string} hex
 * @returns {{ base: 'light' | 'dark', vars: Record<string, string> }}
 */
function customPalette(hex) {
	const dark = textColor(hex) === 'white'

	// straight light-tint → dark-tint ramp: low chroma at both ends, so
	// the whole neutral scale stays subtly tinted rather than saturated.
	const n = scale([lighten(hex, 0.9), darken(hex, 0.9)], 11)

	const accent = dark
		? textColorWhenBackgroundIsBlack(hex)
		: textColorWhenBackgroundIsWhite(hex)

	// indices into `n` (0 = lightest, 10 = darkest), mirrored for dark
	const i = dark
		? { bg: 10, elev: 9, rule: 8, faint: 6, mute: 4, soft: 2, fg: 0 }
		: { bg: 0, elev: 1, rule: 2, faint: 4, mute: 6, soft: 8, fg: 10 }

	return {
		base: dark ? 'dark' : 'light',
		vars: {
			'--bg': n[i.bg],
			'--bg-elev': n[i.elev],
			'--rule': n[i.rule],
			'--fg-faint': n[i.faint],
			'--fg-mute': n[i.mute],
			'--fg-soft': n[i.soft],
			'--fg': n[i.fg],
			'--accent': accent,
			'--match': alpha(hex, dark ? 0.3 : 0.16),
		},
	}
}

function applyBase(m) {
	for (const t of CUSTOM_TOKENS) root.style.removeProperty(t)
	root.dataset.theme = m
	store(MODE_KEY, m)
	syncAccent(
		getComputedStyle(root).getPropertyValue('--accent').trim() ||
			'#cc4400',
	)
	applyEditorScheme()
}

function applyCustom(hex) {
	const { base, vars } = customPalette(hex)
	// base picks the matching --cm-* syntax palette; inline vars below
	// override the neutral/brand tokens (inline beats the stylesheet).
	root.dataset.theme = base
	for (const k in vars) root.style.setProperty(k, vars[k])
	syncAccent(vars['--accent'])
	store(MODE_KEY, 'custom')
	store(SEED_KEY, hex)
	applyEditorScheme()
}

function applySpacing(v) {
	root.style.setProperty('--prose-scale', String(v))
	store(SPACE_KEY, String(v))
}

// Overlay the chosen scheme's `--cm-*` syntax tokens inline (inline beats
// the stylesheet), picking the light or dark variant from the active
// base. `auto` (or an unknown id) clears the overrides so the One-Light /
// One-Dark tokens from styles.css apply. Re-run after any base change so
// the variant tracks light/dark.
function applyEditorScheme() {
	const id = editorScheme.read()
	const s = schemeById.get(id)
	const variant =
		s && (root.dataset.theme === 'dark' ? s.dark : s.light)
	for (const k of TOKENS) {
		if (variant) root.style.setProperty('--cm-' + k, variant[k])
		else root.style.removeProperty('--cm-' + k)
	}
	store(SCHEME_KEY, s ? id : 'auto')
}

/** @param {'light' | 'dark' | 'custom'} m */
export function setMode(m) {
	mode.write(m)
	if (m === 'custom') applyCustom(seed.read())
	else applyBase(m)
}

/** @param {string} hex */
export function setSeed(hex) {
	if (!validateColor(hex)) return
	seed.write(hex)
	store(SEED_KEY, hex)
	if (mode.read() === 'custom') applyCustom(hex)
}

/** @param {number} v */
export function setSpacing(v) {
	spacing.write(v)
	applySpacing(v)
}

/** @param {string} id */
export function setEditorScheme(id) {
	editorScheme.write(id)
	applyEditorScheme()
}

// apply persisted state on load
if (mode.read() === 'custom') applyCustom(seed.read())
else applyBase(mode.read())
applySpacing(spacing.read())
