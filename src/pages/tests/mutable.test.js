/**
 * References:
 * https://github.com/potahtml/pota/tree/master/src/lib/reactivity/store
 *
 * https://github.com/solidjs/solid/blob/main/packages/solid/store/test/
 * https://github.com/solidjs-community/solid-primitives/tree/main/packages/mutable/test
 * https://github.com/vobyjs/oby/blob/master/test/index.js
 * `https://github.com/vuejs/core/tree/main/packages/reactivity/__tests__`
 * https://discord.com/channels/722131463138705510/1217920934548082748
 * ^ https://discord.com/invite/solidjs
 */

// test stuff

import { test, isProxy } from 'pota/test'

// oby

import $, {
	effect as effectOby2,
	store as mutableOby,
	memo as memoOby,
	batch as batchOby,
	root as rootOby,
} from 'https://jspm.dev/oby'

const signalOby = initialValue => {
	const s = $(initialValue)
	return [() => s(), s]
}

const effectOby = fn => effectOby2(fn, { sync: true })

// solid

import {
	createRenderEffect as effectSolid,
	createMemo as memoSolid2,
	batch as batchSolid,
	createSignal as signalSolid,
	createRoot as rootSolid,
} from 'https://jspm.dev/npm:solid-js'

import { createMutable as mutableSolid } from 'https://jspm.dev/npm:solid-js/store'

function memoSolid(fn) {
	const [sleeping, setSleeping] = signalSolid(true)
	const m = memoSolid2(() => {
		if (sleeping()) return
		return fn()
	})

	let read = () => {
		setSleeping(false)
		read = m
		return m()
	}
	return () => read()
}

// pota

import {
	renderEffect as effectPota,
	mutable as mutablePota,
	memo as memoPota,
	batch as batchPota,
	signal as signalPota,
	root as rootPota,
} from 'pota'

// tests

testMutable(
	'solid',
	effectSolid,
	mutableSolid,
	memoSolid,
	batchSolid,
	signalSolid,
	rootSolid,
)

testMutable(
	'oby',
	effectOby,
	mutableOby,
	memoOby,
	batchOby,
	signalOby,
	rootOby,
)

testMutable(
	'pota',
	effectPota,
	mutablePota,
	memoPota,
	batchPota,
	signalPota,
	rootPota,
)

