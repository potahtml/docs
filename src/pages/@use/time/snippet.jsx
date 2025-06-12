import { render, signal } from 'pota'
import { useTimeout } from 'pota/use/time'

const [delay, setDelay] = signal(1000)

const timeout = useTimeout(() => render('timeout running!'), delay)

// the timeout needs to be started manually
timeout.start()

// timeout.stop() // it can be stopped too
