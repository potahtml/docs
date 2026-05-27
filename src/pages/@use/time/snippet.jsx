import { render, signal } from 'pota'
import { useTimeout } from 'pota/use/time'

const delay = signal(1000)

const timeout = useTimeout(() => render('timeout running!'), delay.read)

// the timeout needs to be started manually
timeout.start()

// timeout.stop() // it can be stopped too
