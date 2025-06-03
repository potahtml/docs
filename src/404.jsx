import { Head } from 'pota/components'
import { Code } from './lib/components/code/code.jsx'
import { Header } from './lib/components/header.jsx'

export default function FourZeroFour() {
	return (
		<>
			<Header
				title="console.log('404 Not Found')"
				no-meta={true}
			>
				<Head>
					<title>404 Not Found - pota</title>

					<meta
						property="og:title"
						content="404 Not Found"
					/>
					<meta
						property="og:description"
						content="404 Not Found"
					/>
					<meta
						name="description"
						content="404 Not Found"
					/>
					<link
						rel="canonical"
						href="/404"
					/>
					<meta
						property="og:url"
						content="/404"
					/>
				</Head>
				throw new Error ("this should never happen")
			</Header>

			<Code
				code={`
				import { Head } from 'pota/components'
import { Code } from './lib/components/code/code.jsx'
import { Header } from './lib/components/header.jsx'

export default function FourZeroFour() {
	return (
		<>
			<Header
				title="console.log('404 Not Found')"
				no-meta={true}
			>
				<Head>
					<title>404 Not Found - pota</title>

					<meta
						property="og:title"
						content="404 Not Found"
					/>
					<meta
						property="og:description"
						content="404 Not Found"
					/>
					<meta
						name="description"
						content="404 Not Found"
					/>
					<link
						rel="canonical"
						href="/404"
					/>
					<meta
						property="og:url"
						content="/404"
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
`}
				render={false}
			>
				quack!
			</Code>
		</>
	)
}