function testMutable(
	lib,
	effect,
	mutable,
	memo,
	batch,
	signal,
	root,
) {
	lib = lib + ': '
	console.log(lib)

	test.resetCounter()

	test(lib + 'equality: different object', expect => {
		const source = { cat: 'quack' }
		const result = mutable(source)
		expect(result).not.toBe(source)
		expect(isProxy(result)).toBe(true)
		expect(isProxy(source)).toBe(false)
	})

	test(lib + 'equality: different object nested', expect => {
		const source = { cat: 'quack' }
		const result = mutable({ source })
		expect(result.source).not.toBe(source)
		expect(isProxy(result.source)).toBe(true)
	})

	// value

	test(lib + 'value: object property', expect => {
		const source = { cat: 'quack' }
		const result = mutable(source)

		expect(source.cat).toBe('quack')
		expect(result.cat).toBe('quack')
		expect(isProxy(result)).toBe(true)
	})

	// mutation

	test(lib + 'mutation: object property', expect => {
		const source = { cat: 'quack' }
		const result = mutable(source)

		expect(source.cat).toBe('quack')
		expect(result.cat).toBe('quack')

		result.cat = 'murci'
		expect(source.cat).toBe('murci')
		expect(result.cat).toBe('murci')
	})

	test(lib + 'mutation: object nested', expect => {
		const source = mutable({
			data: { starting: 1, ending: 1 },
		})

		expect(source.data.starting).toBe(1)
		expect(source.data.ending).toBe(1)

		source.data.ending = 2
		expect(source.data.starting).toBe(1)
		expect(source.data.ending).toBe(2)

		source.data.starting = 2
		expect(source.data.starting).toBe(2)
		expect(source.data.ending).toBe(2)
	})

	test(lib + 'mutation: object frozen [oby]', expect => {
		const source = mutable(
			Object.freeze({
				user: { name: 'John', last: 'Snow' },
			}),
		)

		expect(source.user.name).toBe('John')

		expect(source.user.last).toBe('Snow')

		let called = 0

		effect(() => {
			called++

			source.user.name
			source.user.last
		})

		expect(called).toBe(1)

		source.user.name = 'quack'
		expect(called).toBe(2)

		source.user.last = 'murci'

		expect(called).toBe(3)

		expect(source.user.name).toBe('quack')
		expect(source.user.last).toBe('murci')

		try {
			source.user = 'something else'
			// solid by design modifies frozen objects
			if (lib !== 'solid: ') {
				expect('frozen value to not be changed').toBe(true)
			}
		} catch (e) {
			// this is expected to fail
		}
	})

	test(lib + 'mutation: object frozen nested [oby]', expect => {
		const source = mutable({
			data: Object.freeze({
				user: { name: 'John', last: 'Snow' },
			}),
		})

		let called = 0

		effect(() => {
			called++

			source.data.user.name
			source.data.user.last
		})

		expect(called).toBe(1)

		expect(source.data.user.name).toBe('John')
		expect(source.data.user.last).toBe('Snow')

		source.data.user.name = 'quack'
		expect(called).toBe(2)

		source.data.user.last = 'murci'
		expect(called).toBe(3)

		expect(source.data.user.name).toBe('quack')
		expect(source.data.user.last).toBe('murci')

		try {
			source.data.user = 'something else'
			// solid by design modifies frozen objects
			if (lib !== 'solid: ') {
				expect('frozen value to not be changed').toBe(true)
			}
		} catch (e) {
			// this is expected to fail
		}
	})

	test(
		lib + 'mutation: object frozen within frozen nested [oby]',
		expect => {
			const source = mutable(
				Object.freeze({
					data: Object.freeze({
						user: { store: { name: 'John', last: 'Snow' } },
					}),
				}),
			)

			let called = 0

			effect(() => {
				called++

				source.data.user.store.name
				source.data.user.store.last
			})

			expect(called).toBe(1)

			expect(source.data.user.store.name).toBe('John')
			expect(source.data.user.store.last).toBe('Snow')

			source.data.user.store.name = 'quack'
			expect(called).toBe(2)

			source.data.user.store.last = 'murci'
			expect(called).toBe(3)

			expect(source.data.user.store.name).toBe('quack')
			expect(source.data.user.store.last).toBe('murci')

			try {
				source.data.user = 'something else'
				// solid by design modifies frozen objects
				if (lib !== 'solid: ') {
					expect('frozen value to not be changed').toBe(true)
				}
			} catch (e) {
				// this is expected to fail
			}
		},
	)

	test(lib + 'mutation: function', expect => {
		const result = mutable({
			fn: () => 1,
		})
		const getValue = memo(() => result.fn())
		expect(getValue()).toBe(1)

		// pota wont trigger changes with functions
		result.fn = () => 2
		if (lib === 'pota: ') {
			expect(getValue()).toBe(1)
		} else {
			expect(getValue()).toBe(2)
		}
	})
	test(
		lib +
			'mutation: returned object by function call is mutable [solid, oby]',
		expect => {
			const result = mutable({
				fn: () => ({
					cat: 'quack',
				}),
			})

			expect(result.fn().cat).toBe('quack')

			expect(isProxy(result.fn())).toBe(true)

			const r = result.fn()
			expect(r.cat).toBe('quack')

			let calls = 0
			effect(() => {
				calls++
				r.cat
			})
			expect(calls).toBe(1)

			r.cat = 'murci'
			expect(r.cat).toBe('murci')
			expect(calls).toBe(2)
		},
	)

	// getters

	test(lib + 'getters: object', expect => {
		const result = mutable({
			cat: 'quack',
			get greeting() {
				return `hi, ${this.cat}`
			},
		})
		expect(result.greeting).toBe('hi, quack')

		result.cat = 'murci'
		expect(result.greeting).toBe('hi, murci')
	})

	test(lib + 'getters: returning object [solid]', expect => {
		let value = 'quack'
		const result = mutable({
			get greeting() {
				return { greet: `hi, ${value}` }
			},
			set greeting(val) {
				value = val
			},
		})
		expect(result.greeting.greet).toBe('hi, quack')
		result.greeting = 'murci'
		expect(result.greeting.greet).toBe('hi, murci')
	})

	test(lib + 'getters: returning getter [solid]', expect => {
		let value = 'quack'
		const result = mutable({
			get greeting() {
				return {
					get greet() {
						return `hi, ${value}`
					},
				}
			},
			set greeting(val) {
				value = val
			},
		})
		expect(result.greeting.greet).toBe('hi, quack')
		result.greeting = 'murci'
		expect(result.greeting.greet).toBe('hi, murci')
	})

	test(lib + 'getters: returning frozen object [solid]', expect => {
		let value = 'quack'
		const result = mutable({
			get greeting() {
				return Object.freeze({ greet: `hi, ${value}` })
			},
			set greeting(val) {
				value = val
			},
		})
		expect(result.greeting.greet).toBe('hi, quack')
		result.greeting = 'murci'
		expect(result.greeting.greet).toBe('hi, murci')
	})

	test(
		lib + 'getters: returning frozen object nested [solid]',
		expect => {
			let value = 'quack'
			const result = mutable({
				get greeting() {
					return Object.freeze({
						greet: Object.freeze({ text: `hi, ${value}` }),
					})
				},
				set greeting(val) {
					value = val
				},
			})
			expect(result.greeting.greet.text).toBe('hi, quack')
			result.greeting = 'murci'
			expect(result.greeting.greet.text).toBe('hi, murci')
		},
	)

	test(lib + 'getter/setters: class', expect => {
		class Cat {
			#name = 'quack'
			get name() {
				return this.#name
			}
			set name(value) {
				this.#name = value
			}
			get greeting() {
				return `hi, ${this.#name}`
			}
		}
		const result = mutable(new Cat())
		expect(result.greeting).toBe('hi, quack')

		result.name = 'mishu'
		expect(result.greeting).toBe('hi, mishu')
	})

	test(lib + 'getter/setters: class 2', expect => {
		class Cat {
			#name = 'quack'
			get name() {
				return this.#name
			}
			set name(value) {
				this.#name = value
			}
			get greeting() {
				return `hi, ${this.#name}`
			}
		}
		const result = mutable(new Cat())
		expect(result.greeting).toBe('hi, quack')
		expect(result.name).toBe('quack')

		let calls = 0
		effect(() => {
			calls++
			result.name
		})
		expect(calls).toBe(1)

		result.name = 'mishu'
		expect(result.name).toBe('mishu')
		expect(calls).toBe(2)

		expect(result.greeting).toBe('hi, mishu')
	})

	test(
		lib +
			'getter/setters: class, should fail when trying to set in a getter',
		expect => {
			class Cat {
				#name = 'quack'
				get name() {
					return this.#name
				}
				get greeting() {
					return `hi, ${this.#name}`
				}
			}
			const result = mutable(new Cat())
			expect(result.greeting).toBe('hi, quack')

			let fail = false
			try {
				result.name = 'mishu'
				fail = true
			} catch (e) {}

			expect(result.greeting).toBe('hi, quack')

			if (fail) {
				throw 'it should have failed to set the value when its only a getter'
			}
		},
	)

	test(lib + 'getter/setters: object', expect => {
		const result = mutable({
			name: 'John',
			last: 'Smith',
			get full() {
				return `${this.name} ${this.last}`
			},
			set full(value) {
				const parts = value.split(' ')
				this.name = parts[0]
				this.last = parts[1]
			},
		})
		expect(result.name).toBe('John')
		expect(result.last).toBe('Smith')
		expect(result.full).toBe('John Smith')

		result.name = 'Jake'
		expect(result.name).toBe('Jake')
		expect(result.last).toBe('Smith')
		expect(result.full).toBe('Jake Smith')

		result.last = 'Lala'
		expect(result.name).toBe('Jake')
		expect(result.last).toBe('Lala')
		expect(result.full).toBe('Jake Lala')

		result.full = 'Bogi One'
		expect(result.name).toBe('Bogi')
		expect(result.last).toBe('One')
		expect(result.full).toBe('Bogi One')
	})

	// deleting

	test(lib + 'deleting: undefined object property', expect => {
		const result = mutable({
			name: 'quack',
		})

		expect('last' in result).toBe(false)
		delete result.last
		expect('last' in result).toBe(false)

		expect(result.last).toBe(undefined)
	})

	test(
		lib + 'deleting: should throw when non-configurable',
		expect => {
			const result = mutable({})

			Object.defineProperty(result, 'cat', {
				value: 'quack',
				configurable: false,
				writable: false,
			})

			try {
				delete result.cat
				expect(
					'to throw when deleting a non-configurable property',
				).toBe(true)
			} catch (e) {}
		},
	)

	test(
		lib + 'setting to undefined shouldnt delete the property [solid]',
		expect => {
			const result = mutable({
				name: 'quack',
			})
			expect('name' in result).toBe(true)

			result.name = undefined
			expect('name' in result).toBe(true)
			expect(result.name).toBe(undefined)
			expect('name' in result).toBe(true)

			delete result.name
			expect('name' in result).toBe(false)
			expect(result.name).toBe(undefined)
			expect('name' in result).toBe(false)
		},
	)

	test(
		lib +
			'delete key with undefined value does trigger reactivity - object.keys ',
		expect => {
			const result = mutable({ a: 'somevalue', b: undefined })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)

			let calls = 0
			effect(() => {
				calls++
				Object.keys(result)
			})
			expect(calls).toBe(1)

			delete result.b
			expect('b' in result).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'delete non existent key doesnt trigger reactivity - object.keys  [solid]',
		expect => {
			const result = mutable({ a: 'somevalue' })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(false)

			let calls = 0
			effect(() => {
				calls++
				Object.keys(result)
			})
			expect(calls).toBe(1)

			expect('b' in result).toBe(false)
			expect(calls).toBe(1)

			delete result.b
			expect('b' in result).toBe(false)
			expect(calls).toBe(1)
		},
	)

	test(
		lib +
			'delete non existent key doesnt trigger reactivity - value [solid]',
		expect => {
			const result = mutable({ a: 'somevalue' })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(false)

			let calls = 0
			effect(() => {
				calls++
				result.b
			})
			expect(calls).toBe(1)

			expect('b' in result).toBe(false)
			expect(calls).toBe(1)

			delete result.b
			expect('b' in result).toBe(false)
			expect(calls).toBe(1)
		},
	)

	test(
		lib + 'delete non existent key doesnt trigger reactivity - in',
		expect => {
			const result = mutable({ a: 'somevalue' })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(false)

			let calls = 0
			effect(() => {
				calls++
				'b' in result
			})
			expect(calls).toBe(1)

			expect('b' in result).toBe(false)
			expect(calls).toBe(1)

			delete result.b
			expect('b' in result).toBe(false)
			expect(calls).toBe(1)
		},
	)

	test(
		lib +
			'delete key with defined value does trigger reactivity - object.keys ',
		expect => {
			const result = mutable({ a: 'somevalue', b: undefined })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)

			let calls = 0
			effect(() => {
				calls++
				Object.keys(result)
			})
			expect(calls).toBe(1)

			delete result.a
			expect('a' in result).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'delete key with undefined value does not trigger reactivity - reading [solid]',
		expect => {
			const result = mutable({ a: 'somevalue', b: undefined })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)

			let calls = 0
			effect(() => {
				calls++
				result.b
			})
			expect(calls).toBe(1)

			delete result.b
			expect('b' in result).toBe(false)
			expect(calls).toBe(1)
		},
	)
	test(
		lib +
			'delete key with undefined value does trigger reactivity - in [solid]',
		expect => {
			const result = mutable({ a: 'somevalue', b: undefined })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)

			let calls = 0
			effect(() => {
				calls++
				'b' in result
			})
			expect(calls).toBe(1)

			delete result.b
			expect('b' in result).toBe(false)
			expect(calls).toBe(2)
		},
	)
	test(
		lib +
			'delete key with defined value does trigger reactivity - reading ',
		expect => {
			const result = mutable({ a: 'somevalue', b: undefined })
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)

			let calls = 0
			effect(() => {
				calls++
				result.a
			})
			expect(calls).toBe(1)

			delete result.a
			expect('a' in result).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(lib + 'deleting: defined object property', expect => {
		const source = { name: 'quack', last: 'murci' }
		const result = mutable(source)

		expect(result.name).toBe('quack')
		expect(result.last).toBe('murci')

		expect('name' in result).toBe(true)
		expect('last' in result).toBe(true)

		delete result.name

		expect('name' in result).toBe(false)
		expect('last' in result).toBe(true)

		expect(result.name).toBe(undefined)
		expect(result.last).toBe('murci')

		expect('name' in result).toBe(false)
		expect('last' in result).toBe(true)

		expect(result.name).toBe(undefined)
		expect(result.last).toBe('murci')
	})

	// Date, HTMLElement, RegExp

	test(lib + 'should trigger effect only once ', expect => {
		const result = mutable({ a: 1 })
		expect('a' in result).toBe(true)

		let calls = 0
		let tmp
		effect(() => {
			calls++
			tmp = { ...result }
			if (calls > 2) {
				throw lib + 'should trigger effect only once'
			}
		})
		expect(calls).toBe(1)

		setTimeout(() => {
			result.a = 333
			result.a = 333
		}, 200)
	})

	/* misc */

	test(lib + 'misc objects', expect => {
		// Date, HTMLElement, RegExp

		const sources = [
			new Date(),
			/[a-z]/,
			document.createElement('div'),
			new Set([1, 2, 3]),
			new Map(),
			Symbol(),
		]
		for (const source of sources) {
			try {
				const result = mutable(source)
				if (lib === 'oby: ' || lib === 'solid: ') {
					if (lib === 'oby: ' && typeof source === 'symbol') {
						expect(result).toBe(source)
						expect(isProxy(result)).toBe(false)
						continue
					}
					expect(result).not.toBe(source)
					expect(isProxy(result)).toBe(true)
					continue
				}
				expect(result).toBe(source)
				expect(isProxy(result)).toBe(false)
			} catch (e) {
				if (lib === 'solid: ') {
					if (typeof source !== 'symbol') {
						console.error('misc objects: Throws with', source)
					}
				} else {
					console.error('misc objects: Throws with', source)
				}
			}
		}
	})

	test(lib + 'misc objects (nested)', expect => {
		const sources = [
			new Date(),
			/[a-z]/,
			document.createElement('div'),
			new Set([1, 2, 3]),
			new Map(),
			Symbol(),
		]
		for (const source of sources) {
			try {
				const result = mutable({ o: source })
				expect(result.o).toBe(source)
				expect(isProxy(result.o)).toBe(false)
			} catch (e) {
				console.error(
					'misc objects (nested): throws having nested',
					source,
				)
			}
		}

		const source = {}
		const result = mutable({ o: source })
		expect(result.o).not.toBe(source)
		expect(isProxy(result.o)).toBe(true)
	})

	test(lib + 'misc native objects should work', expect => {
		const result = mutable({ set: new Set(), map: new Map() })

		expect(result.set instanceof Set).toBe(true)
		expect(result.map instanceof Map).toBe(true)
		expect(isProxy(result.set)).toBe(false)
		expect(isProxy(result.map)).toBe(false)

		result.set.add(1)
		result.set.delete(2)
		result.set.delete(1)
		result.set.clear()

		result.map.set(1, 1)
		result.map.delete(1)
		result.map.clear()
	})

	test(lib + 'misc objects (effect)', expect => {
		const sources = [
			new Date(),
			/[a-z]/,
			document.createElement('div'),
		]
		for (const source of sources) {
			const result = mutable({ o: source })

			expect(result.o).toBe(source)
			expect(isProxy(result.o)).toBe(false)

			let calls = 0
			effect(() => {
				calls++
				result.o.something
			})
			expect(calls).toBe(1)

			result.o.something = true
			result.o.something = false
			expect(calls).toBe(1)

			delete result.o.something
			expect(calls).toBe(1)

			result.o.something = true
			result.o.something = false
			expect(calls).toBe(1)

			// again but when reading its defined already
			effect(() => {
				calls++
				result.o.something
			})
			expect(calls).toBe(2)

			result.o.something = true
			result.o.something = false
			expect(calls).toBe(2)

			delete result.o.something
			expect(calls).toBe(2)

			result.o.something = true
			result.o.something = false
			expect(calls).toBe(2)
		}
	})

	/* in */

	test(lib + 'in: getters to not be called 1', expect => {
		let access = 0
		const result = mutable({
			a: 1,
			get b() {
				console.log('accesing b')
				access++
				return 2
			},
		})

		expect('a' in result).toBe(true)
		expect('b' in result).toBe(true)
		expect('c' in result).toBe(false)
		expect(access).toBe(0)
	})

	test(lib + 'in: getters to not be called 2', expect => {
		let access = 0
		const result = mutable({
			a: 1,
			get b() {
				console.log('accesing b')
				access++
				return 2
			},
		})
		result.c = 0

		expect('a' in result).toBe(true)
		expect('b' in result).toBe(true)
		expect('c' in result).toBe(true)
		expect(access).toBe(0)
	})

	test(
		lib + 'in: getters to not be called 3 [solid, oby]',
		expect => {
			let access = 0
			const result = mutable({
				a: 1,
				get b() {
					// console.log('accesing b')
					access++
					return 2
				},
			})

			let failed = false
			try {
				result.b = 0
			} catch (e) {
				failed = true
			}
			if (!failed) {
				throw 'setting a value when its only a getter should have throw'
			}

			expect(access).toBe(0)
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)
			expect(access).toBe(0)
		},
	)

	test(lib + 'in: getters to not be called 3.1 [solid]', expect => {
		let access = 0
		let val = 2
		const result = mutable({
			a: 1,
			get b() {
				// console.log('accesing b')
				access++
				return val
			},
			set b(value) {
				val = value
			},
		})

		expect(access).toBe(0)
		expect('a' in result).toBe(true)
		expect('b' in result).toBe(true)
		expect(access).toBe(0)

		expect(result.b).toBe(2)
		expect(access).toBe(1)

		result.b = 3

		expect(result.b).toBe(3)
		expect(access).toBe(2)
	})

	test(
		lib + 'in: getters to not be called 4 [solid, oby]',
		expect => {
			let access = 0
			const result = mutable({
				a: 1,
				get b() {
					access++
					return 2
				},
			})

			expect(access).toBe(0)
			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)
			expect(access).toBe(0)

			delete result.b

			expect('a' in result).toBe(true)
			expect('b' in result).toBe(false)
			expect(access).toBe(0)

			result.b

			expect('a' in result).toBe(true)
			expect('b' in result).toBe(false)
			expect(access).toBe(0)

			result.b = 3

			expect('a' in result).toBe(true)
			expect('b' in result).toBe(true)
			expect(result.b).toBe(3)
			expect(access).toBe(0)
		},
	)

	/* tracking */

	test(lib + 'track: value', expect => {
		const source = { name: 'quack' }
		const result = mutable(source)

		let called = 0
		effect(() => {
			called++
			result.name
		})

		// setting to same value
		result.name = 'quack'
		expect(called).toBe(1)
		expect(result.name).toBe('quack')

		// change
		result.name = 'murci'
		expect(called).toBe(2)
		expect(result.name).toBe('murci')

		// same value again should not retrigger
		result.name = 'murci'
		expect(called).toBe(2)
		expect(result.name).toBe('murci')

		// third
		result.name = 'mishu'
		expect(called).toBe(3)
		expect(result.name).toBe('mishu')
	})

	test(lib + 'track: value nested', expect => {
		const source = { data: { name: 'quack' } }
		const result = mutable(source)

		let called = 0
		effect(() => {
			called++
			result.data.name
		})

		// same value again should not retrigger
		result.data.name = 'quack'
		expect(called).toBe(1)
		expect(result.data.name).toBe('quack')

		result.data.name = 'murci'
		expect(called).toBe(2)
		expect(result.data.name).toBe('murci')

		// same value again should not retrigger
		result.data.name = 'murci'
		expect(called).toBe(2)
		expect(result.data.name).toBe('murci')

		// third
		result.data.name = 'mishu'
		expect(called).toBe(3)
		expect(result.data.name).toBe('mishu')
	})

	test(lib + 'track: undefined value', expect => {
		const source = {}
		const result = mutable(source)

		let called = 0
		effect(() => {
			called++
			result.name
		})
		expect(called).toBe(1)

		result.name = 'murci'
		expect(called).toBe(2)
		expect(result.name).toBe('murci')

		// same value again should not retrigger
		result.name = 'murci'
		expect(called).toBe(2)
		expect(result.name).toBe('murci')

		delete result.name
		expect(called).toBe(3)
		expect('name' in result).toBe(false)
		expect(called).toBe(3)

		/**
		 * Tricky because signal gets deleted(see previous lines), then we
		 * add it again with the following, but the signal is not the same
		 * one as before, so effect doesnt re-trigger
		 */
		result.name = 'mishu'
		expect(called).toBe(4)
	})

	test(lib + 'track: deleted value', expect => {
		const source = { name: 'hola' }
		const result = mutable(source)

		let called = 0
		effect(() => {
			called++
			result.name
		})
		expect(called).toBe(1)

		result.name = 'murci'
		expect(called).toBe(2)
		expect(result.name).toBe('murci')

		delete result.name
		expect(called).toBe(3)
		expect('name' in result).toBe(false)
		expect(called).toBe(3)

		/**
		 * Tricky because signal gets deleted(see previous lines), then we
		 * add it again with the following, but the signal is not the same
		 * one as before, so effect doesnt re-trigger
		 */
		result.name = 'mishu'
		expect(called).toBe(4)
	})

	test(lib + 'track: undefined value nested', expect => {
		const source = {}
		const result = mutable(source)

		let called = 0
		effect(() => {
			called++
			result.data
		})
		expect(called).toBe(1)

		result.data = {}
		result.data.name = 'murci'
		result.data.name = 'murci'
		expect(called).toBe(2)
		expect(result.data.name).toBe('murci')
	})

	test(lib + 'track: state from signal', expect => {
		const [read, write] = signal('init')
		const result = mutable({ data: '' })

		let called = 0
		effect(() => {
			called++
			result.data = read()
		})
		expect(called).toBe(1)
		expect(result.data).toBe('init')
		write('signal')
		expect(called).toBe(2)
		expect(result.data).toBe('signal')
	})

	test(lib + 'track `in`', expect => {
		let access = 0
		const result = mutable({
			a: 1,
			get b() {
				access++
				return 2
			},
		})

		let called = 0
		effect(() => {
			'a' in result
			'b' in result
			called++
		})
		expect(called).toBe(1)

		delete result.a
		expect(called).toBe(2)
		expect('a' in result).toBe(false)
		expect(called).toBe(2)

		result.a = true
		expect(called).toBe(3)

		expect(access).toBe(0)
	})

	/* classes */

	test(lib + 'read and set class [solid, oby]', expect => {
		class D {
			f = 1
			get e() {
				return this.f * 4
			}
		}
		class A {
			a = 1
			get b() {
				return this.a * 4
			}
			child = new D()
		}
		let count = 0
		let childCount = 0

		const m = mutable(new A())

		effect(() => {
			m.b
			count++
		})
		effect(() => {
			m.child.f
			childCount++
		})

		const increment = () => {
			m.a++
			m.child.f++
		}

		// initial
		expect(m.b).toBe(4)
		expect(m.child.e).toBe(4)
		expect(count).toBe(1)
		expect(childCount).toBe(1)

		// incrementing
		increment()
		expect(m.b).toBe(8)
		expect(m.child.e).toBe(8)
		expect(count).toBe(2)
		expect(childCount).toBe(2)

		increment()
		expect(m.b).toBe(12)
		expect(m.child.e).toBe(12)
		expect(count).toBe(3)
		expect(childCount).toBe(3)

		increment()
		expect(m.b).toBe(16)
		expect(m.child.e).toBe(16)
		expect(count).toBe(4)
		expect(childCount).toBe(4)
	})

	test(lib + 'read and set outside class', expect => {
		const m = mutable({
			a: 1,
			get b() {
				return this.a * 4
			},
		})

		let calls = 0
		effect(() => {
			m.b
			calls++
		})

		const increment = () => {
			m.a++
		}

		// initial
		expect(m.a).toBe(1)
		expect(m.b).toBe(4)
		expect(calls).toBe(1)

		// incrementing
		increment()
		expect(m.a).toBe(2)
		expect(m.b).toBe(8)
		expect(calls).toBe(2)

		increment()
		expect(m.a).toBe(3)
		expect(m.b).toBe(12)
		expect(calls).toBe(3)
	})

	test(lib + 'read and set inside class [solid, oby]', expect => {
		class Test {
			a = 1
			get b() {
				return this.a * 4
			}
		}

		const m = mutable(new Test())

		let calls = 0
		effect(() => {
			m.b
			calls++
		})
		expect(calls).toBe(1)

		const increment = () => {
			m.a++
		}

		// initial
		expect(m.a).toBe(1)
		expect(m.b).toBe(4)

		// incrementing
		increment()
		expect(calls).toBe(2)
		expect(m.a).toBe(2)
		expect(m.b).toBe(8)

		increment()
		expect(m.a).toBe(3)
		expect(m.b).toBe(12)
		expect(calls).toBe(3)
	})

	test(
		lib + 'read and set inside extended class [solid, oby]',
		expect => {
			class Tests2 {
				a = 1
				get b() {
					return this.a * 4
				}
			}
			class Test extends Tests2 {}

			const m = mutable(new Test())

			let calls = 0
			effect(() => {
				m.b
				calls++
			})

			const increment = () => {
				m.a++
			}

			// initial
			expect(m.a).toBe(1)
			expect(m.b).toBe(4)
			expect(calls).toBe(1)

			// incrementing
			increment()
			expect(m.a).toBe(2)
			expect(m.b).toBe(8)
			expect(calls).toBe(2)

			increment()
			expect(m.a).toBe(3)
			expect(m.b).toBe(12)
			expect(calls).toBe(3)
		},
	)

	test(
		lib + 'read and set inside extended x2 class [solid, oby]',
		expect => {
			class Test4 {
				get b() {
					return this.a * 4
				}
			}
			class Test3 extends Test4 {}
			class Tests2 extends Test3 {
				a = 1
			}
			class Test extends Tests2 {}

			const m = mutable(new Test())

			let calls = 0
			effect(() => {
				m.b
				calls++
			})

			const increment = () => {
				m.a++
			}

			// initial
			expect(m.a).toBe(1)
			expect(m.b).toBe(4)
			expect(calls).toBe(1)

			// incrementing
			increment()
			expect(m.a).toBe(2)
			expect(m.b).toBe(8)
			expect(calls).toBe(2)

			increment()
			expect(m.a).toBe(3)
			expect(m.b).toBe(12)
			expect(calls).toBe(3)
		},
	)

	test(lib + 'hasOwnProperty shoulnt throw', expect => {
		let m = mutable({ a: { deep: 'test' } })
		m.hasOwnProperty('a')
		m.a.hasOwnProperty('deep')

		m = mutable(Object.create(null))
		m.a = { deep: 'test' }
		// m.hasOwnProperty('a')
		m.a.hasOwnProperty('deep')
	})

	test(lib + 'reacts to hasOwnProperty [solid, oby]', expect => {
		let m = mutable({ a: { deep: 'test' } })

		let has
		let calls1 = 0
		effect(() => {
			calls1++
			has = m.hasOwnProperty('b')
		})
		expect(has).toBe(false)
		m.b = 1
		expect(has).toBe(true)

		let calls2 = 0
		effect(() => {
			calls2++
			has = m.a.hasOwnProperty('b')
		})
		expect(has).toBe(false)
		m.a.b = 1
		expect(has).toBe(true)

		expect(calls1).toBe(2)
		expect(calls2).toBe(2)
	})

	// oby test suite

	test(
		lib +
			'is both a getter and a setter, for shallow primitive properties',
		expect => {
			const o = mutable({ value: undefined })
			expect(o.value).toBe(undefined)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(lib + 'Object.create(null)', expect => {
		const o = mutable(Object.create(null))
		expect(o.value).toBe(undefined)

		testValuesAndEffect(
			expect,
			v => {
				o.value = v
			},
			() => o.value,
		)
	})

	test(lib + 'Object.create(null) nested', expect => {
		const o = mutable({ value: Object.create(null) })
		expect(o.value).not.toBe(undefined)
		expect(o.value.deep).toBe(undefined)

		testValuesAndEffect(
			expect,
			v => {
				o.value.deep = v
			},
			() => o.value.deep,
		)
	})

	test(
		lib +
			'deeper: is both a getter and a setter, for shallow primitive properties',
		expect => {
			const o = mutable({ value: { deeper: undefined } })
			expect(o.value.deeper).toBe(undefined)

			testValuesAndEffect(
				expect,
				v => {
					o.value.deeper = v
				},
				() => o.value.deeper,
			)
		},
	)

	test(
		lib +
			'is both a getter and a setter, for shallow non-primitive properties',
		expect => {
			const obj1 = { foo: 123 }
			const obj2 = {}

			const o = mutable({ value: obj1 })
			expect(o.value).toHaveShape(obj1)

			o.value = obj2
			expect(o.value).toHaveShape(obj2)

			o.value = obj1
			expect(o.value).toHaveShape(obj1)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'is both a getter and a setter, for deep primitive properties',
		expect => {
			const o = mutable({ deep: { value: undefined } })
			expect(o.deep.value).toBe(undefined)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'is both a getter and a setter, for deep non-primitive properties',
		expect => {
			const obj1 = { foo: 123 }
			const obj2 = {}

			const o = mutable({ deep: { value: obj1 } })
			expect(o.deep.value).toHaveShape(obj1)

			o.deep.value = obj2
			expect(o.deep.value).toHaveShape(obj2)

			o.deep.value = obj1
			expect(o.deep.value).toHaveShape(obj1)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'is both a getter and a setter, for deep non-primitive properties',
		expect => {
			const obj1 = { foo: 123 }
			const obj2 = {}

			const o = mutable({ deep: { value: obj1 } })
			expect(o.deep.value).toHaveShape(obj1)

			let calls = 0
			effect(() => {
				calls += 1
				o.deep.value
			})
			expect(calls).toBe(1)

			o.deep.value = obj2
			expect(o.deep.value).toHaveShape(obj2)
			expect(calls).toBe(2)

			o.deep.value = obj1
			expect(o.deep.value).toHaveShape(obj1)
			expect(calls).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'creates a dependency in a memo when getting a shallow property',
		expect => {
			const o = mutable({ value: 1 })

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'creates a dependency in a memo/effect when getting a deep property',
		expect => {
			const o = mutable({ deep: { value: 1 } })

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'creates a single dependency in an memo even if getting a shallow property multiple times',
		expect => {
			const o = mutable({ value: 1 })

			let calls = 0

			const value = memo(() => {
				calls += 1
				o.value
				o.value
				o.value
				return o.value
			})

			expect(value()).toBe(1)
			expect(calls).toBe(1)

			o.value = 2

			expect(value()).toBe(2)
			expect(calls).toBe(2)

			o.value = 3

			expect(value()).toBe(3)
			expect(calls).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'creates a single dependency in an effect even if getting a shallow property multiple times',
		expect => {
			const o = mutable({ value: 1 })

			let calls = 0

			effect(() => {
				calls += 1
				o.value
				o.value
				o.value
			})
			expect(calls).toBe(1)

			o.value = 2
			expect(calls).toBe(2)

			o.value = 3
			expect(calls).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'creates a single dependency in a memo even if getting a deep property multiple times',
		expect => {
			const o = mutable({ deep: { value: 1 } })

			let calls = 0

			const value = memo(() => {
				calls += 1
				o.deep.value
				o.deep.value
				o.deep.value
				return o.deep.value
			})

			expect(value()).toBe(1)
			expect(calls).toBe(1)

			o.deep.value = 2

			expect(value()).toBe(2)
			expect(calls).toBe(2)

			o.deep.value = 3

			expect(value()).toBe(3)
			expect(calls).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'creates a single dependency in an effect even if getting a deep property multiple times',
		expect => {
			const o = mutable({ deep: { value: 1 } })

			let calls = 0

			effect(() => {
				calls += 1
				o.deep.value
				o.deep.value
				o.deep.value
			})
			expect(calls).toBe(1)

			o.deep.value = 2
			expect(calls).toBe(2)

			o.deep.value = 3
			expect(calls).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib + 'does not create a dependency in a memo when creating',
		expect => {
			let o
			let calls = 0

			const value = memo(() => {
				calls += 1
				o = mutable({ value: 1 })
			})

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			o.value = 2

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)

			expect(calls).toBe(1)
		},
	)

	test(
		lib + 'does not create a dependency in an effect when creating',
		expect => {
			let o
			let calls = 0

			effect(() => {
				calls += 1
				o = mutable({ value: 1 })
			})
			expect(calls).toBe(1)

			o.value = 2
			expect(calls).toBe(1)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)

			expect(calls).toBe(1)
		},
	)

	test(
		lib +
			'does not create a dependency in a memo when setting a shallow property',
		expect => {
			let o = mutable({ value: 0 })
			let calls = 0

			const value = memo(() => {
				calls += 1
				o.value = 1
			})

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			o.value = 2

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'does not create a dependency in an effect when setting a shallow property',
		expect => {
			let o = mutable({ value: 0 })
			let calls = 0

			effect(() => {
				calls += 1
				o.value = 1
			})
			expect(calls).toBe(1)

			o.value = 2
			expect(calls).toBe(1)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'does not create a dependency in a memo when getting a parent property of the one being updated',
		expect => {
			const o = mutable({ deep: { value: 1 } })

			let calls = 0

			const value = memo(() => {
				calls += 1
				o.deep
			})

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			o.deep.value = 2

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			o.deep.value = 3

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'does not create a dependency in an effect when getting a parent property of the one being updated',
		expect => {
			const o = mutable({ deep: { value: 1 } })

			let calls = 0

			effect(() => {
				calls += 1
				o.deep
			})
			expect(calls).toBe(1)

			o.deep.value = 2
			expect(calls).toBe(1)

			o.deep.value = 3
			expect(calls).toBe(1)

			testValuesAndEffect(
				expect,
				v => {
					o.deep = v
				},
				() => o.deep,
			)
		},
	)

	test(
		lib +
			'does create a dependency (on the parent) in a memo when setting a deep property',
		expect => {
			//FIXME: This can't quite be fixed, it's a quirk of how mutable stores work

			const o = mutable({ deep: { value: 1 } })

			let calls = 0

			const value = memo(() => {
				calls += 1
				o.deep.value = 2
			})

			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			o.deep.value = 3
			expect(value()).toBe(undefined)
			expect(calls).toBe(1)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)

			o.deep = {}
			expect(value()).toBe(undefined)
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'does create a dependency (on the parent) in an effect when setting a deep property',
		expect => {
			//FIXME: This can't quite be fixed, it's a quirk of how mutable stores work

			const o = mutable({ deep: { value: 1 } })

			let calls = 0

			effect(() => {
				calls += 1
				o.deep.value = 2
			})
			expect(calls).toBe(1)

			o.deep.value = 3
			expect(calls).toBe(1)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)

			o.deep = {}
			expect(calls).toBe(2)
		},
	)

	test(lib + 'returns primitive values as is', expect => {
		// solid doesnt wrap non-objects
		if (lib !== 'solid: ') {
			let o = mutable(123)
			expect(o).toBe(123)

			o = mutable(321)
			expect(o).toBe(321)

			o = mutable(undefined)
			expect(o).toBe(undefined)

			o = mutable(null)
			expect(o).toBe(null)

			o = mutable('')
			expect(o).toBe('')

			o = mutable('string')
			expect(o).toBe('string')

			o = mutable(true)
			expect(o).toBe(true)

			o = mutable(false)
			expect(o).toBe(false)

			o = mutable(Infinity)
			expect(o).toBe(Infinity)
		}

		let o = mutable([true])
		expect(o).toHaveShape([true])

		o = mutable({ 0: true })
		expect(o).toHaveShape({ 0: true })

		o = mutable([true])
		expect(o).toHaveShape([true])

		o = mutable({ 0: true })
		expect(o).toHaveShape({ 0: true })
	})

	test(
		lib +
			'returns unproxied "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toSource", "toString", "valueOf", properties [solid]',
		expect => {
			const o = mutable({})

			let calls = 0

			effect(() => {
				calls += 1
				o.hasOwnProperty
				o.isPrototypeOf
				o.propertyIsEnumerable
				o.toLocaleString
				o.toSource
				o.toString
				o.valueOf
			})

			expect(calls).toBe(1)

			o.hasOwnProperty = 1
			o.isPrototypeOf = 1
			o.propertyIsEnumerable = 1
			o.toLocaleString = 1
			o.toSource = 1
			o.toString = 1
			o.valueOf = 1

			if (lib === 'oby: ') {
				expect(calls).toBe(1)
			} else {
				expect(calls).toBe(2)
			}
		},
	)

	test(lib + 'returns the value being set', expect => {
		const o = mutable({ value: undefined })

		expect((o.value = 123)).toBe(123)
		expect((o.value = undefined)).toBe(undefined)
		expect((o.value = null)).toBe(null)
		expect((o.value = '')).toBe('')
		expect((o.value = 'string')).toBe('string')
		expect((o.value = [true])).toHaveShape([true])
		expect((o.value = { 0: true })).toHaveShape({ 0: true })
		expect((o.value = true)).toBe(true)
		expect((o.value = false)).toBe(false)
		expect((o.value = Infinity)).toBe(Infinity)
		expect((o.value = 0)).toBe(0)
		expect(Object.is((o.value = NaN), NaN)).toBe(true)
		expect((o.value = 1)).toBe(1)
	})

	test(lib + 'supports setting functions as is', expect => {
		const fn = () => {}
		const o = mutable({ value: () => {} })

		o.value = fn
		// pota will return wrapped functions
		if (lib === 'pota: ') {
			expect(typeof o.value).toBe('function')
		} else {
			expect(o.value).toBe(fn)
		}
	})

	test(lib + 'supports wrapping a plain object', expect => {
		const o = mutable({})

		let calls = 0

		effect(() => {
			calls += 1
			o.value
		})
		expect(calls).toBe(1)

		o.value = 2
		expect(calls).toBe(2)
	})

	test(
		lib +
			'supports wrapping a deep plain object inside a plain object',
		expect => {
			const o = mutable({ value: {} })

			let calls = 0

			effect(() => {
				calls += 1
				o.value.lala
			})
			expect(calls).toBe(1)

			o.value.lala = 3
			expect(calls).toBe(2)

			expect(o.value.lala).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o.value.lala = v
				},
				() => o.value.lala,
			)
		},
	)

	test(
		lib + 'supports reacting to deleting a shallow property',
		expect => {
			const o = mutable({ value: 123 })

			let calls = 0

			effect(() => {
				calls += 1
				o.value
			})
			expect(calls).toBe(1)

			delete o.value
			expect(calls).toBe(2)
			expect('value' in o).toBe(false)
			expect(calls).toBe(2)

			o.value = undefined
			expect(calls).toBe(2)

			o.value = true
			expect(calls).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'supports not reacting when deleting a shallow property that was undefined [solid]',
		expect => {
			const o = mutable({ value: undefined })

			let calls = 0

			effect(() => {
				calls += 1
				o.value
			})
			expect(calls).toBe(1)

			delete o.value
			expect(calls).toBe(1)
			expect('value' in o).toBe(false)
			expect(calls).toBe(1)

			o.value = undefined
			expect(calls).toBe(1)

			o.value = true
			expect(calls).toBe(2)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)
	test(
		lib +
			'supports reacting when deleting a shallow property that was null',
		expect => {
			const o = mutable({ value: null })

			let calls = 0

			effect(() => {
				calls += 1
				o.value
			})
			expect(calls).toBe(1)

			delete o.value
			expect(calls).toBe(2)

			expect('value' in o).toBe(false)
			expect(calls).toBe(2)

			o.value = undefined
			expect(calls).toBe(2)

			o.value = true
			expect(calls).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib + 'supports reacting to deleting a deep property',
		expect => {
			const o = mutable({ deep: { value: 123 } })

			let calls = 0

			effect(() => {
				calls += 1
				o.deep.value
			})
			expect(calls).toBe(1)

			delete o.deep.value
			expect(calls).toBe(2)

			expect('value' in o.deep).toBe(false)
			expect(calls).toBe(2)

			o.deep.value = undefined
			expect(calls).toBe(2)

			o.deep.value = true
			expect(calls).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'supports not reacting when deleting a deep property that was undefined [solid]',
		expect => {
			const o = mutable({ deep: { value: undefined } })

			let calls = 0

			effect(() => {
				calls += 1
				o.deep.value
			})
			expect(calls).toBe(1)

			delete o.deep.value
			expect(calls).toBe(1)
			expect('value' in o.deep).toBe(false)
			expect(calls).toBe(1)

			o.deep.value = undefined
			expect(calls).toBe(1)

			o.deep.value = true
			expect(calls).toBe(2)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'supports not reacting when setting a primitive property to itself',
		expect => {
			const o = mutable({ value: 1 })

			let calls = 0

			effect(() => {
				calls += 1
				o.value
			})
			expect(calls).toBe(1)

			o.value = 1
			expect(calls).toBe(1)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'supports not reacting when setting a non-primitive property to itself',
		expect => {
			const o = mutable({ deep: { value: 2 } })

			let calls = 0

			effect(() => {
				calls += 1
				o.deep.value
			})
			expect(calls).toBe(1)

			o.deep = o.deep
			expect(calls).toBe(1)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'supports not reacting when setting a non-primitive property to itself, when reading all values - object ',
		expect => {
			const o = mutable({ value: {} })

			let calls = 0

			effect(() => {
				calls += 1
				o.value
			})
			expect(calls).toBe(1)

			o.value = o.value
			expect(calls).toBe(1)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'supports not reacting when reading the length on a non-array, when reading all values, if the length does not actually change',
		expect => {
			//TODO

			const o = mutable({ length: 0 })

			let calls = 0

			effect(() => {
				calls += 1
				o.length
			})
			expect(calls).toBe(1)

			o.length = o.length
			expect(calls).toBe(1)
		},
	)

	test(lib + 'supports reacting to own keys [solid]', expect => {
		const o = mutable({ foo: 1, bar: 2, baz: 3 })

		let calls = 0

		effect(() => {
			calls += 1
			Object.keys(o)
		})
		expect(calls).toBe(1)

		o.qux = 4
		expect(calls).toBe(2)

		o.foo = 2 // already in
		o.bar = 3 // already in
		o.baz = 4 // already in
		o.qux = 5 // already in
		expect(calls).toBe(2)

		o.qux = 5
		expect(calls).toBe(2)

		o.qux = 6
		expect(calls).toBe(2)

		o.qux2 = 7
		expect(calls).toBe(3)

		delete o.foo
		expect(calls).toBe(4)
		expect('foo' in o).toBe(false)
		expect(calls).toBe(4)

		o.foo = undefined
		expect(calls).toBe(5)
		expect(o.foo).toBe(undefined)
		expect('foo' in o).toBe(true)

		o.foo = true
		expect(calls).toBe(5)
		expect(o.foo).toBe(true)
		expect('foo' in o).toBe(true)
	})

	test(lib + 'supports reacting to own keys deep [solid]', expect => {
		const o = mutable({ value: { foo: 1, bar: 2, baz: 3 } })

		let calls = 0

		effect(() => {
			calls += 1
			Object.keys(o.value)
		})
		expect(calls).toBe(1)

		o.value.qux = 4
		expect(calls).toBe(2)

		o.value.foo = 2
		o.value.bar = 3
		o.value.baz = 4
		o.value.qux = 5
		expect(calls).toBe(2)

		o.value.qux = 5
		expect(calls).toBe(2)

		o.value.qux2 = 5
		expect(calls).toBe(3)

		delete o.value.foo
		expect(calls).toBe(4)
		expect('foo' in o.value).toBe(false)
		expect(calls).toBe(4)

		o.value.foo = undefined
		expect(calls).toBe(5)
		expect(o.value.foo).toBe(undefined)
		expect('foo' in o.value).toBe(true)

		o.value.foo = true
		expect(calls).toBe(5)
		expect(o.value.foo).toBe(true)
		expect('foo' in o.value).toBe(true)
	})

	test(
		lib + 'supports reacting to properties read by a getter',
		expect => {
			const o = mutable({
				foo: 1,
				bar: 2,
				get fn() {
					return this.foo + this.bar
				},
			})

			let calls = 0

			effect(() => {
				calls += 1
				o.fn
			})
			expect(calls).toBe(1)

			o.foo = 10
			expect(calls).toBe(2)
			expect(o.fn).toBe(12)

			o.bar = 20
			expect(calls).toBe(3)
			expect(o.fn).toBe(30)
		},
	)

	test(
		lib +
			'supports reacting to properties read by a regular function',
		expect => {
			const o = mutable({
				foo: 1,
				bar: 2,
				fn() {
					return this.foo + this.bar
				},
			})

			let calls = 0

			effect(() => {
				calls += 1
				o.fn()
			})
			expect(calls).toBe(1)

			o.foo = 10
			expect(calls).toBe(2)
			expect(o.fn()).toBe(12)

			o.bar = 20
			expect(calls).toBe(3)
			expect(o.fn()).toBe(30)
		},
	)

	test(
		lib +
			'supports reacting to properties read by a regular function, called via the call method',
		expect => {
			const o = mutable({
				foo: 1,
				bar: 2,
				fn() {
					return this.foo + this.bar
				},
			})

			let calls = 0

			effect(() => {
				calls += 1
				o.fn.call(o)
			})
			expect(calls).toBe(1)

			o.foo = 10
			expect(calls).toBe(2)
			expect(o.fn.call(o)).toBe(12)

			o.bar = 20
			expect(calls).toBe(3)
			expect(o.fn.call(o)).toBe(30)
		},
	)

	test(
		lib +
			'supports reacting to properties read by a regular function, called via the apply method',
		expect => {
			const o = mutable({
				foo: 1,
				bar: 2,
				fn() {
					return this.foo + this.bar
				},
			})

			let calls = 0

			effect(() => {
				calls += 1
				o.fn.apply(o)
			})
			expect(calls).toBe(1)

			o.foo = 10
			expect(calls).toBe(2)
			expect(o.fn.apply(o)).toBe(12)

			o.bar = 20
			expect(calls).toBe(3)
			expect(o.fn.apply(o)).toBe(30)
		},
	)

	test(lib + 'supports batching implicitly - unsupported', expect => {
		const o = mutable({ foo: 1, bar: 2 })

		let calls = 0

		effect(() => {
			calls += 1
			o.foo
			o.bar
		})
		expect(calls).toBe(1)

		o.foo = 10
		o.bar = 20
		expect(calls).toBe(3)

		expect(o.foo).toBe(10)
		expect(o.bar).toBe(20)
	})

	test(
		lib + 'supports batching setters automatically [oby]',
		expect => {
			const o = mutable({
				foo: 1,
				bar: 2,
				set fn(increment) {
					this.foo += increment
					this.bar += increment
				},
			})

			let calls = 0
			effect(() => {
				calls += 1
				o.foo
				o.bar
			})
			expect(calls).toBe(1)

			o.fn = 1
			expect(calls).toBe(2)

			expect(o.foo).toBe(2)
			expect(o.bar).toBe(3)
		},
	)

	test(
		lib + 'supports batching deletions automatically Object.keys',
		expect => {
			const o = mutable({ foo: 1, bar: 2 })

			let calls = 0

			effect(() => {
				calls += 1
				o.foo
				if ('foo' in o) {
				}
				Object.keys(o)
			})
			expect(calls).toBe(1)

			delete o.foo
			expect(calls).toBe(2)
			expect('foo' in o).toBe(false)
			expect(calls).toBe(2)

			expect('foo' in o).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports batching deletions automatically no Object.keys',
		expect => {
			const o = mutable({ foo: 1, bar: 2 })

			let calls = 0

			effect(() => {
				calls += 1
				o.foo
				if ('foo' in o) {
				}
			})
			expect(calls).toBe(1)

			delete o.foo
			expect(calls).toBe(2)
			expect('foo' in o).toBe(false)
			expect(calls).toBe(2)

			expect('foo' in o).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports batching additions automatically Object.keys',
		expect => {
			const o = mutable({ bar: 2 })

			let calls = 0

			effect(() => {
				calls += 1
				o.foo
				if ('foo' in o) {
				}
				Object.keys(o)
			})
			expect(calls).toBe(1)

			o.foo = 1
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports batching additions automatically no Object.keys',
		expect => {
			const o = mutable({ bar: 2 })

			let calls = 0

			effect(() => {
				calls += 1
				o.foo
				if ('foo' in o) {
				}
			})
			expect(calls).toBe(1)

			o.foo = 1
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'supports batching additions automatically no Object.keys, no reading',
		expect => {
			const o = mutable({ bar: 2 })

			let calls = 0

			effect(() => {
				calls += 1
				if ('foo' in o) {
				}
			})
			expect(calls).toBe(1)

			o.foo = 1
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports batching additions automatically new property ',
		expect => {
			const o = mutable({ bar: 2 })

			let calls = 0

			effect(() => {
				calls += 1
				o.foo
			})
			expect(calls).toBe(1)

			o.foo = 1
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports reacting to changes on custom classes',
		expect => {
			class Foo {
				constructor() {
					this.foo = 0
					return mutable(this)
				}
			}

			class Bar extends Foo {
				constructor() {
					super()
					this.bar = 0
					return mutable(this)
				}
			}

			const foo = new Foo()
			const bar = new Bar()

			let calls = ''

			effect(() => {
				foo.foo
				calls += 'f'
			})

			effect(() => {
				bar.bar
				calls += 'b'
			})

			expect(calls).toBe('fb')

			foo.foo += 1
			expect(calls).toBe('fbf')

			bar.bar += 1
			expect(calls).toBe('fbfb')
		},
	)

	test(
		lib +
			'supports reacting to property checks when value is undefined, deleting [solid]',
		expect => {
			const o = mutable({ value: undefined })

			let calls = 0

			effect(() => {
				calls += 1
				if ('value' in o) {
				}
			})
			expect(calls).toBe(1)

			delete o.value
			expect(calls).toBe(2)
			expect('value' in o).toBe(false)
			expect(calls).toBe(2)

			delete o.value
			expect(calls).toBe(2)
			expect('value' in o).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'supports reacting to property checks when value is undefined, deleting deep [solid]',
		expect => {
			const o = mutable({ value: { deep: undefined } })

			let calls = 0

			effect(() => {
				calls += 1
				if ('deep' in o.value) {
				}
			})
			expect(calls).toBe(1)

			delete o.value.deep
			expect(calls).toBe(2)
			expect('deep' in o.value).toBe(false)
			expect(calls).toBe(2)

			delete o.value.deep
			expect(calls).toBe(2)
			expect('deep' in o.value).toBe(false)
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports reacting to property checks, adding [solid]',
		expect => {
			const o = mutable({})

			let calls = 0

			effect(() => {
				calls += 1
				if ('value' in o) {
				}
			})
			expect(calls).toBe(1)

			o.value = undefined
			expect(calls).toBe(2)

			o.value = undefined
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'supports reacting to property checks, adding deep [solid]',
		expect => {
			const o = mutable({ value: Object.create(null) })

			let calls = 0

			effect(() => {
				calls += 1
				if ('deep' in o.value) {
				}
			})
			expect(calls).toBe(1)

			o.value.deep = undefined
			expect(calls).toBe(2)

			o.value.deep = undefined
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'survives reading a value inside a discarded root',
		expect => {
			const o = mutable({ value: 123 })

			let calls = 0

			root(dispose => {
				o.value

				root(() => {
					o.value
				})

				dispose()
			})

			effect(() => {
				calls += 1

				o.value
			})
			expect(calls).toBe(1)

			o.value = 321
			expect(calls).toBe(2)
		},
	)

	test(lib + 'does nothing for primitives', expect => {
		const o = mutable({ foo: 123 })
		expect(o.foo).toBe(123)

		o.foo = 321
		expect(o.foo).toBe(321)

		o.foo = undefined
		expect(o.foo).toBe(undefined)

		o.foo = null
		expect(o.foo).toBe(null)

		o.foo = 0
		expect(o.foo).toBe(0)

		o.foo = ''
		expect(o.foo).toBe('')

		o.foo = 'string'
		expect(o.foo).toBe('string')

		o.foo = [true]
		expect(o.foo).toHaveShape([true])

		o.foo = { 0: true }
		expect(o.foo).toHaveShape({ 0: true })

		o.foo = [true]
		expect(o.foo).toHaveShape([true])

		o.foo = true
		expect(o.foo).toBe(true)

		o.foo = false
		expect(o.foo).toBe(false)

		o.foo = Infinity
		expect(o.foo).toBe(Infinity)

		o.foo = Infinity
		expect(o.foo).toBe(Infinity)

		o.foo = NaN
		expect(Object.is(o.foo, NaN)).toBe(true)

		o.foo = 1
		expect(o.foo).toBe(1)
	})

	test(lib + 'can mutate object returned by getter [oby]', expect => {
		const result = mutable({
			get greeting() {
				return { greet: { deep: `hi, quack` } }
			},
			set greeting(val) {},
		})
		expect(result.greeting.greet.deep).toBe('hi, quack')

		result.greeting.greet.deep = undefined
		expect(result.greeting.greet.deep).toBe('hi, quack')

		const tmp1 = result.greeting
		expect(tmp1.greet.deep).toBe('hi, quack')
		testValuesAndEffect(
			expect,
			v => {
				tmp1.greet.deep = v
			},
			() => tmp1.greet.deep,
		)

		const tmp2 = result.greeting.greet
		expect(tmp2.deep).toBe('hi, quack')
		testValuesAndEffect(
			expect,
			v => {
				tmp2.deep = v
			},
			() => tmp2.deep,
		)
	})

	// vue

	test(lib + 'object.keys', expect => {
		const original = { foo: 1 }
		const result = mutable(original)
		expect(result.foo).toBe(1)
		expect(result).not.toBe(original)

		expect('foo' in result).toBe(true)

		expect(Object.keys(result)).toHaveShape(['foo'])
	})

	test(
		lib +
			'observed value should proxy mutations to original (Object)',
		expect => {
			const original = { foo: 1 }
			const observed = mutable(original)
			// set
			observed.bar = 1
			expect(observed.bar).toBe(1)
			expect(original.bar).toBe(1)

			// delete
			delete observed.foo
			expect('foo' in observed).toBe(false)
			expect('foo' in original).toBe(false)
		},
	)

	test(
		lib +
			'original value change should reflect in observed value (Object)',
		expect => {
			// same as before test but the value set is on original rather than observed
			const original = { foo: 1 }
			const observed = mutable(original)

			// set
			original.bar = 1
			expect(original.bar).toBe(1)
			expect(observed.bar).toBe(1)

			// delete
			delete original.foo
			expect('foo' in original).toBe(false)
			expect('foo' in observed).toBe(false)
		},
	)

	test(
		lib +
			'setting a property with an unobserved value should wrap with reactive',
		expect => {
			const observed = mutable({})
			const raw = {}
			observed.foo = raw
			expect(observed.foo).not.toBe(raw)

			let calls = 0
			effect(() => {
				calls++
				observed.foo
			})
			expect(calls).toBe(1)

			observed.foo = false
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'observing already observed value should return same Proxy',
		expect => {
			const original = { foo: 1 }
			const observed = mutable(original)
			const observed2 = mutable(observed)
			expect(observed2).toBe(observed)
		},
	)

	test(
		lib +
			'observing the same value multiple times should return same Proxy',
		expect => {
			const original = { foo: 1 }
			const observed = mutable(original)
			const observed2 = mutable(original)
			expect(observed).toBe(observed2)
		},
	)

	// #1246
	test(
		lib +
			'mutation on objects using reactive as prototype should trigger',
		expect => {
			const observed = mutable({ foo: 1 })
			const original = Object.create(observed)
			let dummy
			effect(() => (dummy = original.foo))
			expect(dummy).toBe(1)

			observed.foo = 2
			expect(dummy).toBe(2)
			expect(observed.foo).toBe(2)
			expect(original.foo).toBe(2)

			original.foo = 3
			expect(dummy).toBe(3)
			expect(observed.foo).toBe(3)
			expect(original.foo).toBe(3)

			original.foo = 4
			expect(dummy).toBe(4)
			expect(observed.foo).toBe(4)
			expect(original.foo).toBe(4)
		},
	)

	test(
		lib + 'should not observe non-extensible objects [solid]',
		expect => {
			let mutableObj
			let testObj

			function createObjects() {
				mutableObj = mutable({
					foo: Object.preventExtensions({ a: 1 }),
					bar: Object.freeze({ a: 1 }),
					baz: Object.seal({ a: 1 }),
				})

				testObj = {
					foo: Object.preventExtensions({ a: 1 }),
					bar: Object.freeze({ a: 1 }),
					baz: Object.seal({ a: 1 }),
				}
			}

			createObjects()

			expect(mutableObj.foo).toHaveShape({ a: 1 })
			expect(mutableObj.bar).toHaveShape({ a: 1 })
			expect(mutableObj.baz).toHaveShape({ a: 1 })

			expect(Object.isExtensible(mutableObj.foo.a)).toBe(false)
			expect(Object.isExtensible(mutableObj.bar.a)).toBe(false)
			expect(Object.isExtensible(mutableObj.baz.a)).toBe(false)
			expect(Object.isFrozen(mutableObj.bar.a)).toBe(true)
			expect(Object.isSealed(mutableObj.bar.a)).toBe(true)

			// if js engine fails, then mutable should fail too
			function testAgainstJSEngine(key) {
				// change value
				createObjects()
				try {
					testObj[key].a = 2
					try {
						mutableObj[key].a = 2
					} catch (e) {
						console.error(
							"shouldn't have failed to mutate value of",
							key,
						)
					}
					// check the value actually changed [engine]
					expect(testObj[key].a).toBe(2)
					// check the value actually changed
					expect(mutableObj[key].a).toBe(2)
				} catch (e) {
					let fail = false
					try {
						mutableObj[key].a = 2
						fail = true
					} catch (e) {}
					if (fail) {
						console.error("shouldn't have mutated value of", key)
					}
				}
				expect(mutableObj[key].a).toBe(testObj[key].a)
				expect('a' in mutableObj[key]).toBe('a' in testObj[key])

				// delete value
				createObjects()
				try {
					delete testObj[key].a
					try {
						delete mutableObj[key].a
					} catch (e) {
						console.error("shouldn't have deleted property of", key)
					}
					// check the value actually changed [engine]
					expect('a' in testObj[key]).toBe(false)
					// check the value actually changed
					expect('a' in mutableObj[key]).toBe(false)
				} catch (e) {
					let fail = false
					try {
						delete mutableObj[key].a
						fail = true
					} catch (e) {}
					if (fail) {
						console.error("shouldn't have deleted property of", key)
					}
				}
				expect(mutableObj[key].a).toBe(testObj[key].a)
				expect('a' in mutableObj[key]).toBe('a' in testObj[key])

				// defineProperty
				createObjects()
				try {
					Object.defineProperty(testObj[key], 'ohai', { value: 17 })
					try {
						Object.defineProperty(mutableObj[key], 'ohai', {
							value: 17,
						})
					} catch (e) {
						console.error("shouldn't have mutated", key)
					}
				} catch (e) {
					let fail = false
					try {
						Object.defineProperty(mutableObj[key], 'ohai', {
							value: 17,
						})
						fail = true
					} catch (e) {}
					if (fail) {
						console.error("shouldn't have mutated", key)
					}
				}
				expect(mutableObj[key].ohai).toBe(testObj[key].ohai)
				expect('ohai' in mutableObj[key]).toBe('ohai' in testObj[key])

				// setPrototypeOf
				createObjects()
				try {
					Object.setPrototypeOf(testObj[key], { x: 17 })
					try {
						Object.setPrototypeOf(mutableObj[key], { x: 17 })
					} catch (e) {
						console.error("shouldn't have changed prototype of", key)
					}
				} catch (e) {
					let fail = false
					try {
						Object.setPrototypeOf(mutableObj[key], { x: 17 })
						fail = true
					} catch (e) {}
					if (fail) {
						console.error("shouldn't have changed prototype of", key)
					}
				}

				// __proto__
				createObjects()
				try {
					testObj[key].__proto__ = { x: 17 }
					try {
						mutableObj[key].__proto__ = { x: 17 }
					} catch (e) {
						console.error("shouldn't have changed prototype of", key)
					}
				} catch (e) {
					let fail = false
					try {
						mutableObj[key].__proto__ = { x: 17 }
						fail = true
					} catch (e) {}
					if (fail) {
						console.error("shouldn't have changed prototype of", key)
					}
				}
			}

			testAgainstJSEngine('foo')
			testAgainstJSEngine('bar')
			testAgainstJSEngine('baz')
		},
	)

	test(lib + 'mutable identity', expect => {
		const raw = {}
		const obj1 = mutable(raw)
		const obj2 = mutable(raw)
		const obj3 = mutable(obj1)
		const obj4 = mutable(obj2)

		expect(obj1 === obj2 && obj2 === obj3 && obj3 === obj4).toBe(true)
	})

	test(lib + 'mutable identity nested [oby]', expect => {
		const raw = {}
		const obj1 = mutable({ value: raw })
		const obj2 = mutable({ value: raw })
		const obj3 = mutable({ value: obj1 })
		const obj4 = mutable({ value: obj2 })

		expect(obj1.value === obj2.value).toBe(true)
		expect(obj2.value === obj3.value.value).toBe(true)
		expect(obj3.value === obj1).toBe(true)
		expect(obj3.value.value === obj4.value.value).toBe(true)
	})

	test(lib + 'should observe basic properties', expect => {
		let dummy
		const counter = mutable({ num: 0 })

		let calls = 0
		effect(() => {
			calls += 1
			dummy = counter.num
		})
		expect(calls).toBe(1)
		expect(dummy).toBe(0)

		counter.num = 7
		expect(dummy).toBe(7)
		expect(calls).toBe(2)
	})

	test(lib + 'should observe multiple properties', expect => {
		let dummy
		const counter = mutable({ num1: 0, num2: 0 })
		let calls = 0
		effect(() => {
			calls += 1
			dummy = counter.num1 + counter.num1 + counter.num2
		})
		expect(calls).toBe(1)
		expect(dummy).toBe(0)

		counter.num1 = counter.num2 = 7
		expect(dummy).toBe(21)
		expect(calls).toBe(3)
	})

	test(lib + 'should handle multiple effects', expect => {
		let dummy1, dummy2
		const counter = mutable({ num: 0 })
		effect(() => (dummy1 = counter.num))
		effect(() => (dummy2 = counter.num))

		expect(dummy1).toBe(0)
		expect(dummy2).toBe(0)
		counter.num++
		expect(dummy1).toBe(1)
		expect(dummy2).toBe(1)
	})

	test(lib + 'should observe nested properties', expect => {
		let dummy
		const counter = mutable({ nested: { num: 0 } })
		effect(() => (dummy = counter.nested.num))

		expect(dummy).toBe(0)
		counter.nested.num = 8
		expect(dummy).toBe(8)
	})

	test(lib + 'should observe delete operations', expect => {
		let dummy
		const obj = mutable({ prop: 'value' })
		effect(() => (dummy = obj.prop))

		expect(dummy).toBe('value')
		delete obj.prop
		expect(dummy).toBe(undefined)
	})

	test(lib + 'should observe has operations', expect => {
		let dummy
		const obj = mutable({ prop: 'value' })
		effect(() => (dummy = 'prop' in obj))

		expect(dummy).toBe(true)
		delete obj.prop
		expect(dummy).toBe(false)
		obj.prop = 12
		expect(dummy).toBe(true)
	})

	test(
		lib + 'should observe properties on the prototype chain [solid]',
		expect => {
			let dummy
			const counter = mutable({ num: 0 })
			const parentCounter = mutable({ num: 2 })
			Object.setPrototypeOf(counter, parentCounter)
			effect(() => (dummy = counter.num))

			expect(dummy).toBe(0)
			delete counter.num
			expect(dummy).toBe(2)
			parentCounter.num = 4
			expect(dummy).toBe(4)
			counter.num = 3
			expect(dummy).toBe(3)
		},
	)

	test(
		lib + 'should observe has operations on the prototype chain',
		expect => {
			let dummy
			const counter = mutable({ num: 0 })
			const parentCounter = mutable({ num: 2 })
			Object.setPrototypeOf(counter, parentCounter)
			effect(() => (dummy = 'num' in counter))

			expect(dummy).toBe(true)
			delete counter.num
			expect(dummy).toBe(true)
			delete parentCounter.num
			expect(dummy).toBe(false)
			counter.num = 3
			expect(dummy).toBe(true)
		},
	)

	test(lib + 'prototype change [oby]', expect => {
		let dummy
		let parentDummy
		let hiddenValue
		const obj = mutable({})
		const parent = mutable({
			set prop(value) {
				hiddenValue = value
			},
			get prop() {
				return hiddenValue
			},
		})
		Object.setPrototypeOf(obj, parent)
		effect(() => (dummy = obj.prop))
		effect(() => (parentDummy = parent.prop))

		expect(dummy).toBe(undefined)
		expect(parentDummy).toBe(undefined)
		obj.prop = 4
		expect(obj.prop).toBe(4)
		expect(dummy).toBe(4)

		parent.prop = 2
		expect(obj.prop).toBe(2)
		expect(dummy).toBe(2)
		expect(parentDummy).toBe(2)
		expect(parent.prop).toBe(2)
	})

	test(lib + 'should observe function call chains', expect => {
		let dummy
		const counter = mutable({ num: 0 })
		effect(() => (dummy = getNum()))

		function getNum() {
			return counter.num
		}

		expect(dummy).toBe(0)
		counter.num = 2
		expect(dummy).toBe(2)
	})

	test(lib + 'should observe iteration', expect => {
		let dummy
		const list = mutable({ value: 'Hello' })
		effect(() => (dummy = list.value))

		expect(dummy).toBe('Hello')
		list.value += ' World!'
		expect(dummy).toBe('Hello World!')
		list.value = list.value.replace('Hello ', '')
		expect(dummy).toBe('World!')
	})

	test(lib + 'should observe enumeration', expect => {
		let dummy = 0
		const numbers = mutable({ num1: 3 })
		effect(() => {
			dummy = 0
			for (let key in numbers) {
				dummy += numbers[key]
			}
		})

		expect(dummy).toBe(3)
		numbers.num2 = 4
		expect(dummy).toBe(7)
		delete numbers.num1
		expect(dummy).toBe(4)
	})

	test(lib + 'should observe symbol keyed properties', expect => {
		const key = Symbol('symbol keyed prop')

		let dummy
		let hasDummy

		const obj = mutable({ [key]: 'value' })

		let calls1 = 0
		effect(() => {
			calls1++
			dummy = obj[key]
		})

		let calls2 = 0
		effect(() => {
			calls2++
			hasDummy = key in obj
		})

		expect(calls1).toBe(1)
		expect(calls2).toBe(1)

		expect(dummy).toBe('value')
		expect(hasDummy).toBe(true)

		expect(calls1).toBe(1)
		expect(calls2).toBe(1)

		obj[key] = 'newValue'

		expect(calls1).toBe(2)
		expect(calls2).toBe(1)

		expect(dummy).toBe('newValue')
		expect(hasDummy).toBe(true)

		expect(calls1).toBe(2)
		expect(calls2).toBe(1)

		delete obj[key]

		expect(calls1).toBe(3)
		expect(calls2).toBe(2)

		expect(dummy).toBe(undefined)
		expect(hasDummy).toBe(false)
	})

	test(lib + 'should observe function valued properties', expect => {
		const oldFunc = () => {}
		const newFunc = () => {}

		let dummy
		const obj = mutable({ func: oldFunc })
		effect(() => (dummy = obj.func))

		if (lib === 'pota: ') {
			expect(typeof dummy).toBe('function')
			obj.func = newFunc
			expect(typeof obj.func).toBe('function')
		} else {
			expect(dummy).toBe(oldFunc)
			obj.func = newFunc
			expect(dummy).toBe(newFunc)
		}
	})

	test(lib + 'should observe getters relying on this', expect => {
		const obj = mutable({
			a: 1,
			get b() {
				return this.a
			},
		})

		let dummy
		effect(() => {
			dummy = obj.b
		})
		expect(dummy).toBe(1)
		obj.a++
		expect(dummy).toBe(2)
	})

	test(lib + 'should observe methods relying on this', expect => {
		const obj = mutable({
			a: 1,
			b() {
				return this.a
			},
		})

		let dummy
		effect(() => {
			dummy = obj.b()
		})
		expect(dummy).toBe(1)
		obj.a++
		expect(dummy).toBe(2)
	})

	test(
		lib + 'should not observe set operations without a value change',
		expect => {
			let hasDummy, getDummy
			const obj = mutable({ prop: 'value' })

			let calls1 = 0
			let calls2 = 0
			effect(() => {
				calls1++
				getDummy = obj.prop
			})
			effect(() => {
				calls2++
				hasDummy = 'prop' in obj
			})
			expect(calls1).toBe(1)
			expect(calls2).toBe(1)

			expect(getDummy).toBe('value')
			expect(hasDummy).toBe(true)
			obj.prop = 'value'
			expect(calls1).toBe(1)
			expect(calls2).toBe(1)
			expect(getDummy).toBe('value')
			expect(hasDummy).toBe(true)
		},
	)

	test(lib + 'should cut the loop', expect => {
		const counter = mutable({ num: 0 })
		effect(() => {
			if (counter.num < 10) {
				counter.num++
			}
		})
		expect(counter.num).toBe(10)
	})

	test(
		lib +
			'should not be triggered by mutating a property, which is used in an inactive branch',
		expect => {
			let dummy
			const obj = mutable({ prop: 'value', run: true })

			let calls = 0
			effect(() => {
				calls++
				dummy = obj.run ? obj.prop : 'other'
			})

			expect(dummy).toBe('value')
			expect(calls).toBe(1)
			obj.run = false
			expect(dummy).toBe('other')
			expect(calls).toBe(2)
			obj.prop = 'value2'
			expect(dummy).toBe('other')
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'should not run multiple times for a single mutation',
		expect => {
			let dummy
			const obj = mutable({})
			let calls = 0
			effect(() => {
				calls++
				for (const key in obj) {
					dummy = obj[key]
				}
				dummy = obj.prop
			})

			expect(calls).toBe(1)
			obj.prop = 16
			expect(dummy).toBe(16)
			expect(calls).toBe(2)
		},
	)

	test(lib + 'should observe json methods', expect => {
		let dummy = {}
		const obj = mutable({})
		effect(() => {
			dummy = JSON.parse(JSON.stringify(obj))
		})
		obj.a = 1
		expect(dummy.a).toBe(1)
	})

	test(lib + 'should observe class method invocations', expect => {
		class Model {
			count
			constructor() {
				this.count = 0
			}
			inc() {
				this.count++
			}
		}
		const model = mutable(new Model())
		let dummy
		effect(() => {
			dummy = model.count
		})
		expect(dummy).toBe(0)
		model.inc()
		expect(dummy).toBe(1)
	})

	test(
		lib +
			'should not be triggered when the value and the old value both are NaN [solid]',
		expect => {
			const obj = mutable({
				foo: NaN,
			})
			let calls = 0
			effect(() => {
				calls++
				obj.foo
			})
			expect(calls).toBe(1)
			obj.foo = NaN
			expect(calls).toBe(1)
		},
	)

	test(
		lib +
			'should not be triggered when set with the same proxy [oby]',
		expect => {
			const obj = mutable({ foo: 1 })
			const observed = mutable({ obj })

			let calls = 0
			effect(() => {
				calls++
				observed.obj
			})

			expect(calls).toBe(1)
			observed.obj = obj
			expect(calls).toBe(1)

			const obj2 = mutable({ foo: 1 })
			const observed2 = mutable({ obj2 })

			let calls2 = 0
			effect(() => {
				calls2++
				observed2.obj2
			})

			expect(calls2).toBe(1)
			observed2.obj2 = obj2
			expect(calls2).toBe(1)
		},
	)

	test(lib + 'should return updated value', expect => {
		const value = mutable({})
		const cValue = memo(() => value.foo)
		expect(cValue()).toBe(undefined)
		value.foo = 1
		expect(cValue()).toBe(1)
	})

	test(lib + 'should trigger effect', expect => {
		const value = mutable({})
		const cValue = memo(() => value.foo)
		let dummy
		effect(() => {
			dummy = cValue()
		})
		expect(dummy).toBe(undefined)
		value.foo = 1
		expect(dummy).toBe(1)
	})

	test(lib + 'should work when chained', expect => {
		const value = mutable({ foo: 0 })
		const c1 = memo(() => value.foo)
		const c2 = memo(() => c1() + 1)
		expect(c2()).toBe(1)
		expect(c1()).toBe(0)
		value.foo++
		expect(c2()).toBe(2)
		expect(c1()).toBe(1)
	})

	test(lib + 'should trigger effect when chained', expect => {
		const value = mutable({ foo: 0 })

		let calls1 = 0
		let calls2 = 0

		const c1 = memo(() => {
			calls1++
			return value.foo
		})
		const c2 = memo(() => {
			calls2++
			return c1() + 1
		})

		let dummy
		effect(() => {
			dummy = c2()
		})
		expect(dummy).toBe(1)
		expect(calls1).toBe(1)
		expect(calls2).toBe(1)
		value.foo++
		expect(dummy).toBe(2)
		// should not result in duplicate calls
		expect(calls1).toBe(2)
		expect(calls2).toBe(2)
	})

	test(
		lib + 'should trigger effect when chained (mixed invocations)',
		expect => {
			const value = mutable({ foo: 0 })

			let calls1 = 0
			let calls2 = 0

			const c1 = memo(() => {
				calls1++
				return value.foo
			})
			const c2 = memo(() => {
				calls2++
				return c1() + 1
			})

			let dummy
			effect(() => {
				dummy = c1() + c2()
			})
			expect(dummy).toBe(1)

			expect(calls1).toBe(1)
			expect(calls2).toBe(1)
			value.foo++
			expect(dummy).toBe(3)
			// should not result in duplicate calls
			expect(calls1).toBe(2)
			expect(calls2).toBe(2)
		},
	)

	test(
		lib + 'should avoid infinite loops with other effects',
		expect => {
			const nums = mutable({ num1: 0, num2: 1 })

			let calls1 = 0,
				calls2 = 0
			effect(() => {
				calls1++
				nums.num1 = nums.num2
			})
			effect(() => {
				calls2++
				nums.num2 = nums.num1
			})
			expect(nums.num1).toBe(1)
			expect(nums.num2).toBe(1)
			expect(calls1).toBe(1)
			expect(calls2).toBe(1)
			nums.num2 = 4
			expect(nums.num1).toBe(4)
			expect(nums.num2).toBe(4)
			expect(calls1).toBe(2)
			expect(calls2).toBe(2)
			nums.num1 = 10
			expect(nums.num1).toBe(10)
			expect(nums.num2).toBe(10)
			expect(calls1).toBe(3)
			expect(calls2).toBe(3)
		},
	)

	// #1246
	test(
		lib +
			'mutation on objects using mutable as prototype should trigger',
		expect => {
			const original = mutable({ foo: 1 })

			const user = Object.create(original)

			let dummy
			effect(() => (dummy = user.foo))
			expect(dummy).toBe(1)

			original.foo = 2
			expect(dummy).toBe(2)

			user.foo = 3
			expect(dummy).toBe(3)

			user.foo = 4
			expect(dummy).toBe(4)
		},
	)

	/** ARRAY */

	console.log('-------------------------------')

	test(lib + 'array: value: array property', expect => {
		const source = [{ cat: 'quack' }]
		const obj = mutable(source)

		expect(source[0].cat).toBe('quack')
		expect(obj[0].cat).toBe('quack')
	})

	test(lib + 'array: functions', expect => {
		const list = mutable([0, 1, 2])
		const filtered = memo(() => list.filter(i => i % 2))
		expect(filtered()).toHaveShape([1])
	})

	test(lib + 'array: functions nested', expect => {
		const list = mutable({ data: [0, 1, 2] })
		const filtered = memo(() => list.data.filter(i => i % 2))
		expect(filtered()).toHaveShape([1])
	})

	test(lib + 'array: equality: different array', expect => {
		const source = []
		const result = mutable(source)
		expect(result).not.toBe(source)
		expect(isProxy(result)).toBe(true)
	})

	test(lib + 'array: equality: different array nested', expect => {
		const source = []
		const result = mutable({ source })
		expect(result.source).not.toBe(source)
	})

	test(lib + 'array: equality: isArray', expect => {
		const source = []
		const result = mutable(source)
		expect(Array.isArray(result)).toBe(true)
		expect(isProxy(result)).toBe(true)
	})

	test(lib + 'array: equality: isArray nested', expect => {
		const source = { data: [] }
		const result = mutable(source)
		expect(Array.isArray(result.data)).toBe(true)
		expect(isProxy(result.data)).toBe(true)
	})

	test(lib + 'array: mutation: array property', expect => {
		const source = [{ cat: 'quack' }]
		const result = mutable(source)

		expect(source[0].cat).toBe('quack')
		expect(result[0].cat).toBe('quack')

		result[0].cat = 'murci'
		expect(source[0].cat).toBe('murci')
		expect(result[0].cat).toBe('murci')
	})

	test(lib + 'array: mutation: array todos', expect => {
		const todos = mutable([
			{ id: 1, title: 'quack', done: true },
			{ id: 2, title: 'murci', done: false },
		])

		expect(todos[1].done).toBe(false)
		todos[1].done = Infinity
		expect(todos[1].done).toBe(Infinity)

		expect(todos.length).toBe(2)
		todos.push({ id: 3, title: 'mishu', done: false })
		expect(todos.length).toBe(3)

		expect(todos[1].done).toBe(Infinity)
		expect(Array.isArray(todos)).toBe(true)
		expect(todos[0].title).toBe('quack')
		expect(todos[1].title).toBe('murci')
		expect(todos[2].title).toBe('mishu')
	})

	test(lib + 'array: mutation: array batch', expect => {
		const result = mutable([1, 2, 3])
		batch(() => {
			expect(result.length).toBe(3)
			const move = result.splice(1, 1)
			expect(result.length).toBe(2)
			result.splice(0, 0, ...move)
			expect(result.length).toBe(3)
			expect(result).toHaveShape([2, 1, 3])
			result.push(4)
			expect(result.length).toBe(4)
			expect(result).toHaveShape([2, 1, 3, 4])
		})
		expect(result.length).toBe(4)
		expect(result.pop()).toBe(4)
		expect(result.length).toBe(3)
		expect(result).toHaveShape([2, 1, 3])
	})

	test(lib + 'array: getters: array', expect => {
		const result = mutable([
			{
				cat: 'quack',
				get greeting() {
					return `hi, ${this.cat}`
				},
			},
		])
		expect(result[0].greeting).toBe('hi, quack')

		result[0].cat = 'mishu'
		expect(result[0].greeting).toBe('hi, mishu')
	})

	test(lib + 'array: getter/setters: class in array', expect => {
		class Cat {
			#name = 'quack'
			get name() {
				return this.#name
			}
			set name(value) {
				this.#name = value
			}
			get greeting() {
				return `hi, ${this.#name}`
			}
		}
		const result = mutable([new Cat()])
		expect(result[0].greeting).toBe('hi, quack')

		result[0].name = 'mishu'
		expect(result[0].greeting).toBe('hi, mishu')
	})

	test(
		lib +
			'array: supports wrapping a deep array inside a plain object',
		expect => {
			const o = mutable({ value: [] })

			let calls = 0

			effect(() => {
				calls += 1
				o.value[0]
			})
			expect(calls).toBe(1)

			o.value[0] = 3
			expect(calls).toBe(2)
			expect(o.value[0]).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o.value[0] = v
				},
				() => o.value[0],
			)
		},
	)

	test(lib + 'array: supports wrapping an array', expect => {
		const o = mutable([])

		let calls = 0

		effect(() => {
			calls += 1
			o[0]
		})
		expect(calls).toBe(1)

		o[0] = 3
		expect(calls).toBe(2)
		expect(o[0]).toBe(3)

		testValuesAndEffect(
			expect,
			v => {
				o[0] = v
			},
			() => o[0],
		)
	})

	test(
		lib + 'array: supports wrapping a deep array inside an array',
		expect => {
			const o = mutable([[]])

			let calls = 0

			effect(() => {
				calls += 1
				o[0][0]
			})
			expect(calls).toBe(1)

			o[0][0] = 3
			expect(calls).toBe(2)
			expect(o[0][0]).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o[0][0] = v
				},
				() => o[0][0],
			)
		},
	)

	test(
		lib +
			'array: supports wrapping a deep plain object inside an array',
		expect => {
			const o = mutable([{}])

			let calls = 0

			effect(() => {
				calls += 1
				o[0].lala
			})
			expect(calls).toBe(1)

			o[0].lala = 3
			expect(calls).toBe(2)
			expect(o[0].lala).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o[0].lala = v
				},
				() => o[0].lala,
			)
		},
	)

	test(
		lib +
			'array: supports not reacting when reading the length on a array, when reading all values, if the length does not actually change',
		expect => {
			const o = mutable({ value: [0] })

			let calls = 0

			effect(() => {
				calls += 1
				o.value.length
			})
			expect(calls).toBe(1)
			expect(o.value.length).toBe(1)

			o.value.splice(0, 1, 1)
			expect(calls).toBe(1)
		},
	)

	test(lib + 'array: should make Array reactive', expect => {
		const original = [{ foo: 1 }]
		const observed = mutable(original)
		expect(observed).not.toBe(original)

		// get
		expect(observed[0].foo).toBe(1)

		let calls = 0
		effect(() => {
			calls++
			observed[0].foo
		})
		expect(calls).toBe(1)

		expect(observed[0].foo).toBe(1)
		observed[0].foo = 2
		expect(observed[0].foo).toBe(2)
		expect(calls).toBe(2)

		// has
		expect(0 in observed).toBe(true)
		// ownKeys
		expect(Object.keys(observed)).toHaveShape(['0'])
	})

	test(lib + 'array: slice test', expect => {
		;[
			['ant', 'bison', 'camel', 'duck', 'elephant'],
			mutable(['ant', 'bison', 'camel', 'duck', 'elephant']),
		].forEach(array => {
			expect(array.slice(2)).toHaveShape([
				'camel',
				'duck',
				'elephant',
			])
			expect(array.slice(2, 4)).toHaveShape(['camel', 'duck'])
			expect(array.slice(1, 5)).toHaveShape([
				'bison',
				'camel',
				'duck',
				'elephant',
			])
			expect(array.slice(-2)).toHaveShape(['duck', 'elephant'])
			expect(array.slice(2, -1)).toHaveShape(['camel', 'duck'])
			expect(array.slice()).toHaveShape([
				'ant',
				'bison',
				'camel',
				'duck',
				'elephant',
			])

			expect(array.slice(-400, 600)).toHaveShape([
				'ant',
				'bison',
				'camel',
				'duck',
				'elephant',
			])

			expect(array.slice(-400, -44)).toHaveShape([])
			expect(array.slice(-44, -400)).toHaveShape([])
			expect(array.slice(2, -400)).toHaveShape([])
			expect(array.slice(2, -3)).toHaveShape([])
		})
	})

	test(lib + 'array: sliced test [solid, oby]', expect => {
		const original = [{ foo: 1 }]
		const result = mutable(original)
		const clone = result.slice()
		expect(clone[0]).toBe(result[0])
		expect(clone[0]).toBe(original[0])
		expect(clone).not.toBe(result)

		let calls = 0
		effect(() => {
			calls++
			clone[0].foo
		})
		expect(calls).toBe(1)

		expect(clone[0].foo).toBe(1)
		clone[0].foo = 2
		expect(clone[0].foo).toBe(2)
		expect(result[0].foo).toBe(2)
		expect(original[0].foo).toBe(2)
		expect(calls).toBe(2)
	})

	test(lib + 'array: mutable identity', expect => {
		const raw = []
		const obj1 = mutable(raw)
		const obj2 = mutable(raw)
		const obj3 = mutable(obj1)
		const obj4 = mutable(obj2)

		expect(obj1 === obj2 && obj2 === obj3 && obj3 === obj4).toBe(true)
	})

	test(lib + 'array: mutable identity nested [oby]', expect => {
		const raw = []
		const obj1 = mutable({ value: raw })
		const obj2 = mutable({ value: raw })
		const obj3 = mutable({ value: obj1 })
		const obj4 = mutable({ value: obj2 })

		expect(obj1.value === obj2.value).toBe(true)
		expect(obj2.value === obj3.value.value).toBe(true)
		expect(obj3.value === obj1).toBe(true)
		expect(obj3.value.value === obj4.value.value).toBe(true)
	})

	class Sub3 extends Array {
		lastPushed
		lastSearched

		push(item) {
			// console.log('pushing from SubArray', item)
			this.lastPushed = item
			return super.push(item)
		}

		indexOf(searchElement, fromIndex) {
			this.lastSearched = searchElement
			return super.indexOf(searchElement, fromIndex)
		}
	}
	class Sub2 extends Sub3 {}
	class Sub1 extends Sub2 {}
	class SubArray extends Sub1 {}

	test(
		lib + 'array: calls correct mutation method on Array subclass',
		expect => {
			const subArray = new SubArray(4, 5, 6)
			const observed = mutable(subArray)

			subArray.push(7)
			expect(subArray.lastPushed).toBe(7)
			observed.push(9)
			expect(observed.lastPushed).toBe(9)
		},
	)

	test(
		lib +
			'array: calls correct identity-sensitive method on Array subclass',
		expect => {
			const subArray = new SubArray(4, 5, 6)
			const observed = mutable(subArray)
			let index

			index = subArray.indexOf(4)
			expect(index).toBe(0)
			expect(subArray.lastSearched).toBe(4)

			index = observed.indexOf(6)
			expect(index).toBe(2)
			expect(observed.lastSearched).toBe(6)

			expect(mutable(observed)).toBe(mutable(subArray))
			expect(observed).toBe(mutable(subArray))
			expect(mutable(observed).slice()).not.toBe(
				mutable(subArray).slice(),
			)
		},
	)

	test(
		lib + 'array: should be triggered when set length with string',
		expect => {
			let ret1 = 'idle'
			let ret2 = 'idle'
			const arr1 = mutable(new Array(11).fill(0))
			const arr2 = mutable(new Array(11).fill(0))
			effect(() => {
				ret1 =
					arr1[10] === undefined ? 'arr[10] is set to empty' : 'idle'
			})
			effect(() => {
				ret2 =
					arr2[10] === undefined ? 'arr[10] is set to empty' : 'idle'
			})
			arr1.length = 2
			arr2.length = '2'
			expect(ret1).toBe(ret2)
		},
	)

	test(
		lib +
			'array: is both a getter and a setter, for shallow non-primitive properties',
		expect => {
			const obj1 = [{ foo: 123 }]
			const obj2 = []

			const o = mutable({ value: obj1 })
			expect(o.value).toHaveShape(obj1)

			o.value = obj2
			expect(o.value).toHaveShape(obj2)

			o.value = obj1
			expect(o.value).toHaveShape(obj1)

			testValuesAndEffect(
				expect,
				v => {
					o.value = v
				},
				() => o.value,
			)
		},
	)

	test(
		lib +
			'array: deeper: is both a getter and a setter, for shallow non-primitive properties',
		expect => {
			const obj1 = { foo: 123 }
			const obj2 = []

			const o = mutable({ value: { deeper: obj1 } })
			expect(o.value.deeper).toHaveShape(obj1)

			o.value.deeper = obj2
			expect(o.value.deeper).toHaveShape(obj2)

			o.value.deeper = obj1
			expect(o.value.deeper).toHaveShape(obj1)

			testValuesAndEffect(
				expect,
				v => {
					o.value.deeper = v
				},
				() => o.value.deeper,
			)
		},
	)

	test(
		lib +
			'array: is both a getter and a setter, for deep non-primitive properties',
		expect => {
			const obj1 = { foo: 123 }
			const obj2 = []

			const o = mutable({ deep: { value: obj1 } })
			expect(o.deep.value).toHaveShape(obj1)

			o.deep.value = obj2
			expect(o.deep.value).toHaveShape(obj2)

			o.deep.value = obj1
			expect(o.deep.value).toHaveShape(obj1)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib +
			'array: is both a getter and a setter, for deep non-primitive properties',
		expect => {
			const obj1 = { foo: 123 }
			const obj2 = []

			const o = mutable({ deep: { value: obj1 } })
			expect(o.deep.value).toHaveShape(obj1)

			let calls = 0
			effect(() => {
				calls += 1
				o.deep.value
			})
			expect(calls).toBe(1)

			o.deep.value = obj2
			expect(o.deep.value).toHaveShape(obj2)
			expect(calls).toBe(2)

			o.deep.value = obj1
			expect(o.deep.value).toHaveShape(obj1)
			expect(calls).toBe(3)

			testValuesAndEffect(
				expect,
				v => {
					o.deep.value = v
				},
				() => o.deep.value,
			)
		},
	)

	test(
		lib + 'array: reading length and pusing doesnt loop',
		expect => {
			const result = mutable([])

			let read = 0
			effect(() => {
				read++
				if (read < 100) {
					result.length
					result.push(Date.now())
					result.length
				}
			})

			expect(read).toBe(100)
		},
	)

	test(lib + 'array: mutating array length', expect => {
		const result = mutable([69])

		let calls = 0
		effect(() => {
			calls++
			result[40]
		})

		let calls2 = 0
		effect(() => {
			calls2++
			result[2]
		})

		let calls3 = 0
		effect(() => {
			calls3++
			result.length
		})

		expect(result.length).toBe(1)
		expect(result[40]).toBe(undefined)
		expect(result[2]).toBe(undefined)
		expect(result[0]).toBe(69)

		expect(calls).toBe(1)
		expect(calls2).toBe(1)
		expect(calls3).toBe(1)

		result.length = 45
		expect(result.length).toBe(45)
		expect(calls).toBe(1)
		expect(calls2).toBe(1)
		expect(calls3).toBe(2)

		result[40] = true
		expect(result[40]).toBe(true)
		expect(calls).toBe(2)
		expect(calls2).toBe(1)
		expect(calls3).toBe(2)

		result[41] = true
		expect(result[41]).toBe(true)
		expect(calls).toBe(2)
		expect(calls2).toBe(1)
		expect(calls3).toBe(2)

		result[2] = true
		expect(result[2]).toBe(true)
		expect(calls).toBe(2)
		expect(calls2).toBe(2)
		expect(calls3).toBe(2)

		result.push()
		expect(calls).toBe(2)
		expect(calls2).toBe(2)
		expect(calls3).toBe(2)

		result.unshift()
		expect(calls).toBe(2)
		expect(calls2).toBe(2)
		expect(calls3).toBe(2)

		result.push(1)
		expect(calls).toBe(2)
		expect(calls2).toBe(2)
		expect(calls3).toBe(3)
	})

	test(
		lib +
			'array: pushing in two separated effects doesnt loop [solid, oby]',
		expect => {
			const result = mutable([0])

			effect(() => {
				result.push(1)
			})

			effect(() => {
				result.push(2)
			})

			expect(result).toHaveShape([0, 1, 2])
		},
	)

	test(lib + 'array: track: array functions', expect => {
		const result = mutable([{ username: 'lala' }])

		let called = 0
		effect(() => {
			try {
				result[0].username
			} catch (e) {}
			called++
		})

		expect(result[0].username).toBe('lala')
		expect(called).toBe(1)

		result[0].username = 'lala2'
		expect(result[0].username).toBe('lala2')
		expect(called).toBe(2)

		// setting to same value
		result[0].username = 'lala2'
		expect(result[0].username).toBe('lala2')
		expect(called).toBe(2)

		result.pop()
		expect(called).toBe(3)
		expect(result.length).toBe(0)

		result.push({ username: 'lala2' })
		expect(called).toBe(4)

		result.push({ username: 'lala3' })
		expect(called).toBe(4)

		result.push({ username: 'lala4' })
		expect(called).toBe(4)

		result[0].username = 'lala5'
		expect(called).toBe(5)
	})

	test(
		lib + 'array: track: array functions read vs write',
		expect => {
			const result = mutable([1])

			let called = 0
			effect(() => {
				JSON.stringify(result)
				called++
			})

			expect(result[0]).toBe(1)
			expect(called).toBe(1)

			result.filter(i => i % 2)
			expect(called).toBe(1)

			result.filter(i => i % 2)
			expect(called).toBe(1)

			result.push(2)
			expect(called).toBe(2)
		},
	)

	test(lib + 'array: track: array functions read', expect => {
		const result = mutable([1])

		let called = 0
		effect(() => {
			result.filter(i => i % 2)
			called++
		})

		expect(result[0]).toBe(1)
		expect(called).toBe(1)

		result.push(2)
		expect(called).toBe(2)

		result.push(3)
		expect(called).toBe(3)

		result.push(4)
		expect(called).toBe(4)
	})

	test(
		lib +
			'array: supports not reacting when setting a non-primitive property to itself, when reading all values',
		expect => {
			const o = mutable([0])

			let calls = 0

			effect(() => {
				calls += 1
				o[0]
			})
			expect(calls).toBe(1)

			o[0] = o[0]
			expect(calls).toBe(1)

			testValuesAndEffect(
				expect,
				v => {
					o[0] = v
				},
				() => o[0],
			)
		},
	)

	test(
		lib + 'array: supports reacting when array length changes',
		expect => {
			const o = mutable({ value: [0] })

			let calls = 0

			effect(() => {
				calls += 1
				o.value.length
			})
			expect(calls).toBe(1)
			expect(o.value.length).toBe(1)

			o.value.pop()
			expect(calls).toBe(2)
			expect(o.value.length).toBe(0)
		},
	)
	test(
		lib +
			'array: supports reacting when array length is set explicity',
		expect => {
			const o = mutable({ value: [0] })

			let calls = 0

			effect(() => {
				calls += 1
				o.value.length
			})
			expect(calls).toBe(1)
			expect(o.value.length).toBe(1)

			o.value.length = 0
			expect(calls).toBe(2)
			expect(o.value.length).toBe(0)
		},
	)

	test(
		lib +
			'array: supports reacting when array length is set explicity while reading value [oby]',
		expect => {
			const o = mutable({ value: [0, 2] })

			let calls = 0

			effect(() => {
				calls += 1
				o.value[0]
				o.value[1]
			})
			expect(calls).toBe(1)
			expect(o.value.length).toBe(2)

			o.value.length = 0
			expect(calls).toBe(2)
			expect(o.value.length).toBe(0)
			expect(o.value[0]).toBe(undefined)
		},
	)

	test(
		lib +
			'array: supports not reacting when array reading function is called ',
		expect => {
			const o = mutable({ value: [0, 1] })

			let calls = 0

			effect(() => {
				calls += 1
				o.value
				o.value[0]
			})
			expect(calls).toBe(1)
			expect(o.value.length).toBe(2)

			o.value.filter(() => {})

			expect(calls).toBe(1)
			expect(o.value.length).toBe(2)
		},
	)

	test(
		lib +
			'array: supports not reacting when array writing function is called ',
		expect => {
			const o = mutable({ value: [0, 1] })

			let calls = 0

			effect(() => {
				calls += 1
				o.value[0]
			})
			expect(calls).toBe(1)
			expect(o.value.length).toBe(2)

			o.value.push(2)

			expect(calls).toBe(1)
			expect(o.value.length).toBe(3)
		},
	)

	test(
		lib + 'array: supports reacting to changes in deep arrays',
		expect => {
			const o = mutable({ value: [1, 2] })

			let calls = 0

			effect(() => {
				calls += 1
				o.value.length
			})
			expect(calls).toBe(1)

			o.value.pop()
			expect(calls).toBe(2)

			o.value.pop()
			expect(calls).toBe(3)

			o.value.push(1)
			expect(calls).toBe(4)
		},
	)

	test(
		lib + 'array: supports not reacting to no-changes in deep arrays',
		expect => {
			const o = mutable({ value: [1, 2] })

			let calls = 0

			effect(() => {
				calls += 1
				o.value.length
			})
			expect(calls).toBe(1)

			o.value.filter(() => {})
			expect(calls).toBe(1)

			o.value.filter(() => {})
			expect(calls).toBe(1)

			o.value.push(1)
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'array: supports reacting to changes in top-level arrays',
		expect => {
			const o = mutable([1, 2])

			let calls = 0

			effect(() => {
				calls += 1
				o.length
			})
			expect(calls).toBe(1)

			o.pop()
			expect(calls).toBe(2)

			o.pop()
			expect(calls).toBe(3)

			o.push(1)
			expect(calls).toBe(4)

			o[0] = true
			expect(calls).toBe(4)
		},
	)

	test(
		lib +
			'array: supports not reacting to changes in top-level arrays',
		expect => {
			const o = mutable([1, 2])

			let calls = 0

			effect(() => {
				calls += 1
				o.length
			})
			expect(calls).toBe(1)

			o.filter(() => {})
			expect(calls).toBe(1)

			o.filter(() => {})
			expect(calls).toBe(1)

			o.push(3)
			expect(calls).toBe(2)

			o.push(4)
			expect(calls).toBe(3)

			o[0] = false
			expect(calls).toBe(3)
		},
	)

	test(
		lib +
			'array: supports reacting to changes at a specific index in deep arrays',
		expect => {
			const o = mutable({ value: [1, 2] })

			let calls = 0

			effect(() => {
				calls += 1
				o.value[0]
			})
			expect(calls).toBe(1)

			o.value.pop()
			expect(calls).toBe(1)

			o.value.push(10)
			expect(calls).toBe(1)

			o.value[0] = 123
			expect(calls).toBe(2)

			o.value.unshift(1)
			expect(calls).toBe(3)

			o.value.unshift(1)
			expect(calls).toBe(3)

			o.value.unshift(2)
			expect(calls).toBe(4)
		},
	)

	test(
		lib +
			'array: supports reacting to changes at a specific index in top-level arrays',
		expect => {
			const o = mutable([1, 2])

			let calls = 0

			effect(() => {
				calls += 1
				o[0]
			})
			expect(calls).toBe(1)

			o.pop()
			expect(calls).toBe(1)

			o.push(10)
			expect(calls).toBe(1)

			o[0] = 123
			expect(calls).toBe(2)

			o.unshift(1)
			expect(calls).toBe(3)

			o.unshift(1)
			expect(calls).toBe(3)

			o.unshift(2)
			expect(calls).toBe(4)
		},
	)

	test(
		lib +
			'array: supports batching array methods automatically [oby]',
		expect => {
			const o = mutable({ value: [1, 2, 3] })

			let calls = 0

			effect(() => {
				calls += 1
				o.value.forEach(() => {})
			})
			expect(calls).toBe(1)

			o.value.forEach((value, index) => {
				o.value[index] = value * 2
			})
			expect(calls).toBe(2)
		},
	)

	test(
		lib + 'array: treats number and string properties the same way',
		expect => {
			const o = mutable([0])

			let callsNumber = 0
			let callsString = 0

			effect(() => {
				callsNumber += 1
				o[0]
			})

			effect(() => {
				callsString += 1
				o['0']
			})

			expect(callsNumber).toBe(1)
			expect(callsString).toBe(1)

			o[0] = 1

			expect(callsNumber).toBe(2)
			expect(callsString).toBe(2)

			o['0'] = 2

			expect(callsNumber).toBe(3)
			expect(callsString).toBe(3)
		},
	)

	test(
		lib +
			'array: observed value should proxy mutations to original [solid, oby]',
		expect => {
			const original = [{ foo: 1 }, { bar: 2 }]
			const observed = mutable(original)

			// set
			const value = { baz: 3 }
			const result = mutable(value)
			observed[0] = value
			expect(observed[0]).toBe(result)
			expect(isProxy(observed[0])).toBe(true)
			expect(original[0]).not.toBe(value)

			// delete
			delete observed[0]
			expect(observed[0]).toBe(undefined)
			expect(original[0]).toBe(undefined)

			// mutating methods
			observed.push(value)
			expect(observed[2]).toBe(result)
			expect(original[2]).toBe(result)
		},
	)

	test(
		lib + 'array: identity methods should work [solid, oby]',
		expect => {
			let og = {}
			let arr

			function test(value) {
				expect(arr.indexOf(value || og)).toBe(2)
				expect(arr.indexOf(value || og, 3)).toBe(-1)
				expect(arr.includes(value || og)).toBe(true)
				expect(arr.includes(value || og, 3)).toBe(false)
				expect(arr.lastIndexOf(value || og)).toBe(2)
				expect(arr.lastIndexOf(value || og, 1)).toBe(-1)
				expect(arr.lastIndexOf(0)).toBe(6)
			}

			// sanity check, plain objects
			arr = [{}, {}, og, {}, {}, {}, 0]
			test()

			// mutable
			arr = mutable([{}, {}, og, {}, {}, {}, 0])
			test()

			// should work with the proxy
			test(arr[2])

			// one is the proxy, the other is the original object
			expect(arr[2]).not.toBe(og)
		},
	)

	test(lib + 'array: identity methods should be reactive', expect => {
		const obj = {}
		const arr = mutable([obj, {}])

		const search = arr[0]

		let index = -1
		effect(() => {
			index = arr.indexOf(search)
		})
		expect(index).toBe(0)
		arr.reverse()
		expect(index).toBe(1)
		/*
			console.log(
				arr,
				search,
				arr[0],
				search === arr[0],
				search === arr[1],
			)*/
	})

	test(
		lib +
			'array: internal array functions should search for the mutable versions of it [solid, oby]',
		expect => {
			const item1 = { id: 1 }
			const item2 = { id: 2 }

			const state = mutable({ items: [] })

			state.items = [...state.items, item1]

			expect(state.items.indexOf(item1)).toBe(0)

			state.items = [...state.items, item2]

			expect(state.items.indexOf(item2)).toBe(1)
		},
	)

	test(
		lib +
			'array: delete on Array should not trigger length dependency',
		expect => {
			const arr = mutable([1, 2, 3])

			let calls = 0
			effect(() => {
				calls++
				arr.length
			})
			expect(calls).toBe(1)
			delete arr[1]
			expect(calls).toBe(1)
		},
	)

	test(
		lib +
			'array: shift on Array should trigger dependency once [oby]',
		expect => {
			const arr = mutable([1, 2, 3])

			let calls = 0
			effect(() => {
				calls++
				for (let i = 0; i < arr.length; i++) {
					arr[i]
				}
			})
			expect(calls).toBe(1)
			arr.shift()
			expect(calls).toBe(2)
		},
	)

	//#6018
	test(
		lib +
			'array: edge case: avoid trigger effect in deleteProperty when array length-decrease mutation methods called [oby]',
		expect => {
			const arr = mutable([1])

			let calls = 0
			effect(() => {
				calls++
				if (arr.length > 0) {
					arr.slice()
				}
			})
			expect(calls).toBe(1)

			arr.splice(0)
			expect(calls).toBe(2)
		},
	)

	test(
		lib +
			'array: add existing index on Array should not trigger length dependency',
		expect => {
			const array = new Array(3)
			const observed = mutable(array)
			let calls = 0
			effect(() => {
				calls++
				observed.length
			})
			expect(calls).toBe(1)
			observed[1] = 1
			expect(calls).toBe(1)
		},
	)

	test(
		lib +
			'array: add non-integer prop on Array should not trigger length dependency',
		expect => {
			const array = new Array(3)
			const observed = mutable(array)
			let calls = 0
			effect(() => {
				calls++
				observed.length
			})
			expect(calls).toBe(1)
			observed.x = 'x'
			expect(calls).toBe(1)
			observed[-1] = 'x'
			expect(calls).toBe(1)
			observed[NaN] = 'x'
			expect(calls).toBe(1)
		},
	)

	// #2427
	test(
		lib + 'array: track length on for ... in iteration',
		expect => {
			const array = mutable([1])
			let length = ''
			effect(() => {
				length = ''
				for (const key in array) {
					length += key
				}
			})
			expect(length).toBe('0')
			array.push(1)
			expect(length).toBe('01')
			expect(length).toBe('01')
		},
	)

	// #9742
	test(
		lib + 'array: mutation on user proxy of reactive Array',
		expect => {
			const array = mutable([])
			const proxy = new Proxy(array, {})
			proxy.push(1)
			expect(array.length).toBe(1)
			expect(proxy.length).toBe(1)
		},
	)

	test(lib + 'array: should observe iteration', expect => {
		let dummy
		const list = mutable(['Hello'])
		effect(() => (dummy = list.join(' ')))

		expect(dummy).toBe('Hello')
		list.push('World!')
		expect(dummy).toBe('Hello World!')
		list.shift()
		expect(dummy).toBe('World!')
	})

	test(
		lib + 'array: should observe implicit array length changes [oby]',
		expect => {
			let dummy
			const list = mutable(['Hello'])
			effect(() => (dummy = list.join(' ')))

			expect(dummy).toBe('Hello')
			list[1] = 'World!'
			expect(dummy).toBe('Hello World!')
			list[3] = 'Hello!'
			expect(dummy).toBe('Hello World!  Hello!')
		},
	)

	test(
		lib + 'array: should observe sparse array mutations',
		expect => {
			let dummy
			const list = mutable([])
			list[1] = 'World!'
			effect(() => (dummy = list.join(' ')))
			expect(dummy).toBe(' World!')

			list[0] = 'Hello'
			expect(dummy).toBe('Hello World!')

			list.pop()
			expect(dummy).toBe('Hello')
		},
	)

	test(
		lib +
			'array: should not observe well-known symbol keyed properties',
		expect => {
			const key = Symbol.isConcatSpreadable
			let dummy
			const array = mutable([])
			effect(() => (dummy = array[key]))

			expect(array[key]).toBe(undefined)
			expect(dummy).toBe(undefined)
			array[key] = true
			expect(array[key]).toBe(true)
			expect(dummy).toBe(true)
		},
	)

	test(
		lib +
			'array: should support manipulating an array while observing symbol keyed properties',
		expect => {
			const key = Symbol()
			let dummy
			const array = mutable([1, 2, 3])
			effect(() => (dummy = array[key]))

			expect(dummy).toBe(undefined)
			array.pop()
			array.shift()
			array.splice(0, 1)
			expect(dummy).toBe(undefined)
			array[key] = 'value'
			array.length = 0
			expect(dummy).toBe('value')
		},
	)

	test(
		lib +
			'array: should trigger all effects when array length is set to 0 [oby]',
		expect => {
			const observed = mutable([1])

			let length
			effect(() => {
				length = observed.length
			})

			let a
			effect(() => {
				a = observed[0]
			})
			expect(length).toBe(1)
			expect(a).toBe(1)
			// console.log(observed)

			observed[1] = 2
			// console.log(observed)
			expect(observed[1]).toBe(2)
			expect(observed.length).toBe(2)
			expect(length).toBe(2)

			observed.unshift(3)
			expect(length).toBe(3)
			expect(a).toBe(3)

			observed.length = 0
			expect(length).toBe(0)
			expect(a).toBe(undefined)
		},
	)

	test(
		lib +
			'array: identity methods should work if raw value contains reactive objects [oby]',
		expect => {
			const nativearr = []
			const obj = mutable({})
			nativearr.push(obj)

			const reactivearr = mutable(nativearr)
			// console.log(reactivearr, nativearr, obj)
			expect(reactivearr.includes(obj)).toBe(true)
		},
	)

	test(lib + 'array: iterator references', expect => {
		const item = { a: 1 }

		const obj = mutable([item, item])

		let count = 0
		let calls = 0
		effect(() => {
			calls++
			for (const key in obj) {
				count += obj.includes(obj[key]) ? 1 : 0
			}
			expect(count).toBe(2)

			for (const key in obj) {
				count += obj.indexOf(obj[key]) !== -1 ? 1 : 0
			}
			expect(count).toBe(4)

			for (const item of obj) {
				count += obj.includes(item) ? 1 : 0
			}
			expect(count).toBe(6)

			for (const item of obj) {
				count += obj.indexOf(item) !== -1 ? 1 : 0
			}
			expect(count).toBe(8)

			for (const item of obj.values()) {
				count += obj.includes(item) ? 1 : 0
			}
			expect(count).toBe(10)

			for (const item of obj.values()) {
				count += obj.indexOf(item) !== -1 ? 1 : 0
			}
			expect(count).toBe(12)

			for (const [k, item] of obj.entries()) {
				count += obj.includes(item) ? 1 : 0
			}
			expect(count).toBe(14)

			for (const [k, item] of obj.entries()) {
				count += obj.indexOf(item) !== -1 ? 1 : 0
			}
			expect(count).toBe(16)
		})

		expect(calls).toBe(1)

		expect(count).toBe(16)

		expect(calls).toBe(1)
	})

	test(
		lib +
			'array: should avoid infinite recursive loops when use Array.prototype.push/unshift/pop/shift [solid, oby]',
		expect => {
			;['push', 'unshift'].forEach(key => {
				const arr = mutable([])
				let calls1 = 0
				let calls2 = 0
				effect(() => {
					calls1++
					arr[key](1)
				})
				effect(() => {
					calls2++
					arr[key](2)
				})
				expect(arr.length).toBe(2)
				expect(calls1).toBe(1)
				expect(calls2).toBe(1)
			})
			;['pop', 'shift'].forEach(key => {
				const arr = mutable([1, 2, 3, 4])
				let calls1 = 0
				let calls2 = 0
				effect(() => {
					calls1++
					arr[key]()
				})
				effect(() => {
					calls2++
					arr[key]()
				})
				expect(arr.length).toBe(2)
				expect(calls1).toBe(1)
				expect(calls2).toBe(1)
			})
		},
	)

	/* vue array instrumentation https://github.com/vuejs/core/pull/9511/files */

	test(lib + 'array: vue array instrumentation: iterator', expect => {
		const shallow = mutable([1, 2, 3, 4])
		let result = memo(() => {
			let sum = 0
			for (let x of shallow) {
				sum += x ** 2
			}
			return sum
		})
		expect(result()).toBe(30)

		shallow[2] = 0
		expect(result()).toBe(21)

		const deep = mutable([{ val: 1 }, { val: 2 }])
		result = memo(() => {
			let sum = 0
			for (let x of deep) {
				sum += x.val ** 2
			}
			return sum
		})
		expect(result()).toBe(5)

		deep[1].val = 3
		expect(result()).toBe(10)
	})

	test(lib + 'array: vue array instrumentation: concat', expect => {
		const a1 = mutable([1, { val: 2 }])
		const a2 = mutable([{ val: 3 }])
		const a3 = [4, 5]

		let result = memo(() => a1.concat(a2, a3))
		expect(result()).toHaveShape([1, { val: 2 }, { val: 3 }, 4, 5])
		expect(isProxy(result()[1])).toBe(true)
		expect(isProxy(result()[2])).toBe(true)

		a1.shift()
		expect(result()).toHaveShape([{ val: 2 }, { val: 3 }, 4, 5])

		a2.pop()
		expect(result()).toHaveShape([{ val: 2 }, 4, 5])

		a3.pop()
		expect(result()).toHaveShape([{ val: 2 }, 4, 5])
	})

	test(lib + 'array: vue array instrumentation: entries', expect => {
		const shallow = mutable([0, 1])
		const result1 = memo(() => Array.from(shallow.entries()))
		expect(result1()).toHaveShape([
			[0, 0],
			[1, 1],
		])

		shallow[1] = 10
		expect(result1()).toHaveShape([
			[0, 0],
			[1, 10],
		])

		const deep = mutable([{ val: 0 }, { val: 1 }])
		const result2 = memo(() => Array.from(deep.entries()))
		expect(result2()).toHaveShape([
			[0, { val: 0 }],
			[1, { val: 1 }],
		])
		expect(isProxy(result2()[0][1])).toBe(true)

		deep.pop()
		expect(Array.from(result2())).toHaveShape([[0, { val: 0 }]])
	})

	test(lib + 'array: vue array instrumentation: every', expect => {
		const shallow = mutable([1, 2, 5])
		let result = memo(() => shallow.every(x => x < 5))
		expect(result()).toBe(false)

		shallow.pop()
		expect(result()).toBe(true)

		const deep = mutable([{ val: 1 }, { val: 5 }])
		result = memo(() => deep.every(x => x.val < 5))
		expect(result()).toBe(false)

		deep[1].val = 2
		expect(result()).toBe(true)
	})

	test(lib + 'array: vue array instrumentation: filter', expect => {
		const shallow = mutable([1, 2, 3, 4])
		const result1 = memo(() => shallow.filter(x => x < 3))
		expect(result1()).toHaveShape([1, 2])

		shallow[2] = 0
		expect(result1()).toHaveShape([1, 2, 0])

		const deep = mutable([{ val: 1 }, { val: 2 }])
		const result2 = memo(() => deep.filter(x => x.val < 2))
		expect(result2()).toHaveShape([{ val: 1 }])
		expect(isProxy(result2()[0])).toBe(true)

		deep[1].val = 0
		expect(result2()).toHaveShape([{ val: 1 }, { val: 0 }])
	})

	test(
		lib + 'array: vue array instrumentation: find and co.',
		expect => {
			const _reactive = mutable([{ val: 1 }, { val: 2 }])

			let find = memo(() => _reactive.find(x => x.val === 2))
			// @ts-expect-error tests are not limited to es2016
			let findLast = memo(() => _reactive.findLast(x => x.val === 2))
			let findIndex = memo(() =>
				_reactive.findIndex(x => x.val === 2),
			)
			let findLastIndex = memo(() =>
				// @ts-expect-error tests are not limited to es2016
				_reactive.findLastIndex(x => x.val === 2),
			)

			expect(find()).toBe(_reactive[1])
			expect(isProxy(find())).toBe(true)
			expect(findLast()).toBe(_reactive[1])
			expect(isProxy(findLast())).toBe(true)
			expect(findIndex()).toBe(1)
			expect(findLastIndex()).toBe(1)

			_reactive[1].val = 0

			expect(find()).not.toBe(_reactive[1])
			expect(findLast()).not.toBe(_reactive[1])
			expect(findIndex()).toBe(-1)
			expect(findLastIndex()).toBe(-1)

			_reactive.pop()

			expect(find()).toBe(undefined)
			expect(findLast()).toBe(undefined)
			expect(findIndex()).toBe(-1)
			expect(findLastIndex()).toBe(-1)

			const deep = mutable([{ val: 1 }, { val: 2 }])
			find = memo(() => deep.find(x => x.val === 2))
			// @ts-expect-error tests are not limited to es2016
			findLast = memo(() => deep.findLast(x => x.val === 2))
			findIndex = memo(() => deep.findIndex(x => x.val === 2))
			// @ts-expect-error tests are not limited to es2016
			findLastIndex = memo(() => deep.findLastIndex(x => x.val === 2))

			expect(find()).toBe(deep[1])
			expect(isProxy(find())).toBe(true)
			expect(findLast()).toBe(deep[1])
			expect(isProxy(findLast())).toBe(true)
			expect(findIndex()).toBe(1)
			expect(findLastIndex()).toBe(1)

			deep[1].val = 0

			expect(find()).toBe(undefined)
			expect(findLast()).toBe(undefined)
			expect(findIndex()).toBe(-1)
			expect(findLastIndex()).toBe(-1)
		},
	)

	test(lib + 'array: vue array instrumentation: forEach', expect => {
		const shallow = mutable([1, 2, 3, 4])
		let result = memo(() => {
			let sum = 0
			shallow.forEach(x => (sum += x ** 2))
			return sum
		})
		expect(result()).toBe(30)

		shallow[2] = 0
		expect(result()).toBe(21)

		const deep = mutable([{ val: 1 }, { val: 2 }])
		result = memo(() => {
			let sum = 0
			deep.forEach(x => (sum += x.val ** 2))
			return sum
		})
		expect(result()).toBe(5)

		deep[1].val = 3
		expect(result()).toBe(10)
	})

	test(lib + 'array: vue array instrumentation: join', expect => {
		function toString() {
			return this.val
		}
		const shallow = mutable([
			{ val: 1, toString },
			{ val: 2, toString },
		])
		let result = memo(() => shallow.join('+'))
		expect(result()).toBe('1+2')

		shallow[1].val = 23
		expect(result()).toBe('1+23')

		shallow.pop()
		expect(result()).toBe('1')

		const deep = mutable([
			{ val: 1, toString },
			{ val: 2, toString },
		])
		result = memo(() => deep.join())
		expect(result()).toBe('1,2')

		deep[1].val = 23
		expect(result()).toBe('1,23')
	})

	test(lib + 'array: vue array instrumentation: map', expect => {
		const shallow = mutable([1, 2, 3, 4])
		let result = memo(() => shallow.map(x => x ** 2))
		expect(result()).toHaveShape([1, 4, 9, 16])

		shallow[2] = 0
		expect(result()).toHaveShape([1, 4, 0, 16])

		const deep = mutable([{ val: 1 }, { val: 2 }])
		result = memo(() => deep.map(x => x.val ** 2))
		expect(result()).toHaveShape([1, 4])

		deep[1].val = 3
		expect(result()).toHaveShape([1, 9])
	})

	test(
		lib + 'array: vue array instrumentation: reduce left and right',
		expect => {
			function toString() {
				return this.val + '-'
			}
			const reactive = mutable([
				{ val: 1, toString },
				{ val: 2, toString },
			])

			expect(
				reactive.reduce((acc, x) => acc + '' + x.val, undefined),
			).toBe('undefined12')

			let left = memo(() =>
				reactive.reduce((acc, x) => acc + '' + x.val),
			)
			let right = memo(() =>
				reactive.reduceRight((acc, x) => acc + '' + x.val),
			)
			expect(left()).toBe('1-2')
			expect(right()).toBe('2-1')

			reactive[1].val = 23
			expect(left()).toBe('1-23')
			expect(right()).toBe('23-1')

			reactive.pop()
			expect(left()).toBe(reactive[0])
			expect(right()).toBe(reactive[0])

			const deep = mutable([{ val: 1 }, { val: 2 }])
			left = memo(() => deep.reduce((acc, x) => acc + x.val, '0'))
			right = memo(() =>
				deep.reduceRight((acc, x) => acc + x.val, '3'),
			)
			expect(left()).toBe('012')
			expect(right()).toBe('321')

			deep[1].val = 23
			expect(left()).toBe('0123')
			expect(right()).toBe('3231')
		},
	)

	test(lib + 'array: vue array instrumentation: some', expect => {
		const shallow = mutable([1, 2, 5])
		let result = memo(() => shallow.some(x => x > 4))
		expect(result()).toBe(true)

		shallow.pop()
		expect(result()).toBe(false)

		const deep = mutable([{ val: 1 }, { val: 5 }])
		result = memo(() => deep.some(x => x.val > 4))
		expect(result()).toBe(true)

		deep[1].val = 2
		expect(result()).toBe(false)
	})

	// Node 20+
	test(
		lib + 'array: vue array instrumentation: toReversed',
		expect => {
			// mutable
			const array = mutable([1, { val: 2 }])
			const result = memo(() => array.toReversed())
			expect(result()).toHaveShape([{ val: 2 }, 1])
			expect(isProxy(result()[0])).toBe(true)
			expect(result()[0]).toHaveShape({ val: 2 })

			array.splice(1, 1, 2)
			expect(result()).toHaveShape([2, 1])
		},
	)

	// Node 20+
	test(lib + 'array: vue array instrumentation: toSorted', expect => {
		// No comparer

		expect(mutable([2, 1, 3]).toSorted()).toHaveShape([1, 2, 3])

		const r = mutable([{ val: 2 }, { val: 1 }, { val: 3 }])
		let result

		result = memo(() => r.toSorted((a, b) => a.val - b.val))
		expect(result().map(x => x.val)).toHaveShape([1, 2, 3])
		expect(isProxy(result()[0])).toBe(true)

		r[0].val = 4
		expect(result().map(x => x.val)).toHaveShape([1, 3, 4])

		r.pop()
		expect(result().map(x => x.val)).toHaveShape([1, 4])

		const deep = mutable([{ val: 2 }, { val: 1 }, { val: 3 }])

		result = memo(() => deep.toSorted((a, b) => a.val - b.val))
		expect(result().map(x => x.val)).toHaveShape([1, 2, 3])
		expect(isProxy(result()[0])).toBe(true)

		deep[0].val = 4
		expect(result().map(x => x.val)).toHaveShape([1, 3, 4])
	})

	// Node 20+

	test(
		lib + 'array: vue array instrumentation: toSpliced',
		expect => {
			const array = mutable([1, 2, 3])
			expect(array).toHaveShape([1, 2, 3])

			const result = memo(() => array.toSpliced(1, 1, -2))
			expect(result()).toHaveShape([1, -2, 3])

			expect(array).toHaveShape([1, 2, 3])

			array[0] = 0
			expect(array).toHaveShape([0, 2, 3])

			expect(result()).toHaveShape([0, -2, 3])

			expect(array).toHaveShape([0, 2, 3])
		},
	)

	test(lib + 'array: vue array instrumentation: values', expect => {
		const reactive = mutable([{ val: 1 }, { val: 2 }])
		const result = memo(() => Array.from(reactive.values()))
		expect(result()).toHaveShape([{ val: 1 }, { val: 2 }])
		expect(isProxy(result()[0])).toBe(true)

		reactive.pop()
		expect(result()).toHaveShape([{ val: 1 }])

		const deep = mutable([{ val: 1 }, { val: 2 }])
		const firstItem = Array.from(deep.values())[0]
		expect(isProxy(firstItem)).toBe(true)
	})

	console.log('lib', lib, 'done')
	console.log('--------------------------------------')
	try {
		document.body.textContent = ''
	} catch (e) {}

	function testValuesAndEffect(expect, set, get) {
		let callsEffect = 0
		effect(() => {
			callsEffect += 1
			get()
			get()
			get()
		})
		let callsMemo = 0
		const value = memo(() => {
			callsMemo += 1
			get()
			get()
			get()
			return get()
		})

		expect(callsEffect).toBe(1)
		expect(callsMemo).toBe(0)

		set(123)
		expect(get()).toBe(123)
		expect(value()).toBe(123)
		expect(callsEffect).toBe(2)
		expect(callsMemo).toBe(1)

		set(321)
		expect(get()).toBe(321)
		expect(value()).toBe(321)
		expect(callsEffect).toBe(3)
		expect(callsMemo).toBe(2)

		set(undefined)
		expect(get()).toBe(undefined)
		expect(value()).toBe(undefined)
		expect(callsEffect).toBe(4)
		expect(callsMemo).toBe(3)

		set(null)
		expect(get()).toBe(null)
		expect(value()).toBe(null)
		expect(callsEffect).toBe(5)
		expect(callsMemo).toBe(4)

		set(1)
		expect(get()).toBe(1)
		expect(value()).toBe(1)
		expect(callsEffect).toBe(6)
		expect(callsMemo).toBe(5)

		set('')
		expect(get()).toBe('')
		expect(value()).toBe('')
		expect(callsEffect).toBe(7)
		expect(callsMemo).toBe(6)

		set('string')
		expect(get()).toBe('string')
		expect(value()).toBe('string')
		expect(callsEffect).toBe(8)
		expect(callsMemo).toBe(7)

		set([true])
		expect(get()).toHaveShape([true])
		expect(value()).toHaveShape([true])
		expect(Array.isArray(get())).toBe(true)
		expect(callsEffect).toBe(9)
		expect(callsMemo).toBe(8)

		set({ 0: true })
		expect(get()).toHaveShape({ 0: true })
		expect(value()).toHaveShape({ 0: true })
		expect(Array.isArray(get())).toBe(false)
		expect(callsEffect).toBe(10)
		expect(callsMemo).toBe(9)

		set([true])
		expect(get()).toHaveShape([true])
		expect(value()).toHaveShape([true])
		expect(Array.isArray(get())).toBe(true)
		expect(callsEffect).toBe(11)
		expect(callsMemo).toBe(10)

		set({ 0: true })
		expect(get()).toHaveShape({ 0: true })
		expect(value()).toHaveShape({ 0: true })
		expect(Array.isArray(get())).toBe(false)
		expect(callsEffect).toBe(12)
		expect(callsMemo).toBe(11)

		set(true)
		expect(get()).toBe(true)
		expect(value()).toBe(true)
		expect(callsEffect).toBe(13)
		expect(callsMemo).toBe(12)

		set(false)
		expect(get()).toBe(false)
		expect(value()).toBe(false)
		expect(callsEffect).toBe(14)
		expect(callsMemo).toBe(13)

		set(Infinity)
		expect(get()).toBe(Infinity)
		expect(value()).toBe(Infinity)
		expect(callsEffect).toBe(15)
		expect(callsMemo).toBe(14)

		set(Infinity)
		expect(get()).toBe(Infinity)
		expect(value()).toBe(Infinity)
		expect(callsEffect).toBe(15)
		expect(callsMemo).toBe(14)

		// symbol
		const s = Symbol()

		set(s)
		expect(get()).toBe(s)
		expect(value()).toBe(s)
		expect(callsEffect).toBe(16)
		expect(callsMemo).toBe(15)

		// bigint
		const bn = BigInt('9007199254740991')
		set(bn)
		expect(get()).toBe(bn)
		expect(value()).toBe(bn)
		expect(callsEffect).toBe(17)
		expect(callsMemo).toBe(16)

		// built-ins should work and return same value
		const p = Promise.resolve()
		set(p)
		expect(get()).toBe(p)
		expect(value()).toBe(p)
		expect(callsEffect).toBe(18)
		expect(callsMemo).toBe(17)

		const r = new RegExp('')
		set(r)
		expect(get()).toBe(r)
		expect(value()).toBe(r)
		expect(callsEffect).toBe(19)
		expect(callsMemo).toBe(18)

		const d = new Date()
		set(d)
		expect(get()).toBe(d)
		expect(value()).toBe(d)
		expect(callsEffect).toBe(20)
		expect(callsMemo).toBe(19)

		set(NaN)
		expect(Object.is(get(), NaN)).toBe(true)
		expect(Object.is(value(), NaN)).toBe(true)
		expect(callsEffect).toBe(21)
		expect(callsMemo).toBe(20)

		set(0)
		expect(get()).toBe(0)
		expect(value()).toBe(0)
		expect(callsEffect).toBe(22)
		expect(callsMemo).toBe(21)

		set(1)
		expect(get()).toBe(1)
		expect(value()).toBe(1)
		expect(callsEffect).toBe(23)
		expect(callsMemo).toBe(22)
	}
}
