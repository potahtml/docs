test(lib + 'instanceof', expect => {
	const original = new WeakMap()
	const observed = mutable(original)
	expect(original instanceof WeakMap).toBe(true)
	expect(observed instanceof WeakMap).toBe(true)
})

test(lib + 'should observe mutations', expect => {
	let dummy
	const key = {}
	const map = mutable(new WeakMap())
	effect(() => {
		dummy = map.get(key)
	})

	expect(dummy).toBe(undefined)
	map.set(key, 'value')
	expect(dummy).toBe('value')
	map.set(key, 'value2')
	expect(dummy).toBe('value2')
	map.delete(key)
	expect(dummy).toBe(undefined)
})

test(
	lib + 'should observe mutations with observed value as key',
	expect => {
		let dummy
		const key = mutable({})
		const value = mutable({})
		const map = mutable(new WeakMap())
		effect(() => {
			dummy = map.get(key)
		})

		expect(dummy).toBe(undefined)
		map.set(key, value)
		expect(dummy).toBe(value)
		map.delete(key)
		expect(dummy).toBe(undefined)
	},
)

test(lib + 'should not observe custom property mutations', expect => {
	let dummy
	const map = mutable(new WeakMap())
	effect(() => (dummy = map.customProp))

	expect(dummy).toBe(undefined)
	map.customProp = 'Hello World'
	expect(dummy).toBe(undefined)
})

test(
	lib + 'should not observe non value changing mutations',
	expect => {
		let dummy
		const key = {}
		const map = mutable(new WeakMap())

		let calls = 0
		effect(() => {
			calls++
			dummy = map.get(key)
		})

		expect(dummy).toBe(undefined)
		expect(calls).toBe(1)
		map.set(key, undefined)
		expect(dummy).toBe(undefined)
		expect(calls).toBe(2)
		map.set(key, 'value')
		expect(dummy).toBe('value')
		expect(calls).toBe(3)
		map.set(key, 'value')
		expect(dummy).toBe('value')
		expect(calls).toBe(3)
		map.delete(key)
		expect(dummy).toBe(undefined)
		expect(calls).toBe(4)
		map.delete(key)
		expect(dummy).toBe(undefined)
		expect(calls).toBe(4)
	},
)

test(lib + 'should not pollute original Map with Proxies', expect => {
	const map = new WeakMap()
	const observed = mutable(map)
	const key = {}
	const val = {}
	const value = mutable(val)
	observed.set(key, value)
	expect(map.get(key)).not.toBe(value)
	expect(map.get(key)).toBe(val)
})

test(
	lib + 'should return observable versions of contained values',
	expect => {
		const observed = mutable(new WeakMap())
		const key = {}
		const value = {}
		observed.set(key, value)
		const wrapped = observed.get(key)
		expect(wrapped).not.toBe(value)
	},
)

test(lib + 'should observed nested data', expect => {
	const observed = mutable(new WeakMap())
	const key = {}
	observed.set(key, { a: 1 })
	let dummy
	effect(() => {
		dummy = observed.get(key).a
	})
	observed.get(key).a = 2
	expect(dummy).toBe(2)
})

test(
	lib +
		'should not be trigger when the value and the old value both are NaN',
	expect => {
		const map = new WeakMap()
		const key = {}
		map.set(key, NaN)
		let calls = 0
		effect(() => {
			calls++
			map.get(key)
		})
		map.set(key, NaN)
		expect(calls).toBe(1)
	},
)
test(lib + 'should return proxy from WeakMap.set call', expect => {
	const map = mutable(new WeakMap())
	const result = map.set({}, 'a')
	expect(result).toBe(map)
})

test(
	lib +
		'observing subtypes of WeakCollections(WeakMap, WeakSet) [solid]',
	expect => {
		// subtypes of WeakMap
		class CustomMap extends WeakMap {}
		const cmap = mutable(new CustomMap())

		expect(cmap instanceof WeakMap).toBe(true)

		const key = {}
		const val = {}
		cmap.set(key, val)
		expect(cmap.get(key)).toBe(val)
	},
)

test(
	lib +
		'observing subtypes of WeakCollections(WeakMap, WeakSet) deep [solid]',
	expect => {
		// subtypes of WeakMap
		class CustomMap extends WeakMap {}
		const cmap = mutable({ value: new CustomMap() })

		expect(cmap.value instanceof WeakMap).toBe(true)

		const key = {}
		const val = {}
		cmap.value.set(key, val)
		expect(cmap.value.get(key)).toBe(val)
	},
)
