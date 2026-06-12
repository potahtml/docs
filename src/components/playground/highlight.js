// CodeMirror theme + syntax highlighting for the docs editor.
//
// Colors are CSS variables (see styles.css `--cm-*`) so the highlighting
// follows the site's light/dark toggle — there is no fixed dark theme.
// The editor color-scheme picker (theme.js / editor-schemes.js) overrides
// these same `--cm-*` tokens inline when a scheme other than "auto" is
// active. The editor chrome is transparent so it sits on the snippet
// window's own background.

import {
	HighlightStyle,
	syntaxHighlighting,
} from '@codemirror/language'
import { EditorView } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'

const highlightStyle = HighlightStyle.define([
	{
		tag: [t.comment, t.lineComment, t.blockComment, t.docComment],
		color: 'var(--cm-comment)',
		fontStyle: 'italic',
	},
	{
		tag: [
			t.keyword,
			t.modifier,
			t.controlKeyword,
			t.operatorKeyword,
			t.definitionKeyword,
			t.moduleKeyword,
		],
		color: 'var(--cm-keyword)',
	},
	{
		tag: [t.string, t.special(t.string), t.regexp],
		color: 'var(--cm-string)',
	},
	{
		tag: [t.number, t.bool, t.null, t.atom],
		color: 'var(--cm-number)',
	},
	{
		tag: [
			t.function(t.variableName),
			t.function(t.propertyName),
			t.labelName,
		],
		color: 'var(--cm-function)',
	},
	{
		tag: [
			t.variableName,
			t.propertyName,
			t.definition(t.variableName),
		],
		color: 'var(--cm-variable)',
	},
	{
		tag: [t.typeName, t.className, t.namespace, t.self],
		color: 'var(--cm-type)',
	},
	{ tag: [t.tagName, t.angleBracket], color: 'var(--cm-tag)' },
	{ tag: [t.attributeName], color: 'var(--cm-attribute)' },
	{
		tag: [
			t.operator,
			t.punctuation,
			t.separator,
			t.bracket,
			t.squareBracket,
			t.paren,
			t.brace,
			t.derefOperator,
		],
		color: 'var(--cm-punctuation)',
	},
	{ tag: [t.meta], color: 'var(--cm-comment)' },
	{ tag: [t.link, t.url], color: 'var(--accent)' },
	{ tag: [t.invalid], color: 'var(--accent)' },
])

