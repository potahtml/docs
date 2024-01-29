import {
	createSignal as signal,
	createEffect as effect,
	onCleanup as cleanup,
	createRoot as root,
	untrack,
} from './flimsy.js'

const insert = (child, parent, relative) => {
	relative ? relative.before(child) : parent.append(child)
	cleanup(() => child.remove())
	return child
}
const placeholder = (parent, relative) =>
	create(document.createTextNode(''), parent, relative)

const setAttribute = (node, name, value) => {
	node.setAttribute(name, value), (node[name] = value)
}
const withEffect = (child, parent, relative) => {
	relative = placeholder(parent, relative)
	let node
	effect(() => (node = create(getValue(child), parent, relative)))
	return [node, relative]
}
const getValue = value => {
	while (typeof value === 'function') value = value()
	return value
}
export const render = (child, parent = document.body) => {
	const dispose = root(disposer => {
		create(child, parent)
		return disposer
	})
	cleanup(dispose)
	return dispose
}
function create(child, parent, relative) {
	if (child instanceof Node) {
		if (child instanceof DocumentFragment) {
			return create(Array.from(child.childNodes), parent, relative)
		}
		return insert(child, parent, relative)
	}

	if (child === null || child === undefined) {
		return
	}

	if (typeof child === 'function') {
		return withEffect(
			() =>
				child.toString().startsWith('class')
					? untrack(() => new child())
					: child,
			parent,
			relative,
		)
	}

	if (typeof child === 'object') {
		if ('children' in child) {
			return create(child.children, parent, relative)
		}

		if (Symbol.iterator in child) {
			return Array.from(child.values()).map(child =>
				create(child, parent, relative),
			)
		}

		if ('render' in child && typeof child.render === 'function') {
			return withEffect(() => child.render(), parent, relative)
		}

		if ('then' in child) {
			const [read, write] = signal()
			relative = placeholder(parent, relative)
			child.then(child => relative.isConnected && write(child))
			return create(read, parent, relative)
		}

		return insert(
			document.createTextNode(
				'toString' in child
					? child.toString()
					: JSON.stringify(child),
			),
			parent,
			relative,
		)
	}

	return insert(
		document.createTextNode(child.toString()),
		parent,
		relative,
	)
}
