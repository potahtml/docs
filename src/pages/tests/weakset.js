test(lib + 'instanceof', expect => {
	const original = new WeakSet()
	const observed = mutable(original)
	expect(original instanceof WeakSet).toBe(true)
	expect(observed instanceof WeakSet).toBe(true)
})

test(lib + 'should observe mutations', expect => {
	let dummy
	const value = {}
	const set = mutable(new WeakSet())
	effect(() => (dummy = set.has(value)))

	expect(dummy).toBe(false)
	set.add(value)
	expect(dummy).toBe(true)
	set.delete(value)
	expect(dummy).toBe(false)
})

test(lib + 'should observe mutations with observed value', expect => {
	let dummy
	const value = mutable({})
	const set = mutable(new WeakSet())
	effect(() => (dummy = set.has(value)))

	expect(dummy).toBe(false)
	set.add(value)
	expect(dummy).toBe(true)
	set.delete(value)
	expect(dummy).toBe(false)
})

test(lib + 'should not observe custom property mutations', expect => {
	let dummy
	const set = mutable(new WeakSet())
	effect(() => (dummy = set.customProp))

	expect(dummy).toBe(undefined)
	set.customProp = 'Hello World'
	expect(dummy).toBe(undefined)
})

test(
	lib + 'should not observe non value changing mutations',
	expect => {
		let dummy
		const value = {}
		const set = mutable(new WeakSet())

		let calls = 0
		effect(() => {
			calls++
			dummy = set.has(value)
		})

		expect(dummy).toBe(false)
		expect(calls).toBe(1)
		set.add(value)
		expect(dummy).toBe(true)
		expect(calls).toBe(2)
		set.add(value)
		expect(dummy).toBe(true)
		expect(calls).toBe(2)
		set.delete(value)
		expect(dummy).toBe(false)
		expect(calls).toBe(3)
		set.delete(value)
		expect(dummy).toBe(false)
		expect(calls).toBe(3)
	},
)

test(lib + 'should not pollute original Set with Proxies', expect => {
	const set = new WeakSet()
	const observed = mutable(set)
	const value = mutable({})
	observed.add(value)
	expect(observed.has(value)).toBe(true)
	expect(set.has(value)).toBe(false)
})

test(lib + 'should return proxy from WeakSet.add call', expect => {
	const set = mutable(new WeakSet())
	const result = set.add({})
	expect(result).toBe(set)
})

test(
	lib +
		'observing subtypes of WeakCollections(WeakMap, WeakSet) [solid]',
	expect => {
		// subtypes of WeakSet
		class CustomSet extends WeakSet {}
		const cset = mutable(new CustomSet())

		expect(cset instanceof WeakSet).toBe(true)

		let dummy
		effect(() => (dummy = cset.has(key)))
		expect(dummy).toBe(false)
		cset.add(key)
		expect(dummy).toBe(true)
		cset.delete(key)
		expect(dummy).toBe(false)
	},
)

test(
	lib +
		'observing subtypes of WeakCollections(WeakMap, WeakSet) deep [solid]',
	expect => {
		// subtypes of WeakSet
		class CustomSet extends WeakSet {}
		const cset = mutable({ value: new CustomSet() })

		expect(cset.value instanceof WeakSet).toBe(true)

		let dummy
		effect(() => (dummy = cset.value.has(key)))
		expect(dummy).toBe(false)
		cset.value.add(key)
		expect(dummy).toBe(true)
		cset.value.delete(key)
		expect(dummy).toBe(false)
	},
)
