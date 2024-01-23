import { Head } from 'pota'
import { Code } from './lib/components/code/code.jsx'
import { Header } from './lib/components/header.jsx'

export default function FourZeroFour() {
	return (
		<>
			<Header title="console.log('404 Not Found')">
				<Head>
					<title>404 Not Found - pota</title>
					<meta
						name="robots"
						content="noindex"
					/>
				</Head>
				throw new Error ("this should never happen")
			</Header>

			<Code
				url="/404.jsx"
				render={false}
			>
				quack!
			</Code>
		</>
	)
}
