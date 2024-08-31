test(
	lib +
		'supports reacting to changes of keys caused by Object.defineProperty, adding enumerable property',
	expect => {
		const o = mutable({})

		let calls = 0

		effect(() => {
			calls += 1
			Object.keys(o)
		})
		expect(calls).toBe(1)
		expect(o.value).toBe(undefined)

		Object.defineProperty(o, 'value', {
			enumerable: true,
			value: 123,
		})

		expect(calls).toBe(2)
		expect(o.value).toBe(123)
	},
)

test(
	lib +
		'supports reacting to changes of keys caused by Object.defineProperty, deleting enumerable property',
	expect => {
		const o = mutable({ value: 1 })

		let calls = 0

		effect(() => {
			calls += 1
			Object.keys(o)
		})

		expect(calls).toBe(1)
		expect(o.value).toBe(1)

		Object.defineProperty(o, 'value', {
			enumerable: false,
			value: 123,
		})
		expect(calls).toBe(2)
		expect(o.value).toBe(123)
	},
)

test(
	lib +
		'supports not reacting to changes of keys caused by Object.defineProperty, overriding enumerable property',
	expect => {
		const o = mutable({ value: 1 })

		let calls = 0

		effect(() => {
			calls += 1
			Object.keys(o)
		})
		expect(calls).toBe(1)
		expect(o.value).toBe(1)

		Object.defineProperty(o, 'value', {
			enumerable: true,
			value: 123,
		})
		expect(calls).toBe(1)
		expect(o.value).toBe(123)
	},
)

test(
	lib +
		'supports not reacting to changes of keys caused by Object.defineProperty, adding non-enumerable property',
	expect => {
		const o = mutable({})

		let calls = 0

		effect(() => {
			calls += 1
			Object.keys(o)
		})
		expect(calls).toBe(1)
		expect(o.value).toBe(undefined)

		Object.defineProperty(o, 'value', {
			enumerable: false,
			value: 123,
		})
		expect(calls).toBe(1)
		expect(o.value).toBe(123)
	},
)

test(
	lib +
		'supports reacting to changes of in caused by Object.defineProperty, adding enumerable property',
	expect => {
		const o = mutable({})

		let calls = 0

		effect(() => {
			calls += 1
			if ('value' in o) {
			}
		})
		expect(calls).toBe(1)
		expect(o.value).toBe(undefined)

		Object.defineProperty(o, 'value', {
			enumerable: true,
			value: 123,
		})
		expect(calls).toBe(2)
		expect(o.value).toBe(123)
	},
)

test(
	lib +
		'supports not reacting to changes of in caused by Object.defineProperty, making the property non-enumerable',
	expect => {
		const o = mutable({ value: 1 })

		let calls = 0

		effect(() => {
			calls += 1
			if ('value' in o) {
			}
		})
		expect(calls).toBe(1)
		expect(o.value).toBe(1)

		Object.defineProperty(o, 'value', {
			enumerable: false,
			value: 123,
		})
		expect(calls).toBe(1)
		expect(o.value).toBe(123)
	},
)

test(
	lib +
		'supports not reacting to changes of in caused by Object.defineProperty, overriding enumerable property',
	expect => {
		const o = mutable({ value: 1 })

		let calls = 0

		effect(() => {
			calls += 1
			if ('value' in o) {
			}
		})
		expect(calls).toBe(1)
		expect(o.value).toBe(1)

		Object.defineProperty(o, 'value', {
			enumerable: true,
			value: 123,
		})
		expect(calls).toBe(1)
		expect(o.value).toBe(123)
	},
)

test(
	lib +
		'supports reacting to changes of in caused by Object.defineProperty, adding non-enumerable property',
	expect => {
		const o = mutable({})

		let calls = 0

		effect(() => {
			calls += 1
			if ('value' in o) {
			}
		})
		expect(calls).toBe(1)
		expect(o.value).toBe(undefined)

		Object.defineProperty(o, 'value', {
			enumerable: false,
			value: 123,
		})
		expect(calls).toBe(2)
		expect(o.value).toBe(123)
	},
)

test(
	lib +
		'supports reacting to changes in getters caused by Object.defineProperty, addition',
	expect => {
		const o = mutable({ foo: 1, bar: 2 })

		let calls = 0
		let args = []

		effect(() => {
			calls += 1
			args.push(o.fn)
		})
		expect(calls).toBe(1)
		expect(args).toBeLike([undefined])

		Object.defineProperty(o, 'fn', {
			get: function () {
				return this.foo + this.bar
			},
		})
		expect(calls).toBe(2)
		expect(args).toBeLike([undefined, 3])
	},
)

test(
	lib +
		'supports reacting to changes in getters caused by Object.defineProperty, override with value',
	expect => {
		const o = mutable({
			foo: 1,
			bar: 2,
			get fn() {
				return this.foo + this.bar
			},
		})

		let calls = 0
		let args = []

		effect(() => {
			calls += 1
			args.push(o.fn)
		})
		expect(calls).toBe(1)
		expect(args).toBeLike([3])

		Object.defineProperty(o, 'fn', {
			value: 123,
		})
		expect(calls).toBe(2)
		expect(args).toBeLike([3, 123])
	},
)

