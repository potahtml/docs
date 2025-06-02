import { signal, memo, writable } from 'pota'

{
	/**
	 * @template T
	 * @type SignalFunction<T>
	 * @param {T} lala
	 * @returns {SignalFunction<T>}
	 */
	function testing(lala) {}

	const n = testing(11)
	const r = n()
	n('hola') // error
}

{
	const s = writable(() => 1)

	const r = s()
	s(33)
	s('asdasd')
	const r1 = s()
}

{
	const s = signal()
	s.write(1)
	const r1 = s.read()
}

{
	const m = memo(() => 1)
	const r = m() // number
}

{
	const s = signal(1)
	const result1 = s.write(2)
	const result2 = s.read()
}

{
	const s = signal(1)
	const result1 = s.write('type error') // error
	const result2 = s.read()
}

{
	const s = signal(1)
	s.update('type error') // error

	s.update(old => 3)
	s.update(old => old + 3)
	s.update(old => 'type error') // error
	s.update(33) // error
}

{
	const [read, write, update] = signal(0)

	read() // accessor
	write() // setter
	update(v => v) // setter+update
}

{
	const s = signal('woot')
	const [read, write, update] = s

	read() // accessor
	write() // setter
	update(v => v) // setter+update
}
