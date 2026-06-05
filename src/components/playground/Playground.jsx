import { signal, effect, ref, cleanup } from 'pota'
import { Splitter } from 'pota/components'
import { copyToClipboard } from 'pota/use/string'
import styles from './Playground.module.css'
import { mode, accent } from '../theme.js'
import { Sep } from '../Sep.jsx'
import { Editor } from './Editor.jsx'
import { EditorScheme } from './EditorScheme.jsx'
import { Tabs } from './Tabs.jsx'
import { transform } from './transform.js'
import { compress } from './compress.js'

const isCss = name => name.endsWith('.css')

const extFor = lang =>
	lang === 'css'
		? '.css'
		: lang === 'ts'
			? '.ts'
			: lang === 'js'
				? '.js'
				: '.tsx'

const langForName = name =>
	name.endsWith('.css')
		? 'css'
		: name.endsWith('.ts')
			? 'ts'
			: name.endsWith('.js')
				? 'js'
				: name.endsWith('.jsx')
					? 'jsx'
					: 'tsx'

const defaultMainName = lang =>
	lang === 'css' ? 'styles.css' : 'app' + extFor(lang)

// footer badge: the editor treats jsx as tsx, so show them as one
const badgeLang = lang => (lang === 'jsx' ? 'tsx' : lang)

const THEME_VARS = ['--bg', '--fg', '--accent', '--rule']

// The current site theme as preview URL params: the base name plus the
// resolved palette, so the iframe matches even in custom-accent mode and
// a standalone "open in blank" tab is themed too.
const themeQuery = () => {
	const root = document.documentElement
	const cs = getComputedStyle(root)
	const p = new URLSearchParams()
	if (root.dataset.theme) p.set('theme', root.dataset.theme)
	for (const name of THEME_VARS) {
		const v = cs.getPropertyValue(name).trim()
		if (v) p.set(name.slice(2), v) // '--bg' → 'bg'
	}
	return p.toString()
}

// entry = the file that actually runs; first non-css, else first
const pickEntry = files =>
	(files.find(f => !isCss(f.name)) || files[0] || {}).name

/**
 * Compile every file and package a payload the preview iframe can run:
 * a single non-css file ships as a bare code string; anything else ships
 * as `{ entry, modules }`. CSS is passed through untransformed.
 */
async function buildPayload(files, entry) {
	const pairs = await Promise.all(
		files.map(f =>
			isCss(f.name)
				? Promise.resolve([f.name, f.source])
				: transform(f.source).then(code => [f.name, code]),
		),
	)
	if (files.length === 1 && !isCss(files[0].name)) {
		return compress(pairs[0][1])
	}
	return compress({ entry, modules: Object.fromEntries(pairs) })
}

/**
 * Live, editable example: window chrome (colored dots + file tabs) with a
 * code/transformed toggle, an editable editor, and an isolated preview
 * iframe on the right.
 *
 * @param {{
 *   files: { name: string, lang?: string, source: string }[],
 *   entry?: string,
 *   fullPage?: boolean,
 *   'on:change'?: (
 *     files: { name: string, lang: string, source: string }[],
 *     entry: string,
 *   ) => void,
 * }} props
 */