test(
	lib +
		'supports reacting to changes in getters caused by Object.defineProperty, override with new getter',
	expect => {
		const o = mutable({
			foo: 1,
			bar: 2,
			get fn() {
				return this.foo + this.bar
			},
		})

		let calls = 0
		let args = []

		effect(() => {
			calls += 1
			args.push(o.fn)
		})
		expect(calls).toBe(1)
		expect(args).toBeLike([3])

		Object.defineProperty(o, 'fn', {
			get: function () {
				return (this.foo + this.bar) * 10
			},
		})
		expect(calls).toBe(2)
		expect(args).toBeLike([3, 30])
	},
)

test(
	lib +
		'supports not reacting to changes in getters caused by Object.defineProperty, override with same getter',
	expect => {
		const o = mutable({
			foo: 1,
			bar: 2,
			get fn() {
				return this.foo + this.bar
			},
		})

		let calls = 0
		let args = []

		effect(() => {
			calls += 1
			args.push(o.fn)
		})
		expect(calls).toBe(1)
		expect(args).toBeLike([3])

		Object.defineProperty(o, 'fn', {
			get: Object.getOwnPropertyDescriptor(o, 'fn').get,
		})
		expect(calls).toBe(1)
		expect(args).toBeLike([3])
	},
)

test(
	lib +
		'supports not reacting to changes for a provably equivalent property descriptors set by Object.defineProperty',
	expect => {
		const o = mutable({
			foo: 1,
			bar: 2,
			get baz() {
				return 1
			},
			set baz(value) {},
		})

		let calls = 0
		let args = []

		effect(() => {
			calls += 1
			args.push(o.foo)
		})
		expect(calls).toBe(1)
		expect(args).toBeLike([1])

		Object.defineProperty(
			o,
			'foo',
			Object.getOwnPropertyDescriptor(o, 'foo'),
		)
		Object.defineProperty(
			o,
			'bar',
			Object.getOwnPropertyDescriptor(o, 'bar'),
		)
		Object.defineProperty(
			o,
			'baz',
			Object.getOwnPropertyDescriptor(o, 'baz'),
		)
		expect(calls).toBe(1)
		expect(args).toBeLike([1])
	},
)

test(
	lib +
		'supports reacting to changes in setters caused by Object.defineProperty, addition',
	expect => {
		const o = mutable({ foo: 1, bar: 2 })

		let calls = 0

		effect(() => {
			calls += 1
			o.fn = 3
			o.fn
		})
		expect(calls).toBe(1)

		expect(o.fn).toBe(3)
		expect(o._fn).toBe(undefined)

		Object.defineProperty(o, 'fn', {
			set: function (value) {
				return (this._fn = value * 10)
			},
		})

		expect(calls).toBe(2)
		expect(o.fn).toBe(undefined)
		expect(o._fn).toBe(30)
	},
)

test(
	lib +
		'supports reacting to changes in setters caused by Object.defineProperty, override with new setter',
	expect => {
		//TODO: Maybe too expensive to support

		const o = mutable({
			foo: 1,
			bar: 2,
			set fn(value) {
				this._fn = value
			},
		})

		let calls = 0

		effect(() => {
			calls += 1
			o.fn = 3
			o.fn
		})
		expect(calls).toBe(1)

		expect(o._fn).toBe(3)

		Object.defineProperty(o, 'fn', {
			set: function (value) {
				return (this._fn = value * 10)
			},
		})

		expect(calls).toBe(2)
		expect(o._fn).toBe(30)
	},
)

test(
	lib +
		'supports not reacting to changes in setters caused by Object.defineProperty, override with same setter',
	expect => {
		const o = mutable({
			foo: 1,
			bar: 2,
			set fn(value) {
				this._fn = value
			},
		})

		let calls = 0

		effect(() => {
			calls += 1
			o.fn = 3
			o.fn
		})
		expect(calls).toBe(1)
		expect(o._fn).toBe(3)

		Object.defineProperty(o, 'fn', {
			set: Object.getOwnPropertyDescriptor(o, 'fn').set,
		})

		expect(calls).toBe(1)
		expect(o._fn).toBe(3)
	},
)

test(
	lib +
		'supports reacting to changes of value caused by Object.defineProperty',
	expect => {
		const o = mutable({ value: 1 })

		let calls = 0
		let args = []

		effect(() => {
			calls += 1
			args.push(o.value)
		})
		expect(calls).toBe(1)
		expect(args).toBeLike([1])

		Object.defineProperty(o, 'value', {
			value: 123,
		})
		expect(calls).toBe(2)
		expect(args).toBeLike([1, 123])
	},
)

test(
	lib +
		'supports not reacting to changes of value caused by Object.defineProperty',
	expect => {
		const o = mutable({ value: 123 })

		let calls = 0
		let args = []

		effect(() => {
			calls += 1
			args.push(o.value)
		})
		expect(calls).toBe(1)
		expect(args).toBeLike([123])

		Object.defineProperty(o, 'value', {
			value: 123,
		})
		expect(calls).toBe(1)
		expect(args).toBeLike([123])
	},
)
