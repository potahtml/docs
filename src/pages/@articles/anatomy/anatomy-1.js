// https://pota.quack.uy/Articles/anatomy-of-a-signals-based-reactive-renderer

export { createSignal as signal } from './flimsy.js'

export const insert = (child, parent, relative) => {
	relative ? relative.before(child) : parent.append(child)
	return child
}
export const placeholder = (parent, relative) => {
	const placeholder = document.createElement('span')
	placeholder.style.color = 'aquamarine'
	placeholder.textContent = 'placeholder'
	return create(placeholder, parent, relative)
}
export const create = (child, parent, relative) => {
	if (child === null || child === undefined) {
		return
	}

	if (child instanceof Node) {
		return insert(child, parent, relative)
	}

	if (typeof child === 'function') {
		return create(child(), parent, relative)
	}

	if (typeof child === 'object') {
		if ('then' in child) {
			relative = placeholder(parent, relative)

			return child.then(result => {
				create(result, parent, relative)
			})
		}
	}

	return insert(document.createTextNode(child), parent, relative)
}