export function Playground(props) {
	// Every file needs a real name (tabs, imports, TS paths). A lone
	// unnamed markdown fence becomes app.tsx (or styles.css).
	const initial = (props.files || []).map((f, i) => {
		const name =
			f.name ||
			(i === 0
				? defaultMainName(f.lang)
				: 'file' + i + extFor(f.lang))
		return {
			name,
			lang: f.lang || langForName(name),
			source: f.source || '',
		}
	})

	let entry =
		props.entry && initial.some(f => f.name === props.entry)
			? props.entry
			: pickEntry(initial)

	// `current` is the plain, always-latest snapshot the preview is built
	// from; `filesSig` is its reactive mirror for the editor + transformed
	// tab. Keeping `current` un-tracked lets the mount effect below fire
	// once (on iframe ready) instead of on every keystroke — re-running on
	// edit is gated by `autorun` instead.
	let current = initial
	const filesSig = signal(initial)
	const active = signal(entry || initial[0]?.name || '')
	const view = signal('code') // 'code' | 'transformed'
	const transformed = signal('')
	const autorun = signal(true)

	const frame = ref()

	// ---- zoom: click the editor to have the playground take over the
	// viewport; click the backdrop (or press Escape) to return it to its
	// spot. The open/close geometry is animated imperatively (FLIP: pin to
	// the current rect, then transition to a centred 95vh box) so the
	// measure → mutate → measure sequence stays synchronous.
	const root = ref()

	const DURATION = 320
	// elevated shadow for the zoomed state; applied inline (not in CSS) so
	// it transitions with the geometry instead of snapping during the pin
	const ZOOM_SHADOW = '0 24px 80px rgba(0, 0, 0, 0.5)'
	let isOpen = false
	let placeholder = null
	let backdrop = null
	let keyHandler = null
	let timer = null
	let locked = false
	let prevOverflow = ''
	let prevPaddingRight = ''
	// remembered zoom width (px) so a window the user widened reopens at
	// that size; null = the default centred box
	let zoomWidth = null
	// teardown for an in-progress edge drag, run if we unmount mid-drag
	let resizeCleanup = null

	const MIN_ZOOM_WIDTH = 480

	const finalRect = () => {
		const vw = window.innerWidth
		const vh = window.innerHeight
		const height = Math.round(vh * 0.95)
		const width = Math.round(
			zoomWidth != null
				? Math.min(Math.max(zoomWidth, MIN_ZOOM_WIDTH), vw)
				: Math.min(vw * 0.95, 1100),
		)
		return {
			top: Math.round((vh - height) / 2),
			left: Math.round((vw - width) / 2),
			width,
			height,
		}
	}

	const setBox = (el, r) => {
		el.style.top = r.top + 'px'
		el.style.left = r.left + 'px'
		el.style.width = r.width + 'px'
		el.style.height = r.height + 'px'
	}

	const open = () => {
		const el = root()
		if (!el || isOpen) return
		isOpen = true
		clearTimeout(timer)

		const first = el.getBoundingClientRect()

		// placeholder keeps the in-flow space (and margins) so the page
		// below doesn't jump when the window goes fixed
		if (!placeholder) {
			placeholder = document.createElement('div')
			el.parentNode.insertBefore(placeholder, el)
		}
		const cs = getComputedStyle(el)
		placeholder.style.marginTop = cs.marginTop
		placeholder.style.marginBottom = cs.marginBottom
		placeholder.style.width = first.width + 'px'
		placeholder.style.height = first.height + 'px'

		if (!backdrop) {
			backdrop = document.createElement('div')
			backdrop.className = styles.backdrop
			backdrop.addEventListener('click', close)
			document.body.appendChild(backdrop)
		}
		// next frame so the fade-in transition has a 0 → 0.6 edge to run
		requestAnimationFrame(
			() => backdrop && backdrop.classList.add(styles.backdropOn),
		)

		// lock page scroll; pad for the lost scrollbar so the content
		// behind the backdrop doesn't shift while it fades in. Guarded so a
		// reopen mid-close doesn't re-capture the already-locked values.
		if (!locked) {
			locked = true
			const doc = document.documentElement
			const sbw = window.innerWidth - doc.clientWidth
			prevOverflow = doc.style.overflow
			prevPaddingRight = doc.style.paddingRight
			doc.style.overflow = 'hidden'
			if (sbw > 0) doc.style.paddingRight = sbw + 'px'
		}

		if (!keyHandler) {
			keyHandler = e => e.key === 'Escape' && close()
			document.addEventListener('keydown', keyHandler)
		}

		// pin to the current rect with no transition, force a reflow so it
		// commits, then transition to the final centred box
		el.classList.add(styles.zoomed)
		el.style.transition = 'none'
		setBox(el, first)
		el.getBoundingClientRect()
		el.style.transition = ''
		el.style.boxShadow = ZOOM_SHADOW
		setBox(el, finalRect())
	}

	const finishClose = () => {
		const el = root()
		if (el) {
			el.classList.remove(styles.zoomed)
			el.style.transition = ''
			el.style.boxShadow = ''
			el.style.top = ''
			el.style.left = ''
			el.style.width = ''
			el.style.height = ''
		}
		if (placeholder && placeholder.parentNode) {
			placeholder.parentNode.removeChild(placeholder)
		}
		placeholder = null
		if (backdrop && backdrop.parentNode) {
			backdrop.parentNode.removeChild(backdrop)
		}
		backdrop = null
		if (locked) {
			locked = false
			document.documentElement.style.overflow = prevOverflow
			document.documentElement.style.paddingRight = prevPaddingRight
		}
		if (keyHandler) {
			document.removeEventListener('keydown', keyHandler)
			keyHandler = null
		}
	}

	const close = () => {
		const el = root()
		if (!el || !isOpen) return
		isOpen = false
		clearTimeout(timer)

		// animate back to the placeholder's (current) rect
		const target = (placeholder || el).getBoundingClientRect()
		el.style.transition = ''
		el.style.boxShadow = '' // → resting shadow, animates with the geometry
		setBox(el, target)
		if (backdrop) backdrop.classList.remove(styles.backdropOn)
		timer = setTimeout(finishClose, DURATION + 30)
	}

	// ---- horizontal resize: drag either vertical edge to grow/shrink the
	// zoomed window symmetrically about its centre — both sides move at
	// once, so it stays centred (down to MIN_ZOOM_WIDTH, up to the full
	// viewport). Native CSS `resize` is corner-anchored (grows only toward
	// one corner), so edge handles are what gives the both-sides feel.
	// Pointer capture keeps the drag alive over the preview iframe, which
	// would otherwise swallow the move events. The width is remembered for
	// the next open.
	const startResize = (side, e) => {
		const el = root()
		if (!el || !isOpen) return
		e.preventDefault()
		e.stopPropagation()

		const handle = e.currentTarget
		handle.setPointerCapture?.(e.pointerId)

		const startX = e.clientX
		const startWidth = el.getBoundingClientRect().width
		const vw = window.innerWidth
		// dragging the right edge out (→) or the left edge out (←) both widen
		const dir = side === 'right' ? 1 : -1

		el.style.transition = 'none' // track the pointer 1:1
		document.body.style.userSelect = 'none'

		const onMove = ev => {
			const reach = (ev.clientX - startX) * dir
			const width = Math.max(
				MIN_ZOOM_WIDTH,
				Math.min(startWidth + reach * 2, vw),
			)
			el.style.width = width + 'px'
			el.style.left = Math.round((vw - width) / 2) + 'px'
		}

		const finish = () => {
			handle.removeEventListener('pointermove', onMove)
			handle.removeEventListener('pointerup', finish)
			handle.removeEventListener('pointercancel', finish)
			handle.releasePointerCapture?.(e.pointerId)
			el.style.transition = ''
			document.body.style.userSelect = ''
			zoomWidth = el.getBoundingClientRect().width
			resizeCleanup = null
		}

		resizeCleanup = finish
		handle.addEventListener('pointermove', onMove)
		handle.addEventListener('pointerup', finish)
		handle.addEventListener('pointercancel', finish)
	}

	cleanup(() => {
		clearTimeout(timer)
		if (resizeCleanup) resizeCleanup()
		if (isOpen) finishClose()
	})

	// Re-centre the zoomed window when the browser window is resized:
	// it's `position: fixed` with explicit top/left, so without this it
	// keeps its old coordinates and drifts off-centre (or off-screen) as
	// the viewport changes. Snap with no transition so it tracks a live
	// drag-resize 1:1; finalRect() also re-clamps a remembered width to vw.
	const onWindowResize = () => {
		const el = root()
		if (!el || !isOpen) return
		el.style.transition = 'none'
		setBox(el, finalRect())
		el.getBoundingClientRect()
		el.style.transition = ''
	}
	window.addEventListener('resize', onWindowResize)
	cleanup(() => window.removeEventListener('resize', onWindowResize))

	const fileList = () => filesSig.read()
	const currentFile = () =>
		fileList().find(f => f.name === active.read()) ||
		fileList()[0] || { name: '', lang: '', source: '' }

	// Build from `current` and swap the iframe hash (new code →
	// hashchange → preview reloads). When the code is unchanged, force a
	// reload so "re-run" still re-executes.
	let runId = 0
	let appliedSrc = ''
	const run = () => {
		const f = frame()
		if (!f) return
		const id = ++runId
		const query = themeQuery()
		buildPayload(current, entry).then(payload => {
			if (id !== runId) return // a newer run superseded this one
			const src =
				'/preview.html' + (query ? '?' + query : '') + '#' + payload
			if (src === appliedSrc) {
				f.contentWindow?.location.reload()
			} else {
				appliedSrc = src
				f.src = src
			}
		})
	}

	// Open the running preview in a new tab, re-stamping the current theme
	// onto the URL (a live theme toggle leaves the iframe's own src stale).
	const openInBlank = () => {
		if (!frame() || !appliedSrc) return
		const hash = appliedSrc.split('#')[1] || ''
		const query = themeQuery()
		window.open(
			'/preview.html' + (query ? '?' + query : '') + '#' + hash,
		)
	}

	// Copy a shareable /playground link for the current editor state. Built
	// fresh from `current` (not `location.href`) so it's correct even right
	// after a keystroke — and so an inline example (which never writes the
	// hash itself) still yields a working link. Always targets the standalone
	// /playground route, whose PlaygroundPage rehydrates the `{ entry, files }`
	// payload from the hash; on /playground itself this matches the live URL.
	const copied = signal(false)
	let copiedTimer
	const copyLink = () => {
		const payload = compress({ entry, files: current })
		const url = window.location.origin + '/playground#' + payload
		copyToClipboard(url).then(() => {
			copied.write(true)
			clearTimeout(copiedTimer)
			copiedTimer = setTimeout(() => copied.write(false), 1500)
		})
	}
	cleanup(() => clearTimeout(copiedTimer))

	// Surface the current file set to the host (the standalone
	// /playground mirrors it into the URL so an edited example is
	// shareable). Fired on every structural or content change.
	const notify = () => props['on:change']?.(current, entry)

	const updateFile = (name, source) => {
		current = current.map(f =>
			f.name === name ? { ...f, source } : f,
		)
		filesSig.write(current)
		notify()
		if (autorun.read()) run()
	}

	const toggleAutorun = () => {
		const next = !autorun.read()
		autorun.write(next)
		if (next) run() // apply pending edits the moment autorun turns on
	}

	// ---- file management ----

	let addSeq = initial.length
	const addFile = () => {
		let name
		do {
			addSeq++
			name = 'file' + addSeq + '.tsx'
		} while (current.some(f => f.name === name))
		current = [...current, { name, lang: 'tsx', source: '' }]
		filesSig.write(current)
		active.write(name)
		notify()
	}

	const renameFile = (oldName, nextName) => {
		const name = nextName.trim()
		if (!name || name === oldName) return
		if (current.some(f => f.name === name)) return // name taken
		current = current.map(f =>
			f.name === oldName
				? { ...f, name, lang: langForName(name) }
				: f,
		)
		filesSig.write(current)
		if (active.read() === oldName) active.write(name)
		if (entry === oldName) entry = name
		notify()
		if (autorun.read()) run()
	}

	const deleteFile = name => {
		if (current.length <= 1) return // keep at least one file
		const idx = current.findIndex(f => f.name === name)
		current = current.filter(f => f.name !== name)
		filesSig.write(current)
		if (active.read() === name) {
			const next = current[Math.max(0, idx - 1)] || current[0]
			active.write(next.name)
		}
		if (entry === name) entry = pickEntry(current)
		notify()
		if (autorun.read()) run()
	}

	// Initial render once the iframe mounts. Tracks only `frame()`.
	effect(() => {
		if (frame()) run()
	})

	// Push live theme changes to an already-open preview (no re-run).
	// Reads mode + accent so it fires on light/dark and custom-accent
	// changes alike; the initial theme rides in via the run() URL.
	effect(() => {
		mode.read()
		accent.read()
		const f = frame()
		if (!f || !f.contentWindow) return
		const cs = getComputedStyle(document.documentElement)
		const vars = {}
		for (const name of THEME_VARS) {
			const v = cs.getPropertyValue(name).trim()
			if (v) vars[name] = v
		}
		f.contentWindow.postMessage(
			JSON.stringify({
				messageKind: 'theme',
				theme: document.documentElement.dataset.theme || '',
				vars,
			}),
			'*',
		)
	})

	// ---- transformed tab: compile the active file on demand ----

	effect(() => {
		if (view.read() !== 'transformed') return
		const file = currentFile()
		transform(file.source).then(code => transformed.write(code))
	})

	const viewBtn = which => () =>
		styles.viewBtn +
		(view.read() === which ? ' ' + styles.active : '')

	const windowClass =
		styles.window + (props.fullPage ? ' ' + styles.fullPage : '')

	return (
		<div class={windowClass} use:ref={root}>
			{/* edge grips for widening the zoomed ("active") window; inert
			    (display:none) until zoomed — see Playground.module.css */}
			<span
				class={styles.resizeHandle + ' ' + styles.resizeLeft}
				on:pointerdown={e => startResize('left', e)}
			/>
			<span
				class={styles.resizeHandle + ' ' + styles.resizeRight}
				on:pointerdown={e => startResize('right', e)}
			/>

			<div class={styles.head}>
				<span class={styles.dots}>
					<span class={styles.close} />
					<span class={styles.min} />
					<span class={styles.max} />
				</span>

				<div class={styles.tabbar}>
					<Tabs
						files={fileList}
						activeFile={active.read}
						canDelete={() => fileList().length > 1}
						on:select={name => active.write(name)}
						on:rename={renameFile}
						on:delete={deleteFile}
						on:add={addFile}
					/>
				</div>

				<div class={styles.actions}>
					<button
						type="button"
						class={() =>
							styles.toggle + (autorun.read() ? ' ' + styles.on : '')
						}
						aria-pressed={() => (autorun.read() ? 'true' : 'false')}
						on:click={toggleAutorun}
					>
						autorun
					</button>
					<Sep />
					<a href="javascript://" on:click={run}>
						re-run
					</a>
					<Sep />
					<a href="javascript://" on:click={openInBlank}>
						open in blank ↗
					</a>
					<Sep />
					<a href="javascript://" on:click={copyLink}>
						{() => (copied.read() ? 'copied' : 'copy link')}
					</a>
				</div>
			</div>

			<div class={styles.body}>
				<div class={styles.editorPane} on:click={open}>
					{() =>
						view.read() === 'transformed' ? (
							<Editor
								editable={false}
								fill={true}
								files={() => [
									{
										name: 'transformed.js',
										lang: 'js',
										source: transformed.read(),
									},
								]}
								activeFile={() => 'transformed.js'}
							/>
						) : (
							<Editor
								editable={true}
								typescript={true}
								files={fileList}
								activeFile={active.read}
								on:change={updateFile}
							/>
						)
					}
				</div>

				<Splitter
					class={styles.splitter}
					orientation="vertical"
					target="prev"
					min={220}
				/>

				<div class={styles.previewPane}>
					<iframe
						loading="lazy"
						title="Live preview"
						use:ref={frame}
					/>
				</div>
			</div>

			<div class={styles.foot}>
				<div class={styles.views} role="group">
					<button
						class={viewBtn('code')}
						on:click={() => view.write('code')}
					>
						code
					</button>
					<button
						class={viewBtn('transformed')}
						on:click={() => view.write('transformed')}
					>
						transformed
					</button>
				</div>
				<span class={styles.right}>
					<EditorScheme />
					<Sep />
					<span class={styles.lang}>
						{() => badgeLang(currentFile().lang)}
					</span>
				</span>
			</div>
		</div>
	)
}
