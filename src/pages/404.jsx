import { Head } from 'pota'

import { Code, Header } from '#main'

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
				url="/pages/404.jsx"
				render={false}
			>
				quack!
			</Code>
		</>
	)
}