const editorTheme = EditorView.theme({
	'&': {
		color: 'var(--fg)',
		backgroundColor: 'transparent',
		fontSize: '12px',
	},
	'.cm-content': {
		fontFamily: 'var(--font-mono)',
		caretColor: 'var(--fg)',
	},
	'.cm-scroller': {
		fontFamily: 'var(--font-mono)',
		lineHeight: '1.55',
	},
	'.cm-gutters': {
		backgroundColor: 'transparent',
		color: 'var(--fg-faint)',
		border: 'none',
		// a very faint shadow cast onto the editor, so the gutter reads
		// as a slightly recessed pane
		boxShadow: '6px 0 8px -6px rgba(0, 0, 0, 0.12)',
	},
	'.cm-activeLine, .cm-activeLineGutter': {
		backgroundColor: 'transparent',
	},
	'.cm-lineNumbers .cm-gutterElement': {
		color: 'var(--fg-faint)',
	},
	// !important: CM's focused rule (&light.cm-focused > .cm-scroller >
	// .cm-selectionLayer .cm-selectionBackground) is far more specific, so
	// a plain override only wins while unfocused. CM's value isn't
	// !important, so this beats it in both states.
	'&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
		{
			backgroundColor: 'var(--select) !important',
		},
	'.cm-cursor, .cm-dropCursor': {
		borderLeftColor: 'var(--fg)',
	},
	'.cm-matchingBracket': {
		backgroundColor: 'var(--match)',
		outline: 'none',
	},

	// tooltips (TS hover quick-info) + autocomplete dropdown
	'.cm-tooltip': {
		background: 'var(--bg-tooltip)',
		border: '1px solid var(--rule)',
		borderRadius: 'var(--radius)',
		color: 'var(--fg)',
		boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
	},
	'.cm-tooltip.cm-tooltip-autocomplete > ul': {
		fontFamily: 'var(--font-mono)',
		fontSize: '12px',
		maxHeight: '16em',
	},
	'.cm-tooltip-autocomplete > ul > li[aria-selected]': {
		background: 'var(--match)',
		color: 'var(--fg)',
	},
	'.cm-completionIcon': {
		color: 'var(--fg-mute)',
	},
	'.cm-completionDetail': {
		color: 'var(--fg-mute)',
		fontStyle: 'italic',
	},
	// when the tooltip doesn't fit the viewport, CM sets an explicit
	// height on this host — flex makes the section below actually
	// shrink to it instead of poking out of the box
	'.cm-tooltip.cm-tooltip-hover': {
		display: 'flex',
		flexDirection: 'column',
	},
	'.cm-ts-hover': {
		padding: '6px 8px',
		fontFamily: 'var(--font-mono)',
		fontSize: '12px',
		lineHeight: '1.5',
		maxWidth: '520px',
		whiteSpace: 'pre-wrap',
		// tall quick-info (lib.dom symbols like addEventListener) scrolls
		// instead of overflowing; scrollbar matches the editor scroller.
		// only vertically — anything too wide wraps (overflow-wrap
		// inherits into the sig/doc/code children)
		maxHeight: 'min(60vh, 400px)',
		minHeight: 0,
		overflowY: 'auto',
		overflowX: 'hidden',
		overflowWrap: 'anywhere',
		overscrollBehavior: 'contain',
		scrollbarWidth: 'thin',
		scrollbarColor: 'var(--rule) transparent',
	},
	'.cm-ts-hover::-webkit-scrollbar': {
		width: '8px',
	},
	'.cm-ts-hover::-webkit-scrollbar-thumb': {
		background: 'var(--rule)',
		borderRadius: '4px',
	},
	'.cm-ts-hover::-webkit-scrollbar-track': {
		background: 'transparent',
	},
	// syntax-colored signature at the top of the tooltip
	'.cm-ts-hover-sig': {
		color: 'var(--fg)',
	},
	// JSDoc description, below the signature
	'.cm-ts-hover-doc': {
		marginTop: '6px',
		paddingTop: '6px',
		borderTop: '1px solid var(--rule)',
		color: 'var(--fg-soft)',
	},
	// @param / @returns / @example / @see block
	'.cm-ts-hover-tags': {
		marginTop: '6px',
		paddingTop: '6px',
		borderTop: '1px solid var(--rule)',
		color: 'var(--fg-mute)',
	},
	'.cm-ts-hover-tag': {
		marginTop: '2px',
	},
	'.cm-ts-hover-tagname': {
		color: 'var(--cm-keyword)',
	},
	// @example body — wraps rather than scrolling sideways
	'.cm-ts-hover-code': {
		margin: '4px 0 0',
		padding: '6px 8px',
		background: 'var(--bg)',
		border: '1px solid var(--rule)',
		borderRadius: 'var(--radius-sm)',
		color: 'var(--fg)',
		whiteSpace: 'pre-wrap',
	},
	'.cm-ts-hover a': {
		color: 'var(--accent)',
		textDecoration: 'underline',
		cursor: 'pointer',
	},

	// lint diagnostics
	'.cm-diagnostic': {
		fontFamily: 'var(--font-mono)',
		fontSize: '12px',
	},
	'.cm-diagnostic-error': {
		borderLeftColor: '#e45649',
	},
	'.cm-diagnostic-warning': {
		borderLeftColor: '#c18401',
	},
	'.cm-lintRange-error': {
		backgroundImage: 'none',
		borderBottom: '1px dotted #e45649',
	},
	'.cm-lintRange-warning': {
		backgroundImage: 'none',
		borderBottom: '1px dotted #c18401',
	},
})

export const highlight = [
	editorTheme,
	syntaxHighlighting(highlightStyle),
]
